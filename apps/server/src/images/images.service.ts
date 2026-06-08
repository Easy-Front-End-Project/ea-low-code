import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import * as fs from 'fs'
import * as path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { Image } from './entities/image.entity'
import { ImageGroup } from './entities/image-group.entity'
import { CreateImageGroupDto } from './dto/create-image-group.dto'

@Injectable()
export class ImagesService {
  private readonly serverUrl: string

  constructor(
    @InjectRepository(Image)
    private imagesRepository: Repository<Image>,
    @InjectRepository(ImageGroup)
    private imageGroupsRepository: Repository<ImageGroup>,
    private configService: ConfigService
  ) {
    const port = this.configService.get('PORT', 3000)
    const host = this.configService.get('SERVER_HOST', `http://localhost:${port}`)
    this.serverUrl = host.replace(/\/$/, '')
  }

  private toFullUrl(relativeUrl: string): string {
    if (!relativeUrl) return ''
    if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
      return relativeUrl
    }
    return `${this.serverUrl}${relativeUrl}`
  }

  private formatImage(image: Image): Image {
    if (image?.url) {
      image.url = this.toFullUrl(image.url)
    }
    return image
  }

  async findAllGroups(userId?: number) {
    return await this.imageGroupsRepository.find({
      where: { isActive: true, userId: userId || undefined },
      order: { createdAt: 'DESC' },
    })
  }

  async createGroup(createImageGroupDto: CreateImageGroupDto, userId?: number) {
    const where: any = { name: createImageGroupDto.name }
    if (userId) {
      where.userId = userId
    }

    const existing = await this.imageGroupsRepository.findOne({ where })

    if (existing) {
      throw new BadRequestException('分组名称已存在')
    }

    const group = this.imageGroupsRepository.create({
      ...createImageGroupDto,
      imageCount: 0,
      userId: userId || null,
    })

    return await this.imageGroupsRepository.save(group)
  }

  async deleteGroup(id: number) {
    const group = await this.imageGroupsRepository.findOne({ where: { id } })

    if (!group) {
      throw new NotFoundException('分组不存在')
    }

    if (group.imageCount > 0) {
      throw new BadRequestException('该分组下还有图片，无法删除')
    }

    await this.imageGroupsRepository.remove(group)

    return { message: '删除成功' }
  }

  async findImages(query: any, userId?: number) {
    const { page = 1, pageSize = 20, groupId = null, keyword = '' } = query

    const queryBuilder = this.imagesRepository
      .createQueryBuilder('image')
      .leftJoinAndSelect('image.group', 'group')

    if (userId) {
      queryBuilder.andWhere('image.userId = :userId', { userId })
    }

    if (groupId) {
      queryBuilder.andWhere('image.groupId = :groupId', { groupId })
    }

    if (keyword) {
      queryBuilder.andWhere('(image.filename LIKE :keyword OR image.alt LIKE :keyword)', {
        keyword: `%${keyword}%`,
      })
    }

    const [list, total] = await queryBuilder
      .orderBy('image.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount()

    return {
      list: list.map(img => this.formatImage(img)),
      total,
      page: Number(page),
      pageSize: Number(pageSize),
    }
  }

  async findOne(id: number) {
    const image = await this.imagesRepository.findOne({
      where: { id },
      relations: ['group'],
    })

    if (!image) {
      throw new NotFoundException('图片不存在')
    }

    return this.formatImage(image)
  }

  getUploadDir(): string {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    const uploadDir = path.join(process.cwd(), 'uploads', 'images', String(year), month, day)

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    return uploadDir
  }

  generateFilename(originalName: string): string {
    const ext = path.extname(originalName).toLowerCase()
    const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']

    if (!allowedExts.includes(ext)) {
      throw new BadRequestException(`不支持的文件格式: ${ext}`)
    }

    return `${uuidv4()}${ext}`
  }

  async saveImage(
    file: Express.Multer.File,
    groupId?: number | null,
    alt?: string,
    customName?: string,
    userId?: number
  ): Promise<Image> {
    if (!file) {
      throw new BadRequestException('请选择要上传的文件')
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException('文件大小不能超过10MB')
    }

    const filename = this.generateFilename(file.originalname)
    const uploadDir = this.getUploadDir()
    const filePath = path.join(uploadDir, filename)

    try {
      fs.writeFileSync(filePath, file.buffer)
    } catch (error) {
      console.error('保存文件失败:', error)
      throw new InternalServerErrorException('文件保存失败')
    }

    const relativePath = filePath.replace(process.cwd(), '')
    const url = `${relativePath.replace(/\\/g, '/')}`

    const imageData = {
      filename: customName && customName.trim() ? customName.trim() : file.originalname,
      url,
      mimeType: file.mimetype,
      size: file.size,
      groupId: groupId || null,
      alt: alt || '',
      userId: userId || null,
    }

    const savedImage = await this.imagesRepository.save(imageData)

    if (groupId) {
      await this.updateGroupImageCount(groupId, 1)
    }

    return this.formatImage(savedImage)
  }

  async deleteImage(id: number) {
    const image = await this.imagesRepository.findOne({ where: { id } })

    if (!image) {
      throw new NotFoundException('图片不存在')
    }

    const filePath = path.join(process.cwd(), image.url)

    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    } catch (error) {
      console.error('删除物理文件失败:', error)
    }

    if (image.groupId) {
      await this.updateGroupImageCount(image.groupId, -1)
    }

    await this.imagesRepository.remove(image)

    return { message: '删除成功' }
  }

  async updateImage(id: number, data: { groupId?: number; alt?: string }) {
    const image = await this.imagesRepository.findOne({ where: { id } })

    if (!image) {
      throw new NotFoundException('图片不存在')
    }

    const oldGroupId = image.groupId

    Object.assign(image, data)
    const updatedImage = await this.imagesRepository.save(image)

    if (data.groupId && data.groupId !== oldGroupId) {
      if (oldGroupId) {
        await this.updateGroupImageCount(oldGroupId, -1)
      }
      await this.updateGroupImageCount(data.groupId, 1)
    }

    return this.formatImage(updatedImage)
  }

  private async updateGroupImageCount(groupId: number, delta: number) {
    await this.imageGroupsRepository.increment({ id: groupId }, 'imageCount', delta)
  }
}

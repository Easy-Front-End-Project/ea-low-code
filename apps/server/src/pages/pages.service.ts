import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Project } from './entities/project.entity'
import { PageSchema } from './entities/page-schema.entity'
import { CreateProjectDto } from './dto/create-project.dto'
import { CreatePageDto, UpdatePageDto } from './dto/page.dto'
import { getTemplateSchema } from './templates'

@Injectable()
export class PagesService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(PageSchema)
    private pageSchemaRepository: Repository<PageSchema>
  ) {}

  async findAll(userId: number, query: any) {
    const { page = 1, pageSize = 12, keyword } = query

    const queryBuilder = this.projectRepository
      .createQueryBuilder('p')
      .leftJoin('p.user', 'user')
      .addSelect([
        '(SELECT COUNT(*) FROM page_schemas ps WHERE ps.projectId = p.id) AS pageCount',
        'user.username',
        'user.email',
      ])
      .where('p.userId = :userId', { userId })

    if (keyword) {
      queryBuilder.andWhere('p.name LIKE :keyword', {
        keyword: `%${keyword}%`,
      })
    }

    // 先获取总数
    const total = await queryBuilder.getCount()

    // 使用 getRawMany 获取原始数据，包含 addSelect 的字段
    const rawList = await queryBuilder
      .orderBy('p.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getRawMany()

    return {
      list: rawList.map((project: any) => ({
        id: project.p_id,
        name: project.p_name,
        description: project.p_description,
        pageCount: parseInt(project.pageCount) || 0,
        isPublished: project.p_isPublished,
        userName: project.user_username || '',
        userAccount: project.user_email || '',
        createdAt: project.p_createdAt,
        updatedAt: project.p_updatedAt,
      })),
      total,
      page,
      pageSize,
    }
  }

  async findOne(id: number, userId: number) {
    const project = await this.projectRepository.findOne({
      where: { id, userId },
      relations: ['user', 'pages'],
    })
    if (!project) {
      throw new NotFoundException('项目不存在')
    }
    return {
      ...project,
      pageCount: project.pages?.length || 0,
    }
  }

  async findProjectPages(projectId: number, userId: number) {
    const project = await this.projectRepository.findOne({
      where: { id: projectId, userId },
    })

    if (!project) {
      throw new NotFoundException('项目不存在')
    }

    const pages = await this.pageSchemaRepository.find({
      where: { projectId },
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
    })

    return {
      list: pages.map(page => ({
        id: page.id,
        name: page.name,
        description: page.description || null,
        projectId: page.projectId,
        schema: page.schema,
        sortOrder: page.sortOrder,
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
      })),
      total: pages.length,
    }
  }

  async findPageDetail(pageId: number, userId: number) {
    const page = await this.pageSchemaRepository.findOne({
      where: { id: pageId },
      relations: ['project'],
    })

    if (!page) {
      throw new NotFoundException('页面不存在')
    }

    if (page.project.userId !== userId) {
      throw new NotFoundException('无权访问此页面')
    }

    return {
      id: page.id,
      name: page.name,
      description: page.description || null,
      projectId: page.projectId,
      schema: page.schema,
      sortOrder: page.sortOrder,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
    }
  }

  async create(userId: number, createProjectDto: CreateProjectDto) {
    const defaultPageName = '首页'

    const project = this.projectRepository.create({
      name: createProjectDto.name,
      description: createProjectDto.description,
      userId,
      isPublished: false,
    })

    const savedProject = await this.projectRepository.save(project)

    let schema: any = {
      components: [],
      config: {},
    }

    if (createProjectDto.createType === 'template' && createProjectDto.templateId) {
      const templateSchema = getTemplateSchema(createProjectDto.templateId)
      if (templateSchema) {
        schema = templateSchema
      }
    }

    const defaultPage = this.pageSchemaRepository.create({
      name: defaultPageName,
      schema,
      sortOrder: 0,
      projectId: savedProject.id,
    })

    await this.pageSchemaRepository.save(defaultPage)

    return savedProject
  }

  async createPage(userId: number, createPageDto: CreatePageDto) {
    const project = await this.projectRepository.findOne({
      where: { id: createPageDto.projectId, userId },
    })

    if (!project) {
      throw new NotFoundException('项目不存在')
    }

    const maxSortOrder = await this.pageSchemaRepository
      .createQueryBuilder('ps')
      .select('MAX(ps.sortOrder)', 'maxSort')
      .where('ps.projectId = :projectId', {
        projectId: createPageDto.projectId,
      })
      .getRawOne()

    const page = this.pageSchemaRepository.create({
      name: createPageDto.name,
      description: createPageDto.description,
      schema: {
        version: '1.0',
        components: [],
        layout: { type: 'default', config: {} },
        meta: { title: createPageDto.name, description: '', viewport: {} },
      },
      sortOrder: (parseInt(maxSortOrder?.maxSort) || 0) + 1,
      projectId: createPageDto.projectId,
    })

    return await this.pageSchemaRepository.save(page)
  }

  async update(id: number, userId: number, updateData: Record<string, any>) {
    const project = await this.findOne(id, userId)
    Object.assign(project, updateData)
    delete (project as any).pageCount
    return await this.projectRepository.save(project)
  }

  async updatePage(userId: number, updatePageDto: UpdatePageDto) {
    const { id, ...updateData } = updatePageDto

    const page = await this.pageSchemaRepository.findOne({
      where: { id },
      relations: ['project'],
    })

    if (!page) {
      throw new NotFoundException('页面不存在')
    }

    if (page.project.userId !== userId) {
      throw new NotFoundException('无权操作此页面')
    }

    Object.assign(page, updateData)
    return await this.pageSchemaRepository.save(page)
  }

  async remove(id: number, userId: number) {
    const project = await this.findOne(id, userId)
    await this.pageSchemaRepository.delete({ projectId: id })
    return await this.projectRepository.remove(project)
  }

  async clone(id: number, userId: number) {
    const source = await this.findOne(id, userId)

    const newProject = this.projectRepository.create({
      name: `${source.name} (副本)`,
      description: source.description,
      userId,
      isPublished: false,
    })

    const savedProject = await this.projectRepository.save(newProject)

    if (source.pages && source.pages.length > 0) {
      const newPages = source.pages.map(page =>
        this.pageSchemaRepository.create({
          name: `${page.name}`,
          schema: JSON.parse(JSON.stringify(page.schema)),
          sortOrder: page.sortOrder,
          projectId: savedProject.id,
        })
      )

      await this.pageSchemaRepository.save(newPages)
    }

    return savedProject
  }

  async removePage(pageId: number, userId: number) {
    const page = await this.pageSchemaRepository.findOne({
      where: { id: pageId },
    })
    if (!page) {
      throw new Error('页面不存在')
    }
    const project = await this.projectRepository.findOne({
      where: { id: page.projectId, userId },
    })
    if (!project) {
      throw new Error('无权限操作此页面')
    }
    await this.pageSchemaRepository.remove(page)
    return { success: true, message: '页面删除成功' }
  }

  async clonePage(pageId: number, userId: number) {
    const source = await this.pageSchemaRepository.findOne({
      where: { id: pageId },
    })
    if (!source) {
      throw new Error('源页面不存在')
    }
    const project = await this.projectRepository.findOne({
      where: { id: source.projectId, userId },
    })
    if (!project) {
      throw new Error('无权限操作此页面')
    }

    const clonedPage = this.pageSchemaRepository.create({
      name: `${source.name} (副本)`,
      description: source.description,
      schema: source.schema ? JSON.parse(JSON.stringify(source.schema)) : null,
      sortOrder: 0,
      projectId: project.id,
    })

    return await this.pageSchemaRepository.save(clonedPage)
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Request as NestRequest,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ImagesService } from './images.service';
import { CreateImageGroupDto } from './dto/create-image-group.dto';
import { DeleteImageGroupDto } from './dto/delete-image-group.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('图片管理')
@Controller('images')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get('groups/list')
  @ApiOperation({ summary: '获取分组列表' })
  async findAllGroups() {
    return await this.imagesService.findAllGroups();
  }

  @Post('groups/create')
  @ApiOperation({ summary: '创建分组' })
  async createGroup(
    @Body() createImageGroupDto: CreateImageGroupDto,
    @NestRequest() req: any,
  ) {
    return await this.imagesService.createGroup(createImageGroupDto);
  }

  @Post('groups/delete')
  @ApiOperation({ summary: '删除分组' })
  async deleteGroup(@Body() deleteImageGroupDto: DeleteImageGroupDto) {
    return await this.imagesService.deleteGroup(deleteImageGroupDto.id);
  }

  @Get('list')
  @ApiOperation({ summary: '获取图片列表' })
  async findImages(
    @Query() query: any,
    @NestRequest() req: any,
  ) {
    const userId = req.user.userId;
    return await this.imagesService.findImages(query, userId);
  }

  @Get('detail')
  @ApiOperation({ summary: '获取图片详情' })
  async findOne(
    @Query('id', ParseIntPipe) id: number,
  ) {
    return await this.imagesService.findOne(id);
  }

  @Post('upload')
  @ApiOperation({ summary: '上传图片' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
      fileFilter: (req, file, cb) => {
        const allowedMimes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
          'image/svg+xml',
        ];

        if (!allowedMimes.includes(file.mimetype)) {
          return cb(new Error('不支持的文件格式'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @NestRequest() req: any,
  ) {
    if (!file) {
      throw new Error('请选择要上传的文件');
    }

    const groupId = body.groupId ? parseInt(body.groupId) : null;
    const alt = body.alt || '';
    const customName = body.customName || '';

    return await this.imagesService.saveImage(file, groupId, alt, customName);
  }

  @Post('delete')
  @ApiOperation({ summary: '删除图片' })
  async deleteImage(@Body() body: { id: number }) {
    return await this.imagesService.deleteImage(body.id);
  }

  @Post('update')
  @ApiOperation({ summary: '更新图片信息' })
  async updateImage(@Body() body: { id: number; groupId?: number; alt?: string }) {
    const { id, ...data } = body;
    return await this.imagesService.updateImage(id, data);
  }
}

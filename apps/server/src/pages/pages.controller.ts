import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Request as NestRequest,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PagesService } from './pages.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { DeleteProjectDto } from './dto/delete-project.dto';
import { DeletePageDto } from './dto/delete-page.dto';
import { CreatePageDto, UpdatePageDto } from './dto/page.dto';

@ApiTags('项目管理')
@Controller('pages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Get('list')
  @ApiOperation({ summary: '获取项目列表' })
  async findAll(@NestRequest() req: any, @Query() query: any) {
    const userId = req.user.userId;
    return await this.pagesService.findAll(userId, query);
  }

  @Get('detail')
  @ApiOperation({ summary: '获取项目详情' })
  async findOne(
    @Query('id', ParseIntPipe) id: number,
    @NestRequest() req: any,
  ) {
    const userId = req.user.userId;
    return await this.pagesService.findOne(id, userId);
  }

  @Get('project-pages')
  @ApiOperation({ summary: '获取项目下的页面列表' })
  async findProjectPages(
    @Query('projectId', ParseIntPipe) projectId: number,
    @NestRequest() req: any,
  ) {
    const userId = req.user.userId;
    return await this.pagesService.findProjectPages(projectId, userId);
  }

  @Get('page-detail')
  @ApiOperation({ summary: '获取页面详情（含 Schema）' })
  async findPageDetail(
    @Query('id', ParseIntPipe) id: number,
    @NestRequest() req: any,
  ) {
    const userId = req.user.userId;
    return await this.pagesService.findPageDetail(id, userId);
  }

  @Post('create')
  @ApiOperation({ summary: '创建项目' })
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @NestRequest() req: any,
  ) {
    const userId = req.user.userId;
    return await this.pagesService.create(userId, createProjectDto);
  }

  @Post('page-create')
  @ApiOperation({ summary: '创建页面' })
  async createPage(
    @Body() createPageDto: CreatePageDto,
    @NestRequest() req: any,
  ) {
    const userId = req.user.userId;
    return await this.pagesService.createPage(userId, createPageDto);
  }

  @Post('update')
  @ApiOperation({ summary: '更新项目' })
  async update(
    @Body() updateProjectDto: UpdateProjectDto,
    @NestRequest() req: any,
  ) {
    const { id, ...data } = updateProjectDto;
    const userId = req.user.userId;
    return await this.pagesService.update(id, userId, data);
  }

  @Post('page-update')
  @ApiOperation({ summary: '更新页面信息' })
  async updatePage(
    @Body() updatePageDto: UpdatePageDto,
    @NestRequest() req: any,
  ) {
    const userId = req.user.userId;
    return await this.pagesService.updatePage(userId, updatePageDto);
  }

  @Post('delete')
  @ApiOperation({ summary: '删除项目' })
  async remove(
    @Body() deleteProjectDto: DeleteProjectDto,
    @NestRequest() req: any,
  ) {
    const userId = req.user.userId;
    return await this.pagesService.remove(deleteProjectDto.id, userId);
  }

  @Post('clone')
  @ApiOperation({ summary: '复制项目' })
  async clone(
    @Body() deleteProjectDto: DeleteProjectDto,
    @NestRequest() req: any,
  ) {
    const userId = req.user.userId;
    return await this.pagesService.clone(deleteProjectDto.id, userId);
  }

  @Post('page-delete')
  @ApiOperation({ summary: '删除页面' })
  async removePage(
    @Body() deletePageDto: DeletePageDto,
    @NestRequest() req: any,
  ) {
    const userId = req.user.userId;
    return await this.pagesService.removePage(deletePageDto.id, userId);
  }

  @Post('page-clone')
  @ApiOperation({ summary: '复制页面' })
  async clonePage(
    @Body() deletePageDto: DeletePageDto,
    @NestRequest() req: any,
  ) {
    const userId = req.user.userId;
    return await this.pagesService.clonePage(deletePageDto.id, userId);
  }
}

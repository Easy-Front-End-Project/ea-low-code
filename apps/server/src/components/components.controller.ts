import { Controller, Get, Post, Body, Query, UseGuards, Request as NestRequest, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ComponentsService } from './components.service';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { DeleteComponentDto } from './dto/delete-component.dto';
import { CreateUrlPresetDto, UpdateUrlPresetDto, DeleteUrlPresetDto } from './dto/url-preset.dto';

@ApiTags('远程组件管理')
@Controller('components')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ComponentsController {
  constructor(private readonly componentsService: ComponentsService) {}

  @Get('list')
  @ApiOperation({ summary: '获取组件列表' })
  async findAllComponents(@Query('keyword') keyword?: string, @NestRequest() req?: any) {
    return await this.componentsService.findAllComponents(req.user.userId, keyword);
  }

  @Get('detail')
  @ApiOperation({ summary: '获取组件详情' })
  async findOneComponent(@Query('id', ParseIntPipe) id: number, @NestRequest() req: any) {
    return await this.componentsService.findOneComponent(id, req.user.userId);
  }

  @Post('create')
  @ApiOperation({ summary: '创建组件' })
  async createComponent(@Body() dto: CreateComponentDto, @NestRequest() req: any) {
    return await this.componentsService.createComponent(req.user.userId, dto);
  }

  @Post('update')
  @ApiOperation({ summary: '更新组件' })
  async updateComponent(@Body() dto: UpdateComponentDto, @NestRequest() req: any) {
    const { id, ...data } = dto;
    return await this.componentsService.updateComponent(id, req.user.userId, data);
  }

  @Post('delete')
  @ApiOperation({ summary: '删除组件' })
  async removeComponent(@Body() dto: DeleteComponentDto, @NestRequest() req: any) {
    return await this.componentsService.removeComponent(dto.id, req.user.userId);
  }

  @Post('toggle-enabled')
  @ApiOperation({ summary: '切换组件启用状态' })
  async toggleEnabled(@Body() body: { id: number; enabled: boolean }, @NestRequest() req: any) {
    return await this.componentsService.toggleComponentEnabled(body.id, req.user.userId, body.enabled);
  }

  @Get('presets/list')
  @ApiOperation({ summary: '获取 URL 预设列表' })
  async findAllPresets(@NestRequest() req: any) {
    return await this.componentsService.findAllPresets(req.user.userId);
  }

  @Post('presets/create')
  @ApiOperation({ summary: '创建 URL 预设' })
  async createPreset(@Body() dto: CreateUrlPresetDto, @NestRequest() req: any) {
    return await this.componentsService.createPreset(req.user.userId, dto);
  }

  @Post('presets/update')
  @ApiOperation({ summary: '更新 URL 预设' })
  async updatePreset(@Body() dto: UpdateUrlPresetDto, @NestRequest() req: any) {
    const { id, ...data } = dto;
    return await this.componentsService.updatePreset(id, req.user.userId, data);
  }

  @Post('presets/delete')
  @ApiOperation({ summary: '删除 URL 预设' })
  async removePreset(@Body() dto: DeleteUrlPresetDto, @NestRequest() req: any) {
    return await this.componentsService.removePreset(dto.id, req.user.userId);
  }

  @Post('presets/set-default')
  @ApiOperation({ summary: '设置默认 URL 预设' })
  async setDefaultPreset(@Body() body: { id: number }, @NestRequest() req: any) {
    return await this.componentsService.setDefaultPreset(body.id, req.user.userId);
  }
}

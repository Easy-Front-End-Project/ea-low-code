import {
  Controller,
  Post,
  Body,
  Query,
  UseGuards,
  ForbiddenException,
  Request as NestRequest,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { DynamicDataService } from './dynamic-data.service'
import { ModelsService } from './models.service'

@ApiTags('动态数据')
@Controller('dynamic')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DynamicDataController {
  constructor(
    private readonly dynamicDataService: DynamicDataService,
    private readonly modelsService: ModelsService
  ) {}

  private async validateOwnership(tableName: string, userId: number) {
    const model = await this.modelsService.findByTableName(tableName)
    if (!model) {
      throw new ForbiddenException('模型不存在')
    }
    if (model.userId && model.userId !== userId) {
      throw new ForbiddenException('无权访问此数据模型')
    }
    return model
  }

  @Post('data/get')
  async find(@Query('tableName') tableName: string, @Body() body?: any, @NestRequest() req?: any) {
    if (!tableName) {
      throw new Error('tableName is required')
    }
    await this.validateOwnership(tableName, req.user.userId)
    return await this.dynamicDataService.find(tableName, body)
  }

  @Post('data/page')
  async page(@Query('tableName') tableName: string, @Body() body?: any, @NestRequest() req?: any) {
    if (!tableName) {
      throw new Error('tableName is required')
    }
    await this.validateOwnership(tableName, req.user.userId)
    return await this.dynamicDataService.page(tableName, body)
  }

  @Post('data/create')
  async create(@Query('tableName') tableName: string, @Body() body: any, @NestRequest() req?: any) {
    if (!tableName) {
      throw new Error('tableName is required')
    }
    await this.validateOwnership(tableName, req.user.userId)
    return await this.dynamicDataService.create(tableName, body)
  }

  @Post('data/update')
  async update(@Query('tableName') tableName: string, @Body() body: any, @NestRequest() req?: any) {
    if (!tableName) {
      throw new Error('tableName is required')
    }
    await this.validateOwnership(tableName, req.user.userId)
    return await this.dynamicDataService.update(tableName, body)
  }

  @Post('data/delete')
  async delete(
    @Query('tableName') tableName: string,
    @Body() body: { id: number },
    @NestRequest() req?: any
  ) {
    if (!tableName) {
      throw new Error('tableName is required')
    }
    await this.validateOwnership(tableName, req.user.userId)
    return await this.dynamicDataService.delete(tableName, body.id)
  }
}

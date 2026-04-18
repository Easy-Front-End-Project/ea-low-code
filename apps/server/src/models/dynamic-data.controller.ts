import { Controller, Post, Body, Query, Get } from '@nestjs/common';
import { DynamicDataService } from './dynamic-data.service';

@Controller('dynamic')
export class DynamicDataController {
  constructor(private readonly dynamicDataService: DynamicDataService) {}

  @Post('data/get')
  async find(@Query('tableName') tableName: string, @Body() body?: any) {
    if (!tableName) {
      throw new Error('tableName is required');
    }
    return await this.dynamicDataService.find(tableName, body);
  }

  @Post('data/page')
  async page(@Query('tableName') tableName: string, @Body() body?: any) {
    if (!tableName) {
      throw new Error('tableName is required');
    }
    return await this.dynamicDataService.page(tableName, body);
  }

  @Post('data/create')
  async create(@Query('tableName') tableName: string, @Body() body: any) {
    if (!tableName) {
      throw new Error('tableName is required');
    }
    return await this.dynamicDataService.create(tableName, body);
  }

  @Post('data/update')
  async update(@Query('tableName') tableName: string, @Body() body: any) {
    if (!tableName) {
      throw new Error('tableName is required');
    }
    return await this.dynamicDataService.update(tableName, body);
  }

  @Post('data/delete')
  async delete(
    @Query('tableName') tableName: string,
    @Body() body: { id: number }
  ) {
    if (!tableName) {
      throw new Error('tableName is required');
    }
    return await this.dynamicDataService.delete(tableName, body.id);
  }
}

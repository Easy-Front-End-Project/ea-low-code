import { Controller, Get, Post, Body, Query, ParseIntPipe } from '@nestjs/common';
import { ModelsService } from './models.service';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';
import { DeleteModelDto } from './dto/delete-model.dto';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { DeleteFieldDto } from './dto/delete-field.dto';

@Controller('models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Get('list')
  async list(@Query('keyword') keyword?: string) {
    return await this.modelsService.findAll(keyword);
  }

  @Get('detail')
  async detail(@Query('id', ParseIntPipe) id: number) {
    const { model, fields } = await this.modelsService.findModelWithFields(id);
    return { model, fields };
  }

  @Post('create')
  async create(@Body() dto: CreateModelDto) {
    return await this.modelsService.createModel(dto);
  }

  @Post('update')
  async update(@Body() dto: UpdateModelDto) {
    const { id, ...data } = dto;
    return await this.modelsService.updateModel(id, data);
  }

  @Post('delete')
  async remove(@Body() dto: DeleteModelDto) {
    await this.modelsService.deleteModel(dto.id);
    return { success: true };
  }

  @Get('fields/list')
  async fieldsList(
    @Query('modelId', ParseIntPipe) modelId: number,
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '50',
  ) {
    return await this.modelsService.findFields(modelId, Number(page), Number(pageSize));
  }

  @Post('fields/create')
  async createField(@Body() dto: CreateFieldDto) {
    return await this.modelsService.createField(dto);
  }

  @Post('fields/update')
  async updateField(@Body() dto: UpdateFieldDto) {
    const { id, ...data } = dto;
    return await this.modelsService.updateField(id, data as Partial<UpdateFieldDto>);
  }

  @Post('fields/delete')
  async deleteField(@Body() dto: DeleteFieldDto) {
    await this.modelsService.deleteField(dto.id);
    return { success: true };
  }

  @Post('fields/sort')
  async sortFields(@Body() body: { modelId: number; fieldIds: number[] }) {
    await this.modelsService.sortFields(body.modelId, body.fieldIds);
    return { success: true };
  }
}

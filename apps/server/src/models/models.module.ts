import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelsController } from './models.controller';
import { ModelsService } from './models.service';
import { DynamicDataController } from './dynamic-data.controller';
import { DynamicDataService } from './dynamic-data.service';
import { DynamicModel } from './entities/dynamic-model.entity';
import { ModelField } from './entities/model-field.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DynamicModel, ModelField])],
  controllers: [ModelsController, DynamicDataController],
  providers: [ModelsService, DynamicDataService],
  exports: [ModelsService, DynamicDataService],
})
export class ModelsModule {}

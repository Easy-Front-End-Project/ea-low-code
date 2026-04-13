import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagesController } from './pages.controller';
import { PagesService } from './pages.service';
import { Project } from './entities/project.entity';
import { PageSchema } from './entities/page-schema.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, PageSchema])],
  controllers: [PagesController],
  providers: [PagesService],
  exports: [PagesService],
})
export class PagesModule {}

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StatsController } from './stats.controller'
import { StatsService } from './stats.service'
import { Project } from '../pages/entities/project.entity'
import { RemoteComponent } from '../components/entities/remote-component.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Project, RemoteComponent])],
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsService],
})
export class StatsModule {}

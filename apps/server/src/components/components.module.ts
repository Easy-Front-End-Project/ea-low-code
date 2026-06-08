import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ComponentsController } from './components.controller'
import { ComponentsService } from './components.service'
import { RemoteComponent } from './entities/remote-component.entity'
import { UrlPreset } from './entities/url-preset.entity'

@Module({
  imports: [TypeOrmModule.forFeature([RemoteComponent, UrlPreset])],
  controllers: [ComponentsController],
  providers: [ComponentsService],
  exports: [ComponentsService],
})
export class ComponentsModule {}

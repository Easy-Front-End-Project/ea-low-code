import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ImagesController } from './images.controller'
import { ImagesService } from './images.service'
import { Image } from './entities/image.entity'
import { ImageGroup } from './entities/image-group.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Image, ImageGroup])],
  controllers: [ImagesController],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}

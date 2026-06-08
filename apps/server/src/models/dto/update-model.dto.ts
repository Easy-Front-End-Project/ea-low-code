import { PartialType } from '@nestjs/swagger'
import { IsInt, Min } from 'class-validator'
import { CreateModelDto } from './create-model.dto'
import { IsOptional } from 'class-validator'

export class UpdateModelDto extends PartialType(CreateModelDto) {
  @IsInt()
  @Min(1, { message: 'id必须大于0' })
  id: number
}

import { PartialType } from '@nestjs/swagger'
import { IsInt, Min } from 'class-validator'
import { CreateFieldDto } from './create-field.dto'

export class UpdateFieldDto extends PartialType(CreateFieldDto) {
  @IsInt()
  @Min(1, { message: 'id必须大于0' })
  id: number
}

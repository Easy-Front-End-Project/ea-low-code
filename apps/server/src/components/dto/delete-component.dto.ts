import { IsInt } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class DeleteComponentDto {
  @ApiProperty({ description: '组件 ID' })
  @IsInt()
  id: number
}

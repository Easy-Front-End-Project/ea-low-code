import { IsInt } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class DeleteUserDto {
  @ApiProperty({ description: '用户ID', example: 1 })
  @IsInt()
  id: number
}

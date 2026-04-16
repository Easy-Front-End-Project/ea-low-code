import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeletePageDto {
  @ApiProperty({ description: '页面ID', example: 1 })
  @IsInt()
  id: number;
}

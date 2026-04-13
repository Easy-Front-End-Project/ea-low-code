import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteProjectDto {
  @ApiProperty({ description: '项目ID' })
  @IsInt()
  id: number;
}

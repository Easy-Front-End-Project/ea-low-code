import { IsInt, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProjectDto {
  @ApiProperty({ description: '项目ID', required: true })
  @IsInt()
  id: number;

  @ApiProperty({ description: '项目名称', required: false })
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @ApiProperty({ description: '项目描述', required: false })
  @IsOptional()
  @MaxLength(500)
  description?: string;
}

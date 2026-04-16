import { IsInt, IsOptional, IsObject, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePageDto {
  @ApiProperty({ description: '所属项目ID', example: 1 })
  @IsInt()
  projectId: number;

  @ApiProperty({ description: '页面名称', example: '首页' })
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: '页面描述', required: false })
  @IsOptional()
  @MaxLength(500)
  @IsString()
  description?: string;
}

export class UpdatePageDto {
  @ApiProperty({ description: '页面ID', required: true })
  @IsInt()
  id: number;

  @ApiProperty({ description: '页面名称', required: false })
  @IsOptional()
  @MinLength(1)
  @MaxLength(100)
  name?: string;

  @ApiProperty({ description: '页面描述', required: false })
  @IsOptional()
  @MaxLength(500)
  @IsString()
  description?: string;

  @ApiProperty({ description: '页面 Schema（组件树 JSON）', required: false })
  @IsOptional()
  @IsObject()
  schema?: Record<string, any>;
}

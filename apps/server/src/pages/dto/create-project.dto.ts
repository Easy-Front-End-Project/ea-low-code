import { IsOptional, MaxLength, MinLength, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum CreateType {
  TEMPLATE = 'template',
  AI = 'ai',
  BLANK = 'blank',
}

export class CreateProjectDto {
  @ApiProperty({ description: '项目名称', example: '我的项目' })
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: '项目描述', required: false })
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ description: '创建方式', enum: CreateType, required: false, default: CreateType.BLANK })
  @IsOptional()
  @IsEnum(CreateType)
  createType?: CreateType;

  @ApiProperty({ description: '模板ID（模板创建时使用）', required: false })
  @IsOptional()
  @IsString()
  templateId?: string;

  @ApiProperty({ description: 'AI描述（AI创建时使用）', required: false })
  @IsOptional()
  @IsString()
  aiPrompt?: string;
}

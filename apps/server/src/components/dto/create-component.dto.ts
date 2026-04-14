import { IsString, IsOptional, IsBoolean, IsArray, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateComponentDto {
  @ApiProperty({ description: '组件名称', example: 'MyButton' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: '组件 URL', example: 'components/my-button.umd.js', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  url?: string;

  @ApiProperty({ description: 'URL 预设 ID', required: false })
  @IsOptional()
  urlPresetId?: number;

  @ApiProperty({ description: 'UMD 导出名', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  exportName?: string;

  @ApiProperty({ description: '组件类型', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  type?: string;

  @ApiProperty({ description: '图标名称', required: false, default: 'crown' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  icon?: string;

  @ApiProperty({ description: '样式文件 URL', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  styleUrl?: string;

  @ApiProperty({ description: '是否启用', default: true })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @ApiProperty({ description: '描述说明', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: '属性配置', required: false })
  @IsOptional()
  @IsArray()
  props?: any[];

  @ApiProperty({ description: '事件配置', required: false })
  @IsOptional()
  @IsArray()
  events?: any[];

  @ApiProperty({ description: '插槽配置', required: false })
  @IsOptional()
  @IsArray()
  slots?: any[];
}

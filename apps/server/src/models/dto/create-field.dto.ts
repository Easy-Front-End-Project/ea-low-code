import { IsString, IsNotEmpty, Length, MaxLength, IsOptional, IsInt, Min, IsIn, IsBoolean } from 'class-validator';

export class CreateFieldDto {
  @IsInt()
  @Min(1, { message: '模型ID必须大于0' })
  modelId: number;

  @IsString()
  @IsNotEmpty({ message: '字段中文描述不能为空' })
  @Length(1, 200, { message: '字段描述长度必须在1-200个字符之间' })
  fieldLabel: string;

  @IsString()
  @IsNotEmpty({ message: '字段名称不能为空' })
  @Length(1, 100, { message: '字段名称长度必须在1-100个字符之间' })
  fieldName: string;

  @IsString()
  @IsNotEmpty({ message: '字段类型不能为空' })
  @IsIn(['text', 'number', 'date', 'datetime', 'boolean', 'json'], { message: '无效的字段类型' })
  fieldType: string;

  @IsOptional()
  @IsInt()
  @Min(1, { message: '字段长度必须大于0' })
  fieldLength?: number;

  @IsOptional()
  @IsBoolean({ message: '是否为空必须是布尔值' })
  isNullable?: boolean;

  @IsOptional()
  @IsBoolean({ message: '是否唯一必须是布尔值' })
  isUnique?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: '默认值长度不能超过500个字符' })
  defaultValue?: string;

  @IsOptional()
  @IsInt()
  @Min(0, { message: '排序序号不能小于0' })
  sortOrder?: number;
}

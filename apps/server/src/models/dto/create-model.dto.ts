import { IsString, IsNotEmpty, Length, MaxLength, IsOptional } from 'class-validator'

export class CreateModelDto {
  @IsString()
  @IsNotEmpty({ message: '模型名称不能为空' })
  @Length(2, 50, { message: '模型名称长度必须在2-50个字符之间' })
  name: string

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: '描述长度不能超过500个字符' })
  description?: string
}

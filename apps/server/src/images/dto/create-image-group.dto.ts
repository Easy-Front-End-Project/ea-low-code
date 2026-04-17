import { IsString, IsNotEmpty, Length, MaxLength, IsOptional } from 'class-validator';

export class CreateImageGroupDto {
  @IsString()
  @IsNotEmpty({ message: '分组名称不能为空' })
  @Length(2, 50, { message: '分组名称长度必须在2-50个字符之间' })
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(200, { message: '描述长度不能超过200个字符' })
  description?: string;
}

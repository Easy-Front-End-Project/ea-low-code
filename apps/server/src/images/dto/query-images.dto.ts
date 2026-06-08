import { IsOptional, IsInt, Min, Max, IsString } from 'class-validator'
import { Type } from 'class-transformer'

export class QueryImagesDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '页码必须是整数' })
  @Min(1, { message: '页码不能小于1' })
  page?: number = 1

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '每页条数必须是整数' })
  @Min(1, { message: '每页条数不能小于1' })
  @Max(50, { message: '每页条数不能超过50' })
  pageSize?: number = 20

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '分组ID必须是整数' })
  groupId?: number | null = null

  @IsOptional()
  @IsString()
  keyword?: string = ''
}

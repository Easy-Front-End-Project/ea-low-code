import { IsInt, IsOptional, IsBoolean, IsString, MaxLength } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUrlPresetDto {
  @ApiProperty({
    description: '预设名称',
    example: '生产环境 CDN',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string

  @ApiProperty({
    description: '预设 URL',
    example: 'https://cdn.example.com/',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  url?: string

  @ApiProperty({ description: '是否为默认预设', default: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean
}

export class UpdateUrlPresetDto {
  @ApiProperty({ description: '预设 ID' })
  @Type(() => Number)
  @IsInt()
  id: number

  @ApiProperty({ description: '预设名称', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string

  @ApiProperty({ description: '预设 URL', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  url?: string

  @ApiProperty({ description: '是否为默认预设', required: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean
}

export class DeleteUrlPresetDto {
  @ApiProperty({ description: '预设 ID' })
  @IsInt()
  id: number
}

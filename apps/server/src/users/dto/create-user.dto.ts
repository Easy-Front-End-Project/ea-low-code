import { IsString, IsEmail, IsOptional, IsBoolean, Length } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty({ description: '用户名', example: 'john_doe', minLength: 2, maxLength: 50 })
  @IsString()
  @Length(2, 50)
  username: string

  @ApiProperty({ description: '邮箱地址', example: 'john@example.com' })
  @IsEmail()
  email: string

  @ApiProperty({ description: '密码', example: '123456', minLength: 6, maxLength: 100 })
  @IsString()
  @Length(6, 100)
  password: string

  @ApiPropertyOptional({ description: '昵称', example: 'John', minLength: 1, maxLength: 50 })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  nickname?: string

  @ApiPropertyOptional({ description: '是否激活', example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}

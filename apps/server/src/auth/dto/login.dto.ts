import { IsString, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @ApiProperty({ description: '用户名', example: 'john_doe', minLength: 2, maxLength: 50 })
  @IsString()
  @Length(2, 50)
  username: string

  @ApiProperty({ description: '密码', example: '123456', minLength: 6, maxLength: 100 })
  @IsString()
  @Length(6, 100)
  password: string
}

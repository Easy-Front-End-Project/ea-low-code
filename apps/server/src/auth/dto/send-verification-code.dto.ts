import { IsEmail, IsString, IsOptional } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class SendVerificationCodeDto {
  @ApiProperty({ description: '邮箱地址', example: 'user@example.com' })
  @IsEmail()
  email: string

  @ApiPropertyOptional({
    description: '用途',
    example: 'register',
    enum: ['register', 'resetPassword'],
  })
  @IsOptional()
  @IsString()
  purpose?: string
}

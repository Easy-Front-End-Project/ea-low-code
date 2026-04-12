import { IsEmail, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VerifyCodeDto {
  @ApiProperty({ description: '邮箱地址', example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '验证码', example: '123456' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ description: '用途', example: 'register', enum: ['register', 'resetPassword'] })
  @IsString()
  purpose?: string;
}

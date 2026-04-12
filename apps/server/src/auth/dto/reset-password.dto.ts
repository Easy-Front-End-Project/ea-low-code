import { IsEmail, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ description: '邮箱地址', example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '新密码', example: 'newpassword123', minLength: 6 })
  @IsString()
  @Length(6, 100)
  newPassword: string;

  @ApiProperty({ description: '验证码', example: '123456' })
  @IsString()
  code: string;
}

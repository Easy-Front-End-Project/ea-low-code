import { IsString, IsEmail, IsOptional, IsBoolean, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 50)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 100)
  password: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  nickname?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

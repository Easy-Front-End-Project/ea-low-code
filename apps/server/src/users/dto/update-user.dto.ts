import { IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserBodyDto extends PartialType(CreateUserDto) {}

export class UpdateUserDto {
  @ApiProperty({ description: '用户ID', example: 1 })
  @IsInt()
  id: number;

  @ApiPropertyOptional({ description: '用户数据', type: UpdateUserBodyDto })
  @ValidateNested()
  @Type(() => UpdateUserBodyDto)
  data: UpdateUserBodyDto;
}

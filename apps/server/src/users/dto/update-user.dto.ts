import { IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserBodyDto extends PartialType(CreateUserDto) {}

export class UpdateUserDto {
  @IsInt()
  id: number;

  @ValidateNested()
  @Type(() => UpdateUserBodyDto)
  data: UpdateUserBodyDto;
}

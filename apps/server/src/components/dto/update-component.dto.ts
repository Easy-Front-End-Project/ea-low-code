import { PartialType, ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateComponentDto } from './create-component.dto';

export class UpdateComponentDto extends PartialType(CreateComponentDto) {
  @ApiProperty({ description: '组件 ID' })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  id: number;
}

import { IsInt, Min } from 'class-validator';

export class DeleteImageGroupDto {
  @IsInt()
  @Min(1, { message: '分组ID必须大于0' })
  id: number;
}

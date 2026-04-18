import { IsInt, Min } from 'class-validator';

export class DeleteFieldDto {
  @IsInt()
  @Min(1, { message: 'id必须大于0' })
  id: number;
}

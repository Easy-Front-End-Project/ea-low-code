import { IsInt, Min } from 'class-validator'

export class DeleteModelDto {
  @IsInt()
  @Min(1, { message: 'id必须大于0' })
  id: number
}

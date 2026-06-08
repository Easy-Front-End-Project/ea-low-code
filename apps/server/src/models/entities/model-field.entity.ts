import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm'
import { DynamicModel } from './dynamic-model.entity'

@Entity('model_fields')
export class ModelField {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'int' })
  modelId: number

  @ManyToOne(() => DynamicModel)
  @JoinColumn({ name: 'modelId' })
  model: DynamicModel

  @Column({ length: 100 })
  fieldName: string

  @Column({ length: 200 })
  fieldLabel: string

  @Column({ length: 50 })
  fieldType: string

  @Column({ type: 'int', nullable: true })
  fieldLength: number | null

  @Column({ default: false })
  isNullable: boolean

  @Column({ default: false })
  isUnique: boolean

  @Column({ type: 'varchar', length: 500, nullable: true })
  defaultValue: string | null

  @Column({ default: 0 })
  sortOrder: number

  @Column({ default: false })
  isSystem: boolean

  @CreateDateColumn()
  createdAt: Date
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'

@Entity('dynamic_models')
export class DynamicModel {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 100, unique: true })
  name: string

  @Column({ length: 100, unique: true })
  tableName: string

  @Column({ length: 500, nullable: true })
  description: string

  @Column({ default: true })
  isActive: boolean

  @Column({ type: 'int', nullable: true })
  userId: number | null

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

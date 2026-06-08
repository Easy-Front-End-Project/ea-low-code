import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

@Entity('users')
export class User {
  @ApiProperty({ description: '用户ID', example: 1 })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ description: '用户名', example: 'john_doe' })
  @Column({ length: 50, unique: true })
  username: string

  @ApiProperty({ description: '邮箱地址', example: 'john@example.com' })
  @Column({ length: 100 })
  email: string

  @Column({ length: 100, select: false })
  password: string

  @ApiProperty({ description: '昵称', example: 'John', nullable: true })
  @Column({ length: 50, nullable: true })
  nickname: string

  @ApiProperty({ description: '是否激活', example: true })
  @Column({ default: true })
  isActive: boolean

  @ApiProperty({ description: '创建时间', example: '2024-01-01T00:00:00.000Z' })
  @CreateDateColumn()
  createdAt: Date

  @ApiProperty({ description: '更新时间', example: '2024-01-01T00:00:00.000Z' })
  @UpdateDateColumn()
  updatedAt: Date
}

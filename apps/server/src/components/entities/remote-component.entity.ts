import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { User } from '../../users/entities/user.entity'

@Entity('remote_components')
export class RemoteComponent {
  @ApiProperty({ description: '组件ID', example: 1 })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ description: '组件名称', example: 'MyButton' })
  @Column({ length: 100 })
  name: string

  @ApiProperty({
    description: '组件 URL',
    example: 'components/my-button.umd.js',
    required: false,
  })
  @Column({ length: 500, name: 'url', nullable: true })
  componentUrl?: string

  @ApiProperty({ description: 'URL 预设 ID', required: false })
  @Column({ nullable: true, name: 'url_preset_id' })
  urlPresetId?: number

  @ApiProperty({ description: 'UMD 导出名', required: false })
  @Column({ length: 100, nullable: true, name: 'export_name' })
  exportName?: string

  @ApiProperty({ description: '组件类型', required: false })
  @Column({ length: 100, nullable: true })
  type?: string

  @ApiProperty({ description: '图标名称', default: 'crown' })
  @Column({ length: 50, default: 'crown' })
  icon: string

  @ApiProperty({ description: '样式文件 URL', required: false })
  @Column({ length: 500, nullable: true, name: 'style_url' })
  styleUrl?: string

  @ApiProperty({ description: '是否启用', default: true })
  @Column({ default: true, name: 'is_enabled' })
  isEnabled: boolean

  @ApiProperty({ description: '描述说明', required: false })
  @Column({ type: 'text', nullable: true })
  description?: string

  @ApiProperty({ description: '属性配置', required: false })
  @Column({ type: 'json', nullable: true })
  props?: any[]

  @ApiProperty({ description: '事件配置', required: false })
  @Column({ type: 'json', nullable: true })
  events?: any[]

  @ApiProperty({ description: '插槽配置', required: false })
  @Column({ type: 'json', nullable: true })
  slots?: any[]

  @Column({ type: 'int', nullable: false, name: 'user_id' })
  userId: number

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}

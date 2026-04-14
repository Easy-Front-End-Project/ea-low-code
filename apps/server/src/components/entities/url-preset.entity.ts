import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

@Entity('url_presets')
export class UrlPreset {
  @ApiProperty({ description: '预设 ID', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '预设名称', example: '生产环境 CDN' })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({ description: '预设 URL', example: 'https://cdn.example.com/' })
  @Column({ length: 500 })
  url: string;

  @ApiProperty({ description: '是否为默认预设', default: false })
  @Column({ default: false, name: 'is_default' })
  isDefault: boolean;

  @Column({ type: 'int', nullable: false, name: 'user_id' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

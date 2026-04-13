import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { PageSchema } from './page-schema.entity';

@Entity('projects')
export class Project {
  @ApiProperty({ description: '项目ID', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '项目名称', example: '我的项目' })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({ description: '项目描述', required: false })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'int', nullable: false })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({ description: '是否发布', default: false })
  @Column({ default: false })
  isPublished: boolean;

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => PageSchema, (page) => page.project)
  pages: PageSchema[];
}

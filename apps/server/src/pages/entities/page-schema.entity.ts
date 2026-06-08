import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Project } from './project.entity';
import type { PageSchema as PageSchemaType } from '@ea-low-code/shared';

@Entity('page_schemas')
export class PageSchema {
  @ApiProperty({ description: '页面ID', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '页面名称', example: '首页' })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({ description: '页面描述', required: false })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: '页面 Schema（组件树 JSON）', required: false })
  @Column({ type: 'json', nullable: true })
  schema?: PageSchemaType;

  @ApiProperty({ description: '排序顺序', default: 0 })
  @Column({ default: 0 })
  sortOrder: number;

  @Column({ type: 'int', nullable: false })
  projectId: number;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn()
  updatedAt: Date;
}

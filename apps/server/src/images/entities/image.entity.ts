import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ImageGroup } from './image-group.entity';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  filename: string;

  @Column({ length: 500 })
  url: string;

  @Column({ length: 20 })
  mimeType: string;

  @Column({ type: 'int' })
  size: number;

  @Column({ nullable: true })
  groupId: number | null;

  @ManyToOne(() => ImageGroup)
  @JoinColumn({ name: 'groupId' })
  group: ImageGroup;

  @Column({ length: 100, nullable: true })
  alt: string;

  @CreateDateColumn()
  createdAt: Date;
}

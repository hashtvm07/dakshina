import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('content_blocks')
export class ContentBlock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 120 })
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ length: 500, nullable: true })
  imageUrl?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

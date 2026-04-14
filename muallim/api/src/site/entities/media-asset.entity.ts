import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('media_assets')
export class MediaAsset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 120 })
  title: string;

  @Column({ length: 500 })
  imageUrl: string;

  @Column({ length: 40, default: 'gallery' })
  category: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

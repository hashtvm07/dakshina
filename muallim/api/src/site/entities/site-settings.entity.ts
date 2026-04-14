import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('site_settings')
export class SiteSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, default: 'default' })
  slug: string;

  @Column({ default: true })
  registerEnabled: boolean;

  @Column({ length: 180 })
  heroTitle: string;

  @Column({ length: 220 })
  heroSubtitle: string;

  @Column({ type: 'text' })
  heroDescription: string;

  @Column({ length: 500 })
  heroImageUrl: string;

  @Column({ length: 500 })
  bannerImageUrl: string;

  @Column({ length: 180 })
  aboutTitle: string;

  @Column({ type: 'text' })
  aboutBody: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

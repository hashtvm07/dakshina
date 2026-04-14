import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('muallims')
export class Muallim {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 32 })
  publicId: string;

  @Column({ length: 120 })
  name: string;

  @Column({ length: 120, unique: true })
  username: string;

  @Column({ length: 160, unique: true })
  email: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

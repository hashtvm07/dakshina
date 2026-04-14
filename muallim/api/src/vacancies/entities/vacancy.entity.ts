import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { College } from '../../colleges/entities/college.entity';

@Entity('vacancies')
export class Vacancy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 160 })
  title: string;

  @Column({ length: 120 })
  subject: string;

  @Column({ default: 1 })
  totalPositions: number;

  @Column({ length: 120 })
  location: string;

  @Column({ length: 180 })
  qualification: string;

  @Column({ type: 'date' })
  lastDate: string;

  @Column({ length: 160 })
  contactInfo: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column()
  collegeId: number;

  @ManyToOne(() => College, (college) => college.vacancies, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'collegeId' })
  college: College;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

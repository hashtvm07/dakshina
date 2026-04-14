import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Vacancy } from '../../vacancies/entities/vacancy.entity';

@Entity('colleges')
export class College {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 160 })
  name: string;

  @Column({ length: 120 })
  location: string;

  @Column({ length: 120 })
  district: string;

  @Column({ length: 120 })
  state: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Vacancy, (vacancy) => vacancy.college)
  vacancies: Vacancy[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserType } from '../../common/enums/user-type.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column({ length: 255, nullable: true, select: false })
  password?: string;

  @Column({ type: 'enum', enum: UserType })
  userType: UserType;

  @Column('simple-array', { default: '' })
  allowedMenus: string[];

  @Column({ nullable: true })
  muallimId?: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

type FamilyMember = {
  name: string;
  age: number | null;
  relationship: string;
};

type FinancialAssistance = {
  organization: string;
  year: number | null;
  amount: number | null;
  itemSector: string;
};

const aadhaarTransformer = {
  to(value?: string | null) {
    if (!value) {
      return null;
    }

    const key = createHash('sha256')
      .update(
        process.env.AADHAAR_ENCRYPTION_KEY ??
          process.env.JWT_SECRET ??
          'change-this-muallim-aadhaar-key',
      )
      .digest();
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();

    return `${iv.toString('base64')}:${tag.toString('base64')}:${encrypted.toString('base64')}`;
  },
  from(value?: string | null) {
    if (!value) {
      return null;
    }

    try {
      const [iv, tag, encrypted] = value.split(':').map((part) => Buffer.from(part, 'base64'));
      const key = createHash('sha256')
        .update(
          process.env.AADHAAR_ENCRYPTION_KEY ??
            process.env.JWT_SECRET ??
            'change-this-muallim-aadhaar-key',
        )
        .digest();
      const decipher = createDecipheriv('aes-256-gcm', key, iv);
      decipher.setAuthTag(tag);

      return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
    } catch {
      return null;
    }
  },
};

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

  @Column({ length: 120, nullable: true })
  fatherName?: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth?: string;

  @Column({ type: 'text', nullable: true, select: false, transformer: aadhaarTransformer })
  aadhaarNumber?: string | null;

  @Column({ length: 32, nullable: true })
  maritalStatus?: string;

  @Column({ length: 120, nullable: true })
  schoolEducation?: string;

  @Column({ length: 120, nullable: true })
  islamicEducation?: string;

  @Column({ length: 80, nullable: true })
  aadhaarQualification?: string;

  @Column({ length: 160, nullable: true })
  presentInstituteName?: string;

  @Column({ nullable: true })
  currentlyWorkingHere?: boolean;

  @Column({ type: 'text', nullable: true })
  workAddress?: string;

  @Column({ length: 80, nullable: true })
  district?: string;

  @Column({ length: 80, nullable: true })
  meghala?: string;

  @Column({ length: 120, nullable: true })
  positionDesignation?: string;

  @Column({ type: 'int', nullable: true })
  monthlySalary?: number | null;

  @Column({ type: 'date', nullable: true })
  workStartingDate?: string;

  @Column({ length: 120, nullable: true })
  health?: string;

  @Column({ length: 24, nullable: true })
  rationCardColor?: string;

  @Column('simple-json', { nullable: true })
  familyMembers?: FamilyMember[];

  @Column({ length: 40, nullable: true })
  homeStatus?: string;

  @Column({ type: 'int', nullable: true })
  houseSquareFeet?: number | null;

  @Column({ length: 120, nullable: true })
  bankName?: string;

  @Column({ length: 120, nullable: true })
  beneficiaryName?: string;

  @Column({ length: 40, nullable: true })
  accountNumber?: string;

  @Column({ length: 16, nullable: true })
  ifscCode?: string;

  @Column({ length: 120, nullable: true })
  branch?: string;

  @Column('simple-json', { nullable: true })
  previousFinancialAssistance?: FinancialAssistance[];

  @Column({ length: 120, nullable: true })
  medicalStatus?: string;

  @Column('simple-json', { nullable: true })
  attachedCertificates?: string[];

  @Column('simple-json', { nullable: true })
  uploadedDocuments?: string[];

  @Column({ length: 180, nullable: true })
  photoFileName?: string;

  @Column({ length: 20, default: 'application' })
  admissionStatus: 'application' | 'admitted';

  @Column({ type: 'varchar', length: 13, nullable: true, unique: true })
  admissionNumber?: string | null;

  @Column({ type: 'varchar', length: 3, nullable: true })
  admissionCourseCode?: string | null;

  @Column({ type: 'int', nullable: true })
  admissionYear?: number | null;

  @Column({ type: 'timestamp', nullable: true })
  admittedAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

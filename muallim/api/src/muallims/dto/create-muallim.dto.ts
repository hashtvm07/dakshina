import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class FamilyMemberDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  age?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  relationship?: string;
}

class FinancialAssistanceDto {
  @IsString()
  @MaxLength(120)
  organization: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  year?: number | null;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  amount?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  itemSector?: string;
}

export class CreateMuallimDto {
  @IsString()
  @MaxLength(120)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  password?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  fatherName?: string;

  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  aadhaarNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  maritalStatus?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  schoolEducation?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  islamicEducation?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  aadhaarQualification?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  presentInstituteName?: string;

  @IsOptional()
  @IsBoolean()
  currentlyWorkingHere?: boolean;

  @IsOptional()
  @IsString()
  workAddress?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  district?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  meghala?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  positionDesignation?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  monthlySalary?: number | null;

  @IsOptional()
  @IsString()
  workStartingDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  health?: string;

  @IsOptional()
  @IsString()
  @MaxLength(24)
  rationCardColor?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FamilyMemberDto)
  familyMembers?: FamilyMemberDto[];

  @IsOptional()
  @IsString()
  @MaxLength(40)
  homeStatus?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  houseSquareFeet?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  bankName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  beneficiaryName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  accountNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(16)
  ifscCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  branch?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FinancialAssistanceDto)
  previousFinancialAssistance?: FinancialAssistanceDto[];

  @IsOptional()
  @IsString()
  @MaxLength(120)
  medicalStatus?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachedCertificates?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  uploadedDocuments?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(180)
  photoFileName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(3)
  admissionCourseCode?: string;
}

import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateAdmissionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500000)
  photoDataUrl!: string;

  @IsString()
  @IsNotEmpty()
  studentName!: string;

  @IsString()
  @IsNotEmpty()
  aadhaarNumber!: string;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  studentDateOfBirth!: string;

  @IsString()
  @IsNotEmpty()
  fatherJob!: string;

  @IsString()
  @IsNotEmpty()
  fatherName!: string;

  @IsString()
  @IsNotEmpty()
  motherName!: string;

  @IsString()
  @IsNotEmpty()
  motherJob!: string;

  @IsString()
  @IsNotEmpty()
  state!: string;

  @IsString()
  @IsNotEmpty()
  district!: string;

  @IsString()
  @IsNotEmpty()
  panchayath!: string;

  @IsString()
  @IsNotEmpty()
  area!: string;

  @IsString()
  @IsNotEmpty()
  mahalluName!: string;

  @IsString()
  @IsNotEmpty()
  identificationMark1!: string;

  @IsString()
  @IsNotEmpty()
  identificationMark2!: string;

  @IsString()
  @IsNotEmpty()
  mobileNumber!: string;

  @IsString()
  @IsNotEmpty()
  whatsappNumber!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  homeAddress!: string;

  @IsString()
  @IsNotEmpty()
  residentialAddress!: string;

  @IsString()
  @IsNotEmpty()
  guardianName!: string;

  @IsString()
  @IsNotEmpty()
  guardianAddress!: string;

  @IsString()
  @IsNotEmpty()
  guardianRelation!: string;

  @IsString()
  @IsNotEmpty()
  religiousPanchayathMunicipality!: string;

  @IsString()
  @IsNotEmpty()
  schoolNameAndPlace!: string;

  @IsString()
  @IsNotEmpty()
  schoolClassCompleted!: string;

  @IsString()
  @IsNotEmpty()
  madrassaNameAndPlace!: string;

  @IsString()
  @IsNotEmpty()
  madrassaClassCompleted!: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['Foundation course Class 4-7 (HIFZ)', 'Secondary (8-10)', 'Higher Secondary'])
  admissionFor!: string;

  @IsString()
  @IsNotEmpty()
  examCenterVenue!: string;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  examDate!: string;

  @IsBoolean()
  guardianDeclarationAccepted!: boolean;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  resultSubject?: string;

  @IsOptional()
  @IsString()
  resultMark?: string;

  @IsOptional()
  @IsIn(['application', 'admitted'])
  status?: 'application' | 'admitted';

  @IsOptional()
  @IsString()
  admissionNumber?: string;
}

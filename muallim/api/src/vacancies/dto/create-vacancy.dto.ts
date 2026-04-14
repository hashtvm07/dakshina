import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateVacancyDto {
  @IsString()
  @MaxLength(160)
  title: string;

  @IsString()
  @MaxLength(120)
  subject: string;

  @Type(() => Number)
  @IsInt()
  totalPositions: number;

  @IsString()
  @MaxLength(120)
  location: string;

  @IsString()
  @MaxLength(180)
  qualification: string;

  @IsDateString()
  lastDate: string;

  @IsString()
  @MaxLength(160)
  contactInfo: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @Type(() => Number)
  @IsInt()
  collegeId: number;
}

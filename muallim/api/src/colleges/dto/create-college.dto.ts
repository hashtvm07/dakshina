import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCollegeDto {
  @IsString()
  @MaxLength(160)
  name: string;

  @IsString()
  @MaxLength(120)
  location: string;

  @IsString()
  @MaxLength(120)
  district: string;

  @IsString()
  @MaxLength(120)
  state: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

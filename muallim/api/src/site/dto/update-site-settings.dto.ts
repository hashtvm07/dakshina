import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateSiteSettingsDto {
  @IsOptional()
  @IsBoolean()
  registerEnabled?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  heroTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(220)
  heroSubtitle?: string;

  @IsOptional()
  @IsString()
  heroDescription?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  heroImageUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bannerImageUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  aboutTitle?: string;

  @IsOptional()
  @IsString()
  aboutBody?: string;
}

import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateMuallimDto {
  @IsString()
  @MaxLength(120)
  name: string;

  @IsString()
  @MaxLength(120)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(20)
  phone: string;

  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  bio?: string;
}

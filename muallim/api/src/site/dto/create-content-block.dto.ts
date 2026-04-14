import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateContentBlockDto {
  @IsString()
  @MaxLength(120)
  title: string;

  @IsString()
  body: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sortOrder?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  imageUrl?: string;
}

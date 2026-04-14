import { IsString, MaxLength } from 'class-validator';

export class CreateMediaAssetDto {
  @IsString()
  @MaxLength(120)
  title: string;

  @IsString()
  @MaxLength(500)
  imageUrl: string;

  @IsString()
  @MaxLength(40)
  category: string;
}

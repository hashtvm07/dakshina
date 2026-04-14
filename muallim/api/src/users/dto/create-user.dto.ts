import { IsArray, IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { UserType } from '../../common/enums/user-type.enum';

export class CreateUserDto {
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
  @MinLength(8)
  @MaxLength(255)
  password?: string;

  @IsEnum(UserType)
  userType: UserType;

  @IsOptional()
  @IsArray()
  allowedMenus?: string[];
}

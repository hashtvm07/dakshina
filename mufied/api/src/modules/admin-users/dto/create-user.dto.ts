import { IsIn, IsString, MinLength } from 'class-validator';

export const USER_ROLES = ['mentor', 'student', 'admin'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export class CreateUserDto {
  @IsString()
  @MinLength(1)
  username!: string;

  @IsString()
  @MinLength(1)
  password!: string;

  @IsIn(USER_ROLES)
  role!: UserRole;
}

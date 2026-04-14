export declare const USER_ROLES: readonly ["mentor", "student", "admin"];
export type UserRole = (typeof USER_ROLES)[number];
export declare class CreateUserDto {
    username: string;
    password: string;
    role: UserRole;
}

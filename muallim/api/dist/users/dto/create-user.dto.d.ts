import { UserType } from '../../common/enums/user-type.enum';
export declare class CreateUserDto {
    name: string;
    username: string;
    email: string;
    phone: string;
    address: string;
    password?: string;
    userType: UserType;
    allowedMenus?: string[];
}

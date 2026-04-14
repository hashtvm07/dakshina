import { UserType } from '../../common/enums/user-type.enum';
export declare class User {
    id: number;
    name: string;
    username: string;
    email: string;
    phone: string;
    address: string;
    password?: string;
    userType: UserType;
    allowedMenus: string[];
    muallimId?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

import { Repository } from 'typeorm';
import { UserType } from '../common/enums/user-type.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    listUsers(): Promise<User[]>;
    createUser(dto: CreateUserDto): Promise<User>;
    updateUser(id: number, dto: UpdateUserDto): Promise<{
        allowedMenus: string[];
        name: string;
        username: string;
        email: string;
        phone: string;
        address: string;
        password?: string;
        userType: UserType;
        id: number;
        muallimId?: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } & User>;
    removeUser(id: number): Promise<{
        success: boolean;
    }>;
    createMuallimUser(input: {
        muallimId: string;
        name: string;
        username: string;
        email: string;
        phone: string;
        address: string;
    }): Promise<User>;
    getUserMetadata(): {
        userTypes: UserType[];
        menuOptions: readonly [{
            readonly key: "dashboard";
            readonly label: "Dashboard";
            readonly route: "/dashboard";
        }, {
            readonly key: "content";
            readonly label: "Content";
            readonly route: "/content";
        }, {
            readonly key: "settings";
            readonly label: "Settings";
            readonly route: "/settings";
        }, {
            readonly key: "users";
            readonly label: "User Management";
            readonly route: "/users";
        }, {
            readonly key: "colleges";
            readonly label: "Colleges";
            readonly route: "/colleges";
        }, {
            readonly key: "vacancies";
            readonly label: "Vacancies";
            readonly route: "/vacancies";
        }, {
            readonly key: "registrations";
            readonly label: "Muallim Registrations";
            readonly route: "/registrations";
        }];
    };
}

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    listUsers(): Promise<import("./entities/user.entity").User[]>;
    getUserMetadata(): {
        userTypes: import("../common/enums/user-type.enum").UserType[];
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
    createUser(dto: CreateUserDto): Promise<import("./entities/user.entity").User>;
    updateUser(id: number, dto: UpdateUserDto): Promise<{
        allowedMenus: string[];
        name: string;
        username: string;
        email: string;
        phone: string;
        address: string;
        password?: string;
        userType: import("../common/enums/user-type.enum").UserType;
        id: number;
        muallimId?: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } & import("./entities/user.entity").User>;
    removeUser(id: number): Promise<{
        success: boolean;
    }>;
}

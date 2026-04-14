import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MENU_OPTIONS } from '../common/constants/menu-options';
import { UserType } from '../common/enums/user-type.enum';
import { getDefaultMenusForUserType } from '../common/utils/menu-defaults';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  listUsers() {
    return this.userRepository.find({ order: { createdAt: 'DESC' } });
  }

  async createUser(dto: CreateUserDto) {
    const defaults = getDefaultMenusForUserType(dto.userType);
    const mergedMenus = Array.from(new Set([...(dto.allowedMenus ?? []), ...defaults]));

    return this.userRepository.save(
      this.userRepository.create({
        ...dto,
        allowedMenus: mergedMenus,
      }),
    );
  }

  async updateUser(id: number, dto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const nextUserType = dto.userType ?? user.userType;
    const defaultMenus = getDefaultMenusForUserType(nextUserType);
    const mergedMenus = dto.allowedMenus
      ? Array.from(new Set([...dto.allowedMenus, ...defaultMenus]))
      : user.allowedMenus;

    return this.userRepository.save({
      ...user,
      ...dto,
      allowedMenus: mergedMenus,
    });
  }

  async removeUser(id: number) {
    await this.userRepository.delete(id);
    return { success: true };
  }

  async createMuallimUser(input: {
    muallimId: string;
    name: string;
    username: string;
    email: string;
    phone: string;
    address: string;
  }) {
    const exists = await this.userRepository.findOne({ where: { muallimId: input.muallimId } });
    if (exists) {
      return exists;
    }

    return this.userRepository.save(
      this.userRepository.create({
        ...input,
        userType: UserType.MUALLIM,
        allowedMenus: getDefaultMenusForUserType(UserType.MUALLIM),
      }),
    );
  }

  getUserMetadata() {
    return {
      userTypes: Object.values(UserType),
      menuOptions: MENU_OPTIONS,
    };
  }
}

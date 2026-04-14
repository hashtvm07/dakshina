import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreateMuallimDto } from './dto/create-muallim.dto';
import { Muallim } from './entities/muallim.entity';

@Injectable()
export class MuallimsService {
  constructor(
    @InjectRepository(Muallim)
    private readonly muallimRepository: Repository<Muallim>,
    private readonly usersService: UsersService,
  ) {}

  async registerMuallim(dto: CreateMuallimDto) {
    const total = await this.muallimRepository.count();
    const publicId = `MUA-${String(total + 1).padStart(4, '0')}`;

    const muallim = await this.muallimRepository.save(
      this.muallimRepository.create({
        ...dto,
        publicId,
      }),
    );

    await this.usersService.createMuallimUser({
      muallimId: muallim.publicId,
      name: muallim.name,
      username: muallim.username,
      email: muallim.email,
      phone: muallim.phone,
      address: muallim.address,
    });

    return muallim;
  }

  async listMuallims(query?: string) {
    const qb = this.muallimRepository.createQueryBuilder('muallim');

    if (query) {
      qb.where(
        'LOWER(muallim.publicId) LIKE LOWER(:query) OR LOWER(muallim.name) LIKE LOWER(:query)',
        { query: `%${query}%` },
      );
    }

    return qb.orderBy('muallim.createdAt', 'DESC').getMany();
  }

  async findByPublicId(publicId: string) {
    const muallim = await this.muallimRepository.findOne({ where: { publicId } });
    if (!muallim) {
      throw new NotFoundException('Muallim not found');
    }

    return muallim;
  }
}

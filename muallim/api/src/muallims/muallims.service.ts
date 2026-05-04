import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreateMuallimDto } from './dto/create-muallim.dto';
import { Muallim } from './entities/muallim.entity';

@Injectable()
export class MuallimsService {
  private readonly courseCodes = new Set(['101', '201', '301']);
  private readonly institutionCode = '01';

  constructor(
    @InjectRepository(Muallim)
    private readonly muallimRepository: Repository<Muallim>,
    private readonly usersService: UsersService,
  ) {}

  async registerMuallim(dto: CreateMuallimDto) {
    const total = await this.muallimRepository.count();
    const publicId = `MUA-${String(total + 1).padStart(4, '0')}`;
    const generatedUsername = dto.username?.trim() || publicId.toLowerCase();
    const generatedEmail = dto.email?.trim() || `${publicId.toLowerCase()}@muallim.local`;
    const phone = dto.phone?.trim() || 'Not provided';
    const address = dto.address?.trim() || dto.workAddress?.trim() || 'Not provided';

    const muallim = await this.muallimRepository.save(
      this.muallimRepository.create({
        ...dto,
        publicId,
        username: generatedUsername,
        email: generatedEmail,
        phone,
        address,
      }),
    );

    await this.usersService.createMuallimUser({
      muallimId: muallim.publicId,
      name: muallim.name,
      username: generatedUsername,
      email: generatedEmail,
      phone,
      address,
      password: dto.password,
    });

    muallim.aadhaarNumber = undefined;
    return muallim;
  }

  async listMuallims(query?: string, status?: string) {
    const qb = this.muallimRepository.createQueryBuilder('muallim');
    const clauses: string[] = [];
    const parameters: Record<string, string> = {};

    if (query) {
      clauses.push(
        '(LOWER(muallim.publicId) LIKE LOWER(:query) OR LOWER(muallim.name) LIKE LOWER(:query) OR LOWER(muallim.admissionNumber) LIKE LOWER(:query))',
      );
      parameters.query = `%${query}%`;
    }

    if (status === 'admitted') {
      clauses.push('muallim.admissionStatus = :status');
      parameters.status = status;
    } else if (status === 'application') {
      clauses.push('(muallim.admissionStatus IS NULL OR muallim.admissionStatus = :status)');
      parameters.status = status;
    }

    if (clauses.length) {
      qb.where(clauses.join(' AND '), parameters);
    }

    const orderColumn = status === 'admitted' ? 'muallim.admittedAt' : 'muallim.createdAt';
    return qb.orderBy(orderColumn, 'DESC').getMany();
  }

  async findByPublicId(publicId: string) {
    const muallim = await this.muallimRepository.findOne({ where: { publicId } });
    if (!muallim) {
      throw new NotFoundException('Muallim not found');
    }

    return muallim;
  }

  async updateMuallim(publicId: string, dto: CreateMuallimDto) {
    const muallim = await this.findByPublicId(publicId);
    const { username, email, phone, password, ...updates } = dto;

    return this.muallimRepository.save({
      ...muallim,
      ...updates,
      username: username?.trim() || muallim.username,
      email: email?.trim() || muallim.email,
      phone: phone?.trim() || muallim.phone,
    });
  }

  async admitMuallim(publicId: string, courseCode?: string) {
    const muallim = await this.findByPublicId(publicId);

    if (muallim.admissionStatus === 'admitted' && muallim.admissionNumber) {
      return muallim;
    }

    const resolvedCourseCode = (courseCode || muallim.admissionCourseCode || '').trim();
    if (!this.courseCodes.has(resolvedCourseCode)) {
      throw new BadRequestException('Select a valid admission course before admitting.');
    }

    const admissionYear = new Date().getFullYear();
    const prefix = `${resolvedCourseCode}${admissionYear}${this.institutionCode}`;
    const latest = await this.muallimRepository
      .createQueryBuilder('muallim')
      .where('muallim.admissionNumber LIKE :prefix', { prefix: `${prefix}%` })
      .orderBy('muallim.admissionNumber', 'DESC')
      .getOne();
    const latestSerial = latest?.admissionNumber
      ? Number(latest.admissionNumber.slice(-4))
      : 0;
    const serial = String(latestSerial + 1).padStart(4, '0');

    return this.muallimRepository.save({
      ...muallim,
      admissionStatus: 'admitted',
      admissionCourseCode: resolvedCourseCode,
      admissionYear,
      admissionNumber: `${prefix}${serial}`,
      admittedAt: new Date(),
    });
  }
}

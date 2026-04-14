import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { Vacancy } from './entities/vacancy.entity';

@Injectable()
export class VacanciesService {
  constructor(
    @InjectRepository(Vacancy)
    private readonly vacancyRepository: Repository<Vacancy>,
  ) {}

  async listVacancies(filters: Record<string, string | undefined>) {
    const qb = this.vacancyRepository
      .createQueryBuilder('vacancy')
      .leftJoinAndSelect('vacancy.college', 'college');

    if (filters.query) {
      qb.andWhere(
        `
          LOWER(vacancy.title) LIKE LOWER(:query)
          OR LOWER(vacancy.subject) LIKE LOWER(:query)
          OR LOWER(vacancy.location) LIKE LOWER(:query)
          OR LOWER(vacancy.qualification) LIKE LOWER(:query)
          OR LOWER(vacancy.contactInfo) LIKE LOWER(:query)
          OR LOWER(college.name) LIKE LOWER(:query)
        `,
        { query: `%${filters.query}%` },
      );
    }

    if (filters.collegeId) {
      qb.andWhere('vacancy.collegeId = :collegeId', { collegeId: Number(filters.collegeId) });
    }

    if (filters.subject) {
      qb.andWhere('LOWER(vacancy.subject) LIKE LOWER(:subject)', {
        subject: `%${filters.subject}%`,
      });
    }

    if (filters.location) {
      qb.andWhere('LOWER(vacancy.location) LIKE LOWER(:location)', {
        location: `%${filters.location}%`,
      });
    }

    return qb.orderBy('vacancy.createdAt', 'DESC').getMany();
  }

  createVacancy(dto: CreateVacancyDto) {
    return this.vacancyRepository.save(this.vacancyRepository.create(dto));
  }

  async updateVacancy(id: number, dto: UpdateVacancyDto) {
    const vacancy = await this.vacancyRepository.findOne({ where: { id } });
    if (!vacancy) {
      throw new NotFoundException('Vacancy not found');
    }

    return this.vacancyRepository.save({ ...vacancy, ...dto });
  }

  async removeVacancy(id: number) {
    await this.vacancyRepository.delete(id);
    return { success: true };
  }
}

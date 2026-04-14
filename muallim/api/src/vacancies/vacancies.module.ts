import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vacancy } from './entities/vacancy.entity';
import { VacanciesController } from './vacancies.controller';
import { VacanciesService } from './vacancies.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vacancy])],
  controllers: [VacanciesController],
  providers: [VacanciesService],
})
export class VacanciesModule {}

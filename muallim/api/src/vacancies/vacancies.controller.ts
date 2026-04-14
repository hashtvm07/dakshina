import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { VacanciesService } from './vacancies.service';

@Controller('vacancies')
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  @Get()
  listVacancies(@Query() query: Record<string, string | undefined>) {
    return this.vacanciesService.listVacancies(query);
  }

  @Post()
  createVacancy(@Body() dto: CreateVacancyDto) {
    return this.vacanciesService.createVacancy(dto);
  }

  @Put(':id')
  updateVacancy(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateVacancyDto) {
    return this.vacanciesService.updateVacancy(id, dto);
  }

  @Delete(':id')
  removeVacancy(@Param('id', ParseIntPipe) id: number) {
    return this.vacanciesService.removeVacancy(id);
  }
}

import { Repository } from 'typeorm';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { Vacancy } from './entities/vacancy.entity';
export declare class VacanciesService {
    private readonly vacancyRepository;
    constructor(vacancyRepository: Repository<Vacancy>);
    listVacancies(filters: Record<string, string | undefined>): Promise<Vacancy[]>;
    createVacancy(dto: CreateVacancyDto): Promise<Vacancy>;
    updateVacancy(id: number, dto: UpdateVacancyDto): Promise<{
        title: string;
        subject: string;
        totalPositions: number;
        location: string;
        qualification: string;
        lastDate: string;
        contactInfo: string;
        notes?: string;
        collegeId: number;
        id: number;
        college: import("../colleges/entities/college.entity").College;
        createdAt: Date;
        updatedAt: Date;
    } & Vacancy>;
    removeVacancy(id: number): Promise<{
        success: boolean;
    }>;
}

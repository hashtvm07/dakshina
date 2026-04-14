import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { VacanciesService } from './vacancies.service';
export declare class VacanciesController {
    private readonly vacanciesService;
    constructor(vacanciesService: VacanciesService);
    listVacancies(query: Record<string, string | undefined>): Promise<import("./entities/vacancy.entity").Vacancy[]>;
    createVacancy(dto: CreateVacancyDto): Promise<import("./entities/vacancy.entity").Vacancy>;
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
    } & import("./entities/vacancy.entity").Vacancy>;
    removeVacancy(id: number): Promise<{
        success: boolean;
    }>;
}

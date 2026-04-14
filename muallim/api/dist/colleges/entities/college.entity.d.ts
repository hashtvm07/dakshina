import { Vacancy } from '../../vacancies/entities/vacancy.entity';
export declare class College {
    id: number;
    name: string;
    location: string;
    district: string;
    state: string;
    isActive: boolean;
    vacancies: Vacancy[];
    createdAt: Date;
    updatedAt: Date;
}

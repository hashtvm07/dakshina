import { Repository } from 'typeorm';
import { CreateCollegeDto } from './dto/create-college.dto';
import { UpdateCollegeDto } from './dto/update-college.dto';
import { College } from './entities/college.entity';
export declare class CollegesService {
    private readonly collegeRepository;
    constructor(collegeRepository: Repository<College>);
    listColleges(): Promise<College[]>;
    createCollege(dto: CreateCollegeDto): Promise<College>;
    updateCollege(id: number, dto: UpdateCollegeDto): Promise<{
        name: string;
        location: string;
        district: string;
        state: string;
        isActive: boolean;
        id: number;
        vacancies: import("../vacancies/entities/vacancy.entity").Vacancy[];
        createdAt: Date;
        updatedAt: Date;
    } & College>;
    removeCollege(id: number): Promise<{
        success: boolean;
    }>;
}

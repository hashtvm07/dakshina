import { CollegesService } from './colleges.service';
import { CreateCollegeDto } from './dto/create-college.dto';
import { UpdateCollegeDto } from './dto/update-college.dto';
export declare class CollegesController {
    private readonly collegesService;
    constructor(collegesService: CollegesService);
    listColleges(): Promise<import("./entities/college.entity").College[]>;
    createCollege(dto: CreateCollegeDto): Promise<import("./entities/college.entity").College>;
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
    } & import("./entities/college.entity").College>;
    removeCollege(id: number): Promise<{
        success: boolean;
    }>;
}

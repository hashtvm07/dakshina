import { College } from '../../colleges/entities/college.entity';
export declare class Vacancy {
    id: number;
    title: string;
    subject: string;
    totalPositions: number;
    location: string;
    qualification: string;
    lastDate: string;
    contactInfo: string;
    notes?: string;
    collegeId: number;
    college: College;
    createdAt: Date;
    updatedAt: Date;
}

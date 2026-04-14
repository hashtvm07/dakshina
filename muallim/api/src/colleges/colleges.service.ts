import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCollegeDto } from './dto/create-college.dto';
import { UpdateCollegeDto } from './dto/update-college.dto';
import { College } from './entities/college.entity';

@Injectable()
export class CollegesService {
  constructor(
    @InjectRepository(College)
    private readonly collegeRepository: Repository<College>,
  ) {}

  listColleges() {
    return this.collegeRepository.find({ order: { name: 'ASC' } });
  }

  createCollege(dto: CreateCollegeDto) {
    return this.collegeRepository.save(this.collegeRepository.create(dto));
  }

  async updateCollege(id: number, dto: UpdateCollegeDto) {
    const college = await this.collegeRepository.findOne({ where: { id } });
    if (!college) {
      throw new NotFoundException('College not found');
    }

    return this.collegeRepository.save({ ...college, ...dto });
  }

  async removeCollege(id: number) {
    await this.collegeRepository.delete(id);
    return { success: true };
  }
}

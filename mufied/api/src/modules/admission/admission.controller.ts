import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AdminSessionGuard } from '../admin-users/admin-session.guard';
import { CreateAdmissionDto } from './dto/create-admission.dto';
import { AdmissionService } from './admission.service';

@Controller('api/admissions')
export class AdmissionController {
  constructor(private readonly admissionService: AdmissionService) {}

  @Post()
  create(@Body() dto: CreateAdmissionDto) {
    return this.admissionService.createAdmission(dto);
  }

  @UseGuards(AdminSessionGuard)
  @Get()
  list(@Query('status') status?: 'application' | 'admitted') {
    return this.admissionService.listAdmissions(status);
  }

  @UseGuards(AdminSessionGuard)
  @Post(':applicationNo/admit')
  admit(@Param('applicationNo') applicationNo: string) {
    return this.admissionService.admitStudent(applicationNo);
  }

  @UseGuards(AdminSessionGuard)
  @Put(':applicationNo')
  update(
    @Param('applicationNo') applicationNo: string,
    @Body() dto: CreateAdmissionDto,
  ) {
    return this.admissionService.updateAdmission(applicationNo, dto);
  }

  @UseGuards(AdminSessionGuard)
  @Delete(':applicationNo')
  remove(@Param('applicationNo') applicationNo: string) {
    return this.admissionService.deleteAdmission(applicationNo);
  }

  @Get('lookup')
  lookup(@Query('email') email: string, @Query('studentDateOfBirth') studentDateOfBirth: string) {
    return this.admissionService.findAdmissionByEmail(email, studentDateOfBirth);
  }

  @Get('hall-ticket')
  getHallTicket(
    @Query('applicationNo') applicationNo: string,
    @Query('studentDateOfBirth') studentDateOfBirth: string,
  ) {
    return this.admissionService.getHallTicket(applicationNo, studentDateOfBirth);
  }

  @Get('exam-result')
  getExamResult(
    @Query('applicationNo') applicationNo: string,
    @Query('studentDateOfBirth') studentDateOfBirth: string,
  ) {
    return this.admissionService.getExamResult(applicationNo, studentDateOfBirth);
  }
}

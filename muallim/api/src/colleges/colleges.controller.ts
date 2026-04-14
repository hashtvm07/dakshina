import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CollegesService } from './colleges.service';
import { CreateCollegeDto } from './dto/create-college.dto';
import { UpdateCollegeDto } from './dto/update-college.dto';

@Controller('colleges')
export class CollegesController {
  constructor(private readonly collegesService: CollegesService) {}

  @Get()
  listColleges() {
    return this.collegesService.listColleges();
  }

  @Post()
  createCollege(@Body() dto: CreateCollegeDto) {
    return this.collegesService.createCollege(dto);
  }

  @Put(':id')
  updateCollege(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCollegeDto) {
    return this.collegesService.updateCollege(id, dto);
  }

  @Delete(':id')
  removeCollege(@Param('id', ParseIntPipe) id: number) {
    return this.collegesService.removeCollege(id);
  }
}

import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateMuallimDto } from './dto/create-muallim.dto';
import { MuallimsService } from './muallims.service';

@Controller('muallims')
export class MuallimsController {
  constructor(private readonly muallimsService: MuallimsService) {}

  @Get()
  listMuallims(@Query('query') query?: string, @Query('status') status?: string) {
    return this.muallimsService.listMuallims(query, status);
  }

  @Get(':publicId')
  findByPublicId(@Param('publicId') publicId: string) {
    return this.muallimsService.findByPublicId(publicId);
  }

  @Post('register')
  registerMuallim(@Body() dto: CreateMuallimDto) {
    return this.muallimsService.registerMuallim(dto);
  }

  @Post(':publicId/admit')
  admitMuallim(@Param('publicId') publicId: string, @Body() body: { courseCode?: string }) {
    return this.muallimsService.admitMuallim(publicId, body.courseCode);
  }

  @Put(':publicId')
  updateMuallim(@Param('publicId') publicId: string, @Body() dto: CreateMuallimDto) {
    return this.muallimsService.updateMuallim(publicId, dto);
  }
}

import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateMuallimDto } from './dto/create-muallim.dto';
import { MuallimsService } from './muallims.service';

@Controller('muallims')
export class MuallimsController {
  constructor(private readonly muallimsService: MuallimsService) {}

  @Get()
  listMuallims(@Query('query') query?: string) {
    return this.muallimsService.listMuallims(query);
  }

  @Get(':publicId')
  findByPublicId(@Param('publicId') publicId: string) {
    return this.muallimsService.findByPublicId(publicId);
  }

  @Post('register')
  registerMuallim(@Body() dto: CreateMuallimDto) {
    return this.muallimsService.registerMuallim(dto);
  }
}

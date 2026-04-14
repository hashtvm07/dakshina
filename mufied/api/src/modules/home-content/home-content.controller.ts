import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { AdminSessionGuard } from '../admin-users/admin-session.guard';
import { HomeContentService } from './home-content.service';
import { HomeContentDocument } from './home-content.types';
import { HomeContentDto } from './dto/home-content.dto';

@Controller('api/home-content')
export class HomeContentController {
  constructor(private readonly homeContentService: HomeContentService) {}

  @Get()
  getHomeContent() {
    return this.homeContentService.getHomeContent();
  }

  @UseGuards(AdminSessionGuard)
  @Put()
  updateHomeContent(@Body() content: HomeContentDto): Promise<{ message: string; content: HomeContentDocument }> {
    return this.homeContentService.updateHomeContent(content as HomeContentDocument);
  }
}

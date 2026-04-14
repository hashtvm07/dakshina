import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHealth() {
    return {
      name: 'muallim-api',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}

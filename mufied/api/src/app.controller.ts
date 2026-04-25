import { Controller, Get, NotFoundException, Res } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('feature')
  getFeaturePage(@Res() res: Response) {
    return this.sendFeatureIndex(res);
  }

  @Get('feature/index.html')
  getFeatureIndex(@Res() res: Response) {
    return this.sendFeatureIndex(res);
  }

  private sendFeatureIndex(res: Response) {
    const featurePath = path.join(process.cwd(), 'feature', 'index.html');

    if (!fs.existsSync(featurePath)) {
      throw new NotFoundException('Feature page not found.');
    }

    return res.sendFile(featurePath);
  }
}

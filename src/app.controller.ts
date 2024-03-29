import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller({
  version: '1',
  path: 'api',
})
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  getApi(): string {
    return this.appService.getApi();
  }
}

import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { HotelsService } from './hotels.service';

@Controller('hotels')
export class HotelsController {
  constructor(private hotelsService: HotelsService) {}

  @HttpCode(HttpStatus.OK)
  @Get('list')
  getHotels() {
    return this.hotelsService.getHotels();
  }
}

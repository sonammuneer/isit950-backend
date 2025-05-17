import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { HotelsService } from './hotels.service';

@Controller('hotels')
export class HotelsController {
  constructor(private hotelsService: HotelsService) {}

  @HttpCode(HttpStatus.OK)
  @Get('list')
  getHotels() {
    return this.hotelsService.getHotels();
  }

  @HttpCode(HttpStatus.OK)
  @Get('fetch/:id')
  fetchHotelById(@Param() params: any) {
    return this.hotelsService.fetchHotelById(params.id);
  }
}

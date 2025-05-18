import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { ReviewDto } from '../dto/create-review.dto';

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

  @HttpCode(HttpStatus.OK)
  @Post('review/create')
  createReview(@Body() request: ReviewDto) {
    return this.hotelsService.createReview(request);
  }
}

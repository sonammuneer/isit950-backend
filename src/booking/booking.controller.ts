import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from '../dto/create-booking.dto';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @HttpCode(HttpStatus.OK)
  @Post('create')
  createBooking(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.createBooking(createBookingDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('list/:userid')
  getBookingsByUserId(@Param() params: any) {
    return this.bookingService.getBookingsByUserId(params.userid);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { CheckRoomAvailabilityDto } from '../dto/check-room-availability.dto';
import { RoomsService } from '../rooms/rooms.service';
import { UpdateBookingDto } from '../dto/update-booking.dto';

@Controller('booking')
export class BookingController {
  constructor(
    private bookingService: BookingService,
    private roomsService: RoomsService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('create')
  createBooking(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.createBooking(createBookingDto);
  }

  @HttpCode(HttpStatus.OK)
  @Put('update')
  updateBooking(@Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.updateBooking(updateBookingDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('list/:userid')
  getBookingsByUserId(@Param() params: any) {
    return this.bookingService.getBookingsByUserId(params.userid);
  }

  @HttpCode(HttpStatus.OK)
  @Get('fetch/:bookingid')
  getBookingByBookingId(@Param() params: any) {
    return this.bookingService.getBookingByBookingId(params.bookingid);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('delete')
  cancelBooking(@Body() deleteBookingDto: { bookingId: string }) {
    return this.bookingService.getBookingByBookingId(
      deleteBookingDto.bookingId,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Put('availability/fetch')
  fetchAvailabilityByRoomId(
    @Body() availabilityCheckDto: CheckRoomAvailabilityDto,
  ) {
    return this.roomsService.fetchAvailabilityByRoomId(availabilityCheckDto);
  }
}

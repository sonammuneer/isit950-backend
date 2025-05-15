import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from 'src/dto/create-booking.dto';
import { BookingDto } from 'src/dto/booking-dto';

@Injectable()
export class BookingService {
  constructor(private readonly prismaService: PrismaService) {}

  async createBooking(createBookingDto: CreateBookingDto): Promise<BookingDto> {
    const startdate = new Date(createBookingDto.startdate);
    const enddate = new Date(createBookingDto.enddate);
    return this.prismaService.bookings.create({
      data: { ...createBookingDto, startdate: startdate, enddate: enddate },
    });
  }

  async getBookingsByUserId(userId: string): Promise<BookingDto[]> {
    return this.prismaService.bookings.findMany({
      where: { bookinguserid: userId },
    });
  }

  async getBookingsByHotelId(hotelId: string): Promise<BookingDto[]> {
    return this.prismaService.bookings.findMany({
      where: { hotelid: hotelId },
    });
  }
}

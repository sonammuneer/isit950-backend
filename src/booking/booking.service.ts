import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { BookingDto } from '../dto/booking-dto';

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
      include: {
        room: {
          select: {
            name: true,
          },
        },
        hotel: {
          select: {
            name: true,
            place: true,
          },
        },
      },
    });
  }

  async getBookingsByHotelId(hotelId: string) {
    return this.prismaService.bookings.findMany({
      where: { hotelid: hotelId },
      include: {
        room: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async getBookingByBookingId(bookingId: string): Promise<BookingDto> {
    return this.prismaService.bookings.findFirst({
      where: { id: bookingId },
    });
  }

  async cancelBooking(bookingId: string): Promise<BookingDto> {
    return this.prismaService.bookings.delete({
      where: { id: bookingId },
    });
  }
}

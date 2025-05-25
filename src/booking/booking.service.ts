import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { BookingDto } from '../dto/booking-dto';
import { UpdateBookingDto } from '../dto/update-booking.dto';

@Injectable()
export class BookingService {
  constructor(private readonly prismaService: PrismaService) {}

  async createBooking(createBookingDto: CreateBookingDto): Promise<BookingDto> {
    const startdate = new Date(createBookingDto.startdate);
    const enddate = new Date(createBookingDto.enddate);
    const booking = await this.prismaService.bookings.create({
      data: { ...createBookingDto, startdate: startdate, enddate: enddate },
      include: {
        hotel: true,
        room: true,
      },
    });
    await this.prismaService.notifications.create({
      data: {
        userid: createBookingDto.bookinguserid,
        description: `Congrats! Your booking at ${booking.hotel.name} has been confirmed! A confirmation mail has been sent your registered email id.`,
        timestamp: new Date(Date.now()),
      },
    });

    const hotelUserId = await this.prismaService.user.findFirst({
      where: {
        email: booking.hotel.adminemail,
      },
      select: {
        id: true,
      },
    });

    await this.prismaService.notifications.create({
      data: {
        userid: hotelUserId.id,
        description: `Congrats! You have received a new booking for ${booking.room.name}. Check your bookings tab for more details.`,
        timestamp: new Date(Date.now()),
      },
    });

    return booking;
  }

  async getBookingsByUserId(userId: string): Promise<BookingDto[]> {
    return this.prismaService.bookings.findMany({
      where: { bookinguserid: userId },
      include: {
        room: {
          select: {
            name: true,
            price: true,
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
    const booking = await this.prismaService.bookings.delete({
      where: { id: bookingId },
      include: {
        hotel: true,
      },
    });

    await this.prismaService.notifications.create({
      data: {
        userid: booking.bookinguserid,
        description: `Your booking at ${booking.hotel.name} has been cancelled successfully. Any payment made would be refunded to your original payment method.`,
        timestamp: new Date(Date.now()),
      },
    });

    return booking;
  }

  async updateBooking(request: UpdateBookingDto): Promise<BookingDto> {
    const booking = await this.prismaService.bookings.update({
      where: { id: request.id },
      data: {
        startdate: new Date(request.startdate),
        enddate: new Date(request.enddate),
      },
      include: {
        hotel: true,
      },
    });

    await this.prismaService.notifications.create({
      data: {
        userid: booking.bookinguserid,
        description: `Congrats! Your booking at ${booking.hotel.name} has been updated succesfully!`,
        timestamp: new Date(Date.now()),
      },
    });

    return booking;
  }
}

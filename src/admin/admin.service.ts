import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserDto } from '../dto/user-dto';
import { FetchUserDto } from '../dto/fetch-user-dto';
import { CreateOnboardingRequestDto } from '../dto/create-onboarding-request.dto';
import { PrismaService } from '../prisma/prisma.service';
import { BlockDateDto } from '../dto/block-date.dto';

@Injectable()
export class AdminService {
  constructor(
    private usersService: UsersService,
    private readonly prismaService: PrismaService,
  ) {}

  async listAllUsers(): Promise<FetchUserDto[]> {
    return this.usersService.listAllUsers();
  }

  async deleteUser(email: string): Promise<UserDto> {
    return this.usersService.deleteUser(email);
  }

  async createOnboardingRequest(
    createOnboardingRequestDto: CreateOnboardingRequestDto,
  ) {
    return this.prismaService.onboardingRequests.create({
      data: createOnboardingRequestDto,
    });
  }

  async deleteOnboardingRequest(request: { id: string }) {
    return this.prismaService.onboardingRequests.delete({
      where: {
        id: request.id,
      },
    });
  }

  async fetchPendingRequests() {
    return this.prismaService.onboardingRequests.findMany();
  }

  async fetchHotelAdminStats(hotelId: string) {
    const allRooms = await this.prismaService.room.findMany({
      where: { hotelid: hotelId },
      select: { count: true },
    });
    const totalRoomsCount = allRooms.reduce((sum, room) => sum + room.count, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const occupiedRooms = await this.prismaService.room.findMany({
      where: {
        hotelid: hotelId,
        Bookings: {
          some: {
            startdate: { lte: today },
            enddate: { gte: today },
          },
        },
      },
      include: {
        Bookings: {
          where: {
            startdate: { lte: today },
            enddate: { gte: today },
          },
          select: {
            booking_count: true,
          },
        },
      },
    });
    const occupiedRoomsCount = occupiedRooms.reduce((sum, room) => {
      return (
        sum +
        room.Bookings.reduce((roomSum, booking) => {
          return roomSum + booking.booking_count;
        }, 0)
      );
    }, 0);

    const totalBookings = await this.prismaService.bookings.count({
      where: { hotelid: hotelId },
    });

    const revenueBookings = await this.prismaService.bookings.findMany({
      select: {
        booking_count: true,
        room: {
          select: {
            price: true,
          },
        },
      },
      where: {
        hotelid: hotelId,
      },
    });

    const totalRevenue = revenueBookings.reduce(
      (sum, booking) => sum + booking.booking_count * booking.room.price,
      0,
    );

    return {
      totalRooms: totalRoomsCount,
      occupiedRooms: occupiedRoomsCount,
      totalBookings: totalBookings,
      totalRevenue: totalRevenue,
    };
  }

  async upcomingBookings(hotelId: string) {
    const now = new Date();

    return await this.prismaService.bookings.findMany({
      where: {
        hotelid: hotelId,
        startdate: { gt: now },
      },
      include: {
        room: {
          select: {
            id: true,
            name: true,
            no_of_guests: true,
            price: true,
          },
        },
        hotel: {
          select: {
            id: true,
            name: true,
            place: true,
          },
        },
      },
      orderBy: {
        startdate: 'asc',
      },
    });
  }

  async superUserStats() {
    const totalReservations = await this.prismaService.bookings.count();

    const allRooms = await this.prismaService.room.findMany({
      select: { count: true },
    });
    const totalRoomsCount = allRooms.reduce((sum, room) => sum + room.count, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const occupiedRooms = await this.prismaService.room.findMany({
      where: {
        Bookings: {
          some: {
            startdate: { lte: today },
            enddate: { gte: today },
          },
        },
      },
      include: {
        Bookings: {
          where: {
            startdate: { lte: today },
            enddate: { gte: today },
          },
          select: {
            booking_count: true,
          },
        },
      },
    });
    const occupiedRoomsCount = occupiedRooms.reduce((sum, room) => {
      return (
        sum +
        room.Bookings.reduce((roomSum, booking) => {
          return roomSum + booking.booking_count;
        }, 0)
      );
    }, 0);

    const occupancyRate = (occupiedRoomsCount / totalRoomsCount) * 100;
    const totalUsers = await this.prismaService.user.count();
    const totalHotels = await this.prismaService.hotel.count();

    const revenueBookings = await this.prismaService.bookings.findMany({
      select: {
        booking_count: true,
        room: {
          select: {
            price: true,
          },
        },
      },
    });

    const revenueSubscription = await this.prismaService.subscriptions.findMany(
      {
        select: {
          amountpaid: true,
        },
      },
    );

    const totalRevenue =
      revenueBookings.reduce(
        (sum, booking) =>
          sum + (booking.booking_count * booking.room.price * 10) / 100,
        0,
      ) +
      revenueSubscription.reduce(
        (sum, subscription) => sum + subscription.amountpaid,
        0,
      );

    const thisDate = new Date();
    thisDate.setHours(23, 59, 59, 999);

    const completedBookings = await this.prismaService.bookings.findMany({
      where: {
        enddate: { lte: thisDate },
      },
      select: {
        no_of_guests: true,
      },
    });

    const totalGuestsServed = completedBookings.reduce(
      (sum, booking) => sum + booking.no_of_guests,
      0,
    );

    return {
      totalBookings: totalReservations,
      occupancyRate: occupancyRate,
      totalUsers: totalUsers,
      totalHotels: totalHotels,
      totalRevenue: totalRevenue,
      totalGuestsServed: totalGuestsServed,
    };
  }

  async rateCustomer(request: { userId: string; rating: number }) {
    const currentRating = await this.prismaService.user.findFirst({
      where: {
        id: request.userId,
      },
      select: {
        rating: true,
        ratingCount: true,
      },
    });

    const newRating = Math.floor(
      (currentRating.rating * currentRating.ratingCount + request.rating) /
        (currentRating.ratingCount + 1),
    );

    return await this.prismaService.user.update({
      where: {
        id: request.userId,
      },
      data: {
        rating: newRating,
        ratingCount: currentRating.ratingCount + 1,
      },
      omit: {
        password: true,
      },
    });
  }

  async blockDates(request: BlockDateDto) {
    const startdate = new Date(request.startDate);
    const enddate = new Date(request.endDate);

    return await this.prismaService.roomBlock.create({
      data: { ...request, startDate: startdate, endDate: enddate },
    });
  }

  async getBlockedDates(request: {
    roomId: string;
    startDate: string;
    endDate: string;
  }): Promise<string[]> {
    const startDate = new Date(request.startDate);
    const endDate = new Date(request.endDate);

    if (startDate > endDate) {
      throw new BadRequestException('End date must be after start date');
    }

    const blocks = await this.prismaService.roomBlock.findMany({
      where: {
        roomId: request.roomId,
        OR: [
          {
            startDate: { gte: startDate, lte: endDate },
          },
          {
            endDate: { gte: startDate, lte: endDate },
          },
          {
            startDate: { lte: startDate },
            endDate: { gte: endDate },
          },
        ],
      },
      select: {
        startDate: true,
        endDate: true,
      },
    });

    const allBlockedDates = new Set<string>();

    blocks.forEach((block) => {
      const blockStart = new Date(
        Math.max(startDate.getTime(), new Date(block.startDate).getTime()),
      );

      const blockEnd = new Date(
        Math.min(endDate.getTime(), new Date(block.endDate).getTime()),
      );

      let currentDate = new Date(blockStart);
      while (currentDate <= blockEnd) {
        const dateStr = currentDate.toISOString().split('T')[0];
        allBlockedDates.add(dateStr);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    return Array.from(allBlockedDates).sort();
  }

  async getBookedDates(request: {
    roomId: string;
    startDate: string;
    endDate: string;
  }): Promise<string[]> {
    const startDate = new Date(request.startDate);
    const endDate = new Date(request.endDate);

    if (startDate > endDate) {
      throw new BadRequestException('End date must be after start date');
    }

    const bookings = await this.prismaService.bookings.findMany({
      where: {
        roomid: request.roomId,
        OR: [{ startdate: { lte: endDate }, enddate: { gte: startDate } }],
      },
      select: {
        startdate: true,
        enddate: true,
      },
    });

    const bookedDates = new Set<string>();

    bookings.forEach((booking) => {
      const bookingStart = new Date(
        Math.max(startDate.getTime(), new Date(booking.startdate).getTime()),
      );

      const bookingEnd = new Date(
        Math.min(endDate.getTime(), new Date(booking.enddate).getTime()),
      );

      let currentDate = new Date(bookingStart);
      while (currentDate <= bookingEnd) {
        bookedDates.add(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    return Array.from(bookedDates).sort();
  }

  async declineBooking(bookingId: string) {
    const booking = await this.prismaService.bookings.delete({
      where: {
        id: bookingId,
      },
      include: {
        hotel: true,
      },
    });

    if (booking.startdate > new Date(Date.now())) {
      throw new HttpException(
        "Past or today's bookings can't be updated!!",
        500,
      );
    }

    await this.prismaService.notifications.create({
      data: {
        userid: booking.bookinguserid,
        description: `Sorry! Your booking at ${booking.hotel.name} has been declined from the hotel management. Please check your email for more details.`,
        timestamp: new Date(Date.now()),
      },
    });

    return booking;
  }
}

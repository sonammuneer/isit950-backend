import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserDto } from '../dto/user-dto';
import { FetchUserDto } from '../dto/fetch-user-dto';
import { CreateOnboardingRequestDto } from '../dto/create-onboarding-request.dto';
import { PrismaService } from '../prisma/prisma.service';

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

    return {
      totalRooms: totalRoomsCount,
      occupiedRooms: occupiedRoomsCount,
      totalBookings: totalBookings,
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
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from '../dto/create-room.dto';
import { RoomDto } from '../dto/room-dto';
import { CheckRoomAvailabilityDto } from '../dto/check-room-availability.dto';

@Injectable()
export class RoomsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createRoom(request: CreateRoomDto): Promise<RoomDto> {
    return this.prismaService.room.create({ data: request });
  }

  async getRooms(hotelId: string): Promise<RoomDto[]> {
    return this.prismaService.room.findMany({ where: { hotelid: hotelId } });
  }

  async editRoom(createRoomDto: CreateRoomDto) {
    return await this.prismaService.room.update({
      where: {
        id: createRoomDto.id,
      },
      data: {
        ...createRoomDto,
      },
    });
  }

  async fetchRoom(roomId: string): Promise<RoomDto> {
    return this.prismaService.room.findFirst({ where: { id: roomId } });
  }

  async deleteRoom(roomId: string): Promise<RoomDto> {
    return this.prismaService.room.delete({ where: { id: roomId } });
  }

  async fetchAvailabilityByRoomId(
    request: CheckRoomAvailabilityDto,
  ): Promise<{ availability: boolean }> {
    const startdate = new Date(request.startDate);
    const enddate = new Date(request.endDate);

    const room = await this.prismaService.room.findUnique({
      where: { id: request.roomId },
      select: {
        count: true,
      },
    });

    if (request.roomCount > room.count) {
      return { availability: false };
    }

    const overlappingBookings = await this.prismaService.bookings.findMany({
      where: {
        roomid: request.roomId,
        OR: [
          {
            startdate: { lt: enddate },
            enddate: { gt: startdate },
          },
          {
            startdate: { lte: startdate },
            enddate: { gte: enddate },
          },
        ],
      },
      select: {
        booking_count: true,
      },
    });

    const totalBooked = overlappingBookings.reduce(
      (sum, booking) => sum + booking.booking_count,
      0,
    );

    const availableRooms = room.count - totalBooked;
    return { availability: availableRooms >= request.roomCount };
  }
}

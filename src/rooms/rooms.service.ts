import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from '../dto/create-room.dto';
import { RoomDto } from '../dto/room-dto';

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
}

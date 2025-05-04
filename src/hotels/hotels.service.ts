import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHotelDto } from '../dto/create-hotel.dto';
import { HotelDto } from 'src/dto/hotel-dto';

@Injectable()
export class HotelsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getHotelsCount(): Promise<number> {
    return this.prismaService.hotel.count();
  }

  async createHotel(request: CreateHotelDto): Promise<HotelDto> {
    return this.prismaService.hotel.create({ data: request });
  }
}

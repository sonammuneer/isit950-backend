import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHotelDto } from '../dto/create-hotel.dto';
import { HotelDto } from 'src/dto/hotel-dto';
import { HotelFetchDto } from 'src/dto/hotel-fetch.dto';

@Injectable()
export class HotelsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getHotelsCount(): Promise<number> {
    return this.prismaService.hotel.count();
  }

  async createHotel(request: CreateHotelDto) {
    const { tags, ...hotelData } = request;
    return await this.prismaService.hotel.create({
      data: {
        ...hotelData,
        tags: {
          create: tags?.map((tagName) => ({ name: tagName })) || [],
        },
      },
      include: {
        tags: true,
      },
    });
  }

  async getHotels(): Promise<HotelDto[]> {
    const hotels = await this.prismaService.hotel.findMany({
      include: {
        tags: true,
      },
    });
    const result = hotels.map((hotel) => {
      const { tags, ...hotelData } = hotel;
      return {
        ...hotelData,
        tags: tags.map((tag) => tag.name),
      };
    });
    return result;
  }

  async fetchHotelById(hotelId: string): Promise<HotelFetchDto> {
    const hotel = await this.prismaService.hotel.findFirst({
      where: { id: hotelId },
      include: {
        tags: true,
        room: true,
      },
    });
    const { tags, ...hotelData } = hotel;
    return {
      ...hotelData,
      tags: tags.map((tag) => tag.name),
    };
  }
}

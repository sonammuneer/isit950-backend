import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHotelDto } from '../dto/create-hotel.dto';
import { HotelDto } from '../dto/hotel-dto';
import { HotelFetchDto } from '../dto/hotel-fetch.dto';
import { ReviewDto } from '../dto/create-review.dto';

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
    return this.prismaService.hotel.findMany();
  }

  async fetchHotelById(hotelId: string): Promise<HotelFetchDto> {
    const hotel = await this.prismaService.hotel.findFirst({
      where: { id: hotelId },
      include: {
        tags: true,
        room: true,
        reviews: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    const { tags, ...hotelData } = hotel;
    return {
      ...hotelData,
      tags: tags.map((tag) => tag.name),
    };
  }

  async createReview(createReviewDto: ReviewDto): Promise<ReviewDto> {
    const review = await this.prismaService.review.create({
      data: createReviewDto,
    });
    const reviewCount = await this.prismaService.review.count({
      where: {
        hotelid: createReviewDto.hotelid,
      },
    });
    const rating = await this.prismaService.hotel.findFirst({
      where: {
        id: createReviewDto.hotelid,
      },
      select: {
        rating: true,
      },
    });
    const newRating = Math.floor(
      (rating.rating * (reviewCount - 1) + review.rating) / reviewCount,
    );
    await this.prismaService.hotel.update({
      where: { id: createReviewDto.hotelid },
      data: {
        rating: newRating,
      },
    });
    return review;
  }
}

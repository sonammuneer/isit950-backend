import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHotelDto } from '../dto/create-hotel.dto';
import { HotelDto } from '../dto/hotel-dto';
import { HotelFetchDto } from '../dto/hotel-fetch.dto';
import { ReviewDto } from '../dto/create-review.dto';
import { UpdateHotelDto } from '../dto/update-hotel.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class HotelsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
  ) {}
  saltOrRounds: number = 10;

  async createHotel(request: CreateHotelDto) {
    const { requestId, ...hotelData } = request;
    await this.prismaService.hotel.create({
      data: hotelData,
    });

    const temporaryPassword = Math.random().toString(36).slice(2, 10);
    const hashPass = await bcrypt.hash(temporaryPassword, this.saltOrRounds);
    try {
      await this.usersService.createUser({
        id: crypto.randomUUID(),
        email: request.adminemail,
        password: hashPass,
        name: request.name,
        phonenumber: '',
        dateofbirth: '',
        role: 'admin',
      });

      await this.prismaService.onboardingRequests.delete({
        where: { id: requestId },
      });

      return {
        email: request.adminemail,
        password: temporaryPassword,
      };
    } catch (e: any) {
      if (e.message.includes('UNIQUE constraint failed')) {
        throw new HttpException('User already exists!!', 409);
      }
    }
  }

  async updateHotel(request: UpdateHotelDto) {
    const { tags: newTags, ...hotelData } = request;

    return await this.prismaService.$transaction(async (prisma) => {
      const existingHotel = await prisma.hotel.findUnique({
        where: { id: request.id },
        include: { tags: true },
      });

      const tagsToDelete = existingHotel.tags
        .filter((existingTag) => !newTags?.includes(existingTag.name))
        .map((tag) => tag.id);

      const existingTagNames = existingHotel.tags.map((tag) => tag.name);
      const tagsToCreate =
        newTags?.filter((tagName) => !existingTagNames.includes(tagName)) || [];

      return await prisma.hotel.update({
        where: { id: request.id },
        data: {
          ...hotelData,
          tags: {
            deleteMany:
              tagsToDelete.length > 0
                ? {
                    id: { in: tagsToDelete },
                  }
                : undefined,
            create: tagsToCreate.map((tagName) => ({ name: tagName })),
          },
        },
        include: {
          tags: true,
        },
      });
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

  async searchHotels(keywords: string[]): Promise<HotelDto[]> {
    const keywordConditions = keywords.map((keyword) => ({
      OR: [
        { name: { contains: keyword.toLowerCase() } },
        { place: { contains: keyword.toLowerCase() } },
        {
          tags: { some: { name: { contains: keyword.toLowerCase() } } },
        },
      ],
    }));
    return this.prismaService.hotel.findMany({
      where: {
        OR: keywordConditions,
      },
    });
  }

  async fetchHotelIdbyHotelAdmin(adminEmail: string) {
    return await this.prismaService.hotel.findFirst({
      where: { adminemail: adminEmail },
      select: { id: true },
    });
  }
}

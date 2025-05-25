import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto as CreateUserDto } from '../dto/create-user.dto';
import { UserDto } from '../dto/user-dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { FetchUserDto } from '../dto/fetch-user-dto';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async listAllUsers(): Promise<FetchUserDto[]> {
    return this.prismaService.user.findMany({
      omit: {
        password: true,
      },
    });
  }

  async findOne(email: string): Promise<UserDto | undefined> {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  async createUser(createUserDto: CreateUserDto): Promise<FetchUserDto> {
    return this.prismaService.user.create({
      data: createUserDto,
      omit: {
        password: true,
      },
    });
  }

  async getUserCount(): Promise<number> {
    return this.prismaService.user.count();
  }

  async deleteUser(email: string) {
    return await this.prismaService.user.delete({
      where: {
        email: email,
      },
    });
  }

  async editUser(updateUserDto: UpdateUserDto): Promise<FetchUserDto> {
    return await this.prismaService.user.update({
      where: {
        email: updateUserDto.email,
      },
      data: {
        ...updateUserDto,
      },
      omit: {
        password: true,
      },
    });
  }

  async fetchUser(email: string): Promise<FetchUserDto> {
    return await this.prismaService.user.findFirst({
      where: {
        email: email,
      },
      include: {
        Subscriptions: {
          select: {
            id: true,
            expireson: true,
          },
        },
      },
      omit: {
        password: true,
      },
    });
  }

  async addToFavourites(userId: string, hotelId: string) {
    return await this.prismaService.favourites.create({
      data: {
        userid: userId,
        hotelid: hotelId,
      },
    });
  }

  async fetchFavouritesByUserId(userId: string) {
    const favourites = await this.prismaService.favourites.findMany({
      where: { userid: userId },
    });
    const favouritedHotelIds = favourites.map((favourite) => favourite.hotelid);
    return await this.prismaService.hotel.findMany({
      where: {
        id: {
          in: favouritedHotelIds,
        },
      },
    });
  }

  async updatePassword(request: { newPassword: string; email: string }) {
    return this.prismaService.user.update({
      where: { email: request.email },
      data: {
        password: request.newPassword,
      },
      omit: {
        password: true,
      },
    });
  }

  async updateSubscription(request: {
    id: string;
    expireson: string;
    amountpaid: number;
  }) {
    const newExpiryDate = new Date(request.expireson);
    const subscription = await this.prismaService.subscriptions.update({
      where: {
        id: request.id,
      },
      data: {
        expireson: newExpiryDate,
        amountpaid: request.amountpaid,
      },
    });

    await this.prismaService.notifications.create({
      data: {
        userid: subscription.userid,
        description: `Congrats! Your have renewed your subscription.`,
        timestamp: new Date(Date.now()),
      },
    });

    return subscription;
  }

  async createSubscription(request: CreateSubscriptionDto) {
    const expireson = new Date(request.expireson);
    return this.prismaService.subscriptions.create({
      data: { ...request, expireson: expireson },
    });
  }
}

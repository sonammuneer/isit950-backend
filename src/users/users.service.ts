import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto as CreateUserDto } from '../dto/create-user.dto';
import { UserDto } from '../dto/user-dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async listAllUsers(): Promise<UserDto[]> {
    return this.prismaService.user.findMany();
  }

  async findOne(email: string): Promise<UserDto | undefined> {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
    return this.prismaService.user.create({ data: createUserDto });
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

  async editUser(updateUserDto: UpdateUserDto) {
    return await this.prismaService.user.update({
      where: {
        email: updateUserDto.email,
      },
      data: {
        ...updateUserDto,
      },
    });
  }

  async fetchUser(email: string) {
    return await this.prismaService.user.findFirst({
      where: {
        email: email,
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
}

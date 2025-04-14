import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserDto } from '../dto/user-dto';

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
}

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

  async getUserCount(): Promise<number> {
    return this.usersService.getUserCount();
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
    return this.prismaService.onboardingRequests.findMany({});
  }
}

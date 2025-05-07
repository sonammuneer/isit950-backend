import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserDto } from '../dto/user-dto';

@Injectable()
export class AdminService {
  constructor(private usersService: UsersService) {}

  async listAllUsers() { // : Promise<UserDto[]>
    try {
      return this.usersService.listAllUsers();
    } catch (error) {
      return { message: error };
    }
  }

  async getUserCount(): Promise<number> {
    return this.usersService.getUserCount();
  }

  async deleteUser(email: string): Promise<UserDto> {
    return this.usersService.deleteUser(email);
  }
}

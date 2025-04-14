import {
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  Body,
  Delete,
} from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @HttpCode(HttpStatus.OK)
  @Get('users/list')
  listAllUsers() {
    return this.adminService.listAllUsers();
  }

  @HttpCode(HttpStatus.OK)
  @Get('users/count')
  async getUserCount() {
    const count = await this.adminService.getUserCount();
    return { totalCount: count };
  }

  @HttpCode(HttpStatus.OK)
  @Delete('user/delete')
  async deleteUser(@Body() deleteUserDto: { userEmail: string }) {
    return await this.adminService.deleteUser(deleteUserDto.userEmail);
  }
}

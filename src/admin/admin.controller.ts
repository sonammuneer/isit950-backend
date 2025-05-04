import {
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  Body,
  Delete,
  Post,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { HotelsService } from '../hotels/hotels.service';
import { CreateHotelDto } from '../dto/create-hotel.dto';

@Controller('admin')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private hotelsService: HotelsService,
  ) {}

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

  @HttpCode(HttpStatus.OK)
  @Get('hotels/count')
  async getHotelsCount() {
    const count = await this.hotelsService.getHotelsCount();
    return { totalCount: count };
  }

  @HttpCode(HttpStatus.OK)
  @Post('hotel/create')
  async createHotel(@Body() request: CreateHotelDto) {
    const result = await this.hotelsService.createHotel(request);
    return result;
  }
}

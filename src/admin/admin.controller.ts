import {
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  Body,
  Delete,
  Post,
  Put,
  Param,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { HotelsService } from '../hotels/hotels.service';
import { CreateHotelDto } from '../dto/create-hotel.dto';
import { RoomsService } from '../rooms/rooms.service';
import { CreateRoomDto } from '../dto/create-room.dto';
import { BookingService } from '../booking/booking.service';
import { CreateOnboardingRequestDto } from '../dto/create-onboarding-request.dto';
import { UpdateHotelDto } from 'src/dto/update-hotel.dto';

@Controller('admin')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private hotelsService: HotelsService,
    private roomsService: RoomsService,
    private bookingService: BookingService,
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

  @HttpCode(HttpStatus.OK)
  @Put('hotel/update')
  async updateHotel(@Body() request: UpdateHotelDto) {
    const result = await this.hotelsService.updateHotel(request);
    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Post('room/create')
  async createRoom(@Body() request: CreateRoomDto) {
    const result = await this.roomsService.createRoom(request);
    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Put('room/update')
  editUser(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.editRoom(createRoomDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('room/fetch/:roomid')
  getRooms(@Param() params: any) {
    return this.roomsService.fetchRoom(params.roomid);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('room/delete')
  async deleteRoom(@Body() deleteRoomDto: { roomId: string }) {
    return await this.roomsService.deleteRoom(deleteRoomDto.roomId);
  }

  @HttpCode(HttpStatus.OK)
  @Get('booking/list/:hotelid')
  getBookingsByHotelId(@Param() params: any) {
    return this.bookingService.getBookingsByHotelId(params.hotelid);
  }

  @HttpCode(HttpStatus.OK)
  @Post('onboard/request')
  createOnboardingRequest(@Body() request: CreateOnboardingRequestDto) {
    return this.adminService.createOnboardingRequest(request);
  }

  @HttpCode(HttpStatus.OK)
  @Get('onboard/request/list')
  fetchPendingRequests() {
    return this.adminService.fetchPendingRequests();
  }
}

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
import { UpdateHotelDto } from '../dto/update-hotel.dto';
import { BlockDateDto } from '../dto/block-date.dto';

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
  @Delete('user/delete')
  async deleteUser(@Body() deleteUserDto: { userEmail: string }) {
    return await this.adminService.deleteUser(deleteUserDto.userEmail);
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

  @HttpCode(HttpStatus.OK)
  @Get('hoteladmin/stats/:hotelid')
  fetchHotelAdminStats(@Param() params: any) {
    return this.adminService.fetchHotelAdminStats(params.hotelid);
  }

  @HttpCode(HttpStatus.OK)
  @Get('upcomingbookings/:hotelid')
  upcomingBookings(@Param() params: any) {
    return this.adminService.upcomingBookings(params.hotelid);
  }

  @HttpCode(HttpStatus.OK)
  @Get('superuser/stats')
  superUserStats() {
    return this.adminService.superUserStats();
  }

  @HttpCode(HttpStatus.OK)
  @Post('customer/rate')
  async rateCustomer(@Body() request: { userId: string; rating: number }) {
    const result = await this.adminService.rateCustomer(request);
    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Post('dates/block')
  async blockDates(@Body() request: BlockDateDto) {
    const result = await this.adminService.blockDates(request);
    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Put('dates/blocked/get')
  async getBlockedDates(
    @Body() request: { roomId: string; startDate: string; endDate: string },
  ) {
    const result = await this.adminService.getBlockedDates(request);
    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Put('dates/booked/get')
  async getBookedDates(
    @Body() request: { roomId: string; startDate: string; endDate: string },
  ) {
    const result = await this.adminService.getBookedDates(request);
    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Delete('onboard/delete')
  async rejectOnboarding(@Body() request: { id: string }) {
    return await this.adminService.deleteOnboardingRequest(request);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('booking/decline')
  async declineBooking(@Body() request: { bookingId: string }) {
    return await this.adminService.declineBooking(request.bookingId);
  }
}

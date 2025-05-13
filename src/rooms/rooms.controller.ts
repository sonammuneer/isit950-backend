import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @HttpCode(HttpStatus.OK)
  @Get('list/:hotelid')
  getRooms(@Param() params: any) {
    return this.roomsService.getRooms(params.hotelid);
  }
}

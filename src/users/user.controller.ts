import {
  Controller,
  HttpCode,
  HttpStatus,
  Body,
  Put,
  Get,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Put('update')
  editUser(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.editUser(updateUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('fetch')
  fetchUser(@Body() fetchUserDto: { email: string }) {
    return this.usersService.fetchUser(fetchUserDto.email);
  }
}

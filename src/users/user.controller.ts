import {
  Controller,
  HttpCode,
  HttpStatus,
  Body,
  Put,
  Get,
  Post,
  Param,
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

  @HttpCode(HttpStatus.OK)
  @Post('addtofavourites')
  addToFavourites(
    @Body() addToFavouritesDto: { userId: string; hotelId: string },
  ) {
    return this.usersService.addToFavourites(
      addToFavouritesDto.userId,
      addToFavouritesDto.hotelId,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get('favourites/fetch/:userid')
  fetchFavouritesByUserId(@Param() param: any) {
    return this.usersService.fetchFavouritesByUserId(param.userid);
  }
}

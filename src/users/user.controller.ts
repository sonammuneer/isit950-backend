import {
  Controller,
  HttpCode,
  HttpStatus,
  Body,
  Put,
  Get,
  Post,
  Param,
  Delete,
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
  @Get('fetch/:email')
  fetchUser(@Param() param: any) {
    return this.usersService.fetchUser(param.email);
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
  @Delete('removefromfavourites')
  removeFromFavourites(@Body() removeFromFavourites: { favId: string }) {
    return this.usersService.removeFromFavourites(removeFromFavourites.favId);
  }

  @HttpCode(HttpStatus.OK)
  @Get('favourites/fetch/:userid')
  fetchFavouritesByUserId(@Param() param: any) {
    return this.usersService.fetchFavouritesByUserId(param.userid);
  }
}

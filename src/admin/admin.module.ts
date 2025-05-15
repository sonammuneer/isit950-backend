import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UsersModule } from '../users/users.module';
import { AdminController } from './admin.controller';
import { HotelsModule } from '../hotels/hotels.module';
import { RoomsModule } from '../rooms/rooms.module';
import { BookingModule } from 'src/booking/booking.module';

@Module({
  imports: [UsersModule, HotelsModule, RoomsModule, BookingModule],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}

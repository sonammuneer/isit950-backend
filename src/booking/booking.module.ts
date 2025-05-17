import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { RoomsModule } from 'src/rooms/rooms.module';

@Module({
  imports: [PrismaModule, RoomsModule],
  providers: [BookingService],
  controllers: [BookingController],
  exports: [BookingService],
})
export class BookingModule {}

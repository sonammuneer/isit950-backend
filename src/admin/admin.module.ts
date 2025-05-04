import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UsersModule } from '../users/users.module';
import { AdminController } from './admin.controller';
import { HotelsModule } from 'src/hotels/hotels.module';

@Module({
  imports: [UsersModule, HotelsModule],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}

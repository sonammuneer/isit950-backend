import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { HotelsService } from './hotels.service';
import { HotelsController } from './hotels.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [UsersModule, PrismaModule],
  providers: [HotelsService],
  controllers: [HotelsController],
  exports: [HotelsService],
})
export class HotelsModule {}

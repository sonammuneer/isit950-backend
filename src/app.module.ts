import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AdminModule } from './admin/admin.module';
import { HotelsModule } from './hotels/hotels.module';

@Module({
  imports: [AuthModule, UsersModule, PrismaModule, AdminModule, HotelsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createNotification(request: CreateNotificationDto) {
    return this.prismaService.notifications.create({
      data: { ...request, timestamp: new Date(Date.now()) },
    });
  }

  async getNotificationsForEachUser(userid: string) {
    return this.prismaService.notifications.findMany({
      where: {
        userid: userid,
      },
    });
  }
}

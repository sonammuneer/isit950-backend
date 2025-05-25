import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getNotificationsForEachUser(userid: string) {
    return this.prismaService.notifications.findMany({
      where: {
        userid: userid,
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: 25,
    });
  }
}

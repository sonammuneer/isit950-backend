import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @HttpCode(HttpStatus.OK)
  @Get('fetch/:userid')
  getNotificationsForEachUser(@Param() params: any) {
    return this.notificationsService.getNotificationsForEachUser(params.userid);
  }
}

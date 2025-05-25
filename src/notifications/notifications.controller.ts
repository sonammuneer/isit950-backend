import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @HttpCode(HttpStatus.OK)
  @Post('create')
  createNotification(@Body() request: CreateNotificationDto) {
    return this.notificationsService.createNotification(request);
  }

  @HttpCode(HttpStatus.OK)
  @Get('fetch/:userid')
  getNotificationsForEachUser(@Param() params: any) {
    return this.notificationsService.getNotificationsForEachUser(params.userid);
  }
}

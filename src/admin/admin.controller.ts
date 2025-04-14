import { Controller, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @HttpCode(HttpStatus.OK)
  @Get('users/list')
  listAllUsers() {
    return this.adminService.listAllUsers();
  }

  @HttpCode(HttpStatus.OK)
  @Get('users/count')
  async getUserCount() {
    const count = await this.adminService.getUserCount();
    return { totalCount: count };
  }
}

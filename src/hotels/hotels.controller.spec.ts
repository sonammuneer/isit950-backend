import { Test, TestingModule } from '@nestjs/testing';
import { HotelsController } from './hotels.controller';
import { HotelsService } from './hotels.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';

describe('HotelsController', () => {
  let controller: HotelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HotelsController],
      providers: [HotelsService, PrismaService, UsersService],
    }).compile();

    controller = module.get<HotelsController>(HotelsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { FetchUserDto } from '../dto/fetch-user-dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  saltOrRounds: number = 10;

  async signIn(
    email: string,
    pass: string,
  ): Promise<{ access_token: string; role: string }> {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new HttpException("User doesn't exist for this email!", 401);
    }

    if (user?.password !== pass) {
      const isMatch = await bcrypt.compare(pass, user?.password);

      if (!isMatch) {
        throw new UnauthorizedException('Your password is incorrect!');
      }
    }

    const payload = { sub: user.id, username: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
      role: user.role,
    };
  }

  async signUp(createUserDto: CreateUserDto): Promise<FetchUserDto> {
    const hashPass = await bcrypt.hash(
      createUserDto.password,
      this.saltOrRounds,
    );

    let data = {
      ...createUserDto,
      password: hashPass,
    };
    try {
      const user = await this.usersService.createUser(data);
      return user;
    } catch (e: any) {
      if (e.message.includes('UNIQUE constraint failed')) {
        throw new HttpException('User already exists!!', 409);
      }
    }
  }

  async resetPassword(request: UpdatePasswordDto) {
    const user = await this.usersService.findOne(request.email);

    if (user?.password !== request.oldPassword) {
      const isMatch = await bcrypt.compare(request.oldPassword, user?.password);

      if (!isMatch) {
        throw new UnauthorizedException('Old password is incorrect!');
      }
    }

    const hashPass = await bcrypt.hash(request.newPassword, this.saltOrRounds);

    return this.usersService.updatePassword({
      newPassword: hashPass,
      email: request.email,
    });
  }
}

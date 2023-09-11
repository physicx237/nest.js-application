import { Body, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Token } from './types/token.type';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(@Body() authDto: AuthDto): Promise<Token> {
    const user = await this.usersService.findOne(authDto);
    if (user == null) {
      throw new UnauthorizedException();
    }
    const password = await bcrypt.compare(authDto.password, user.password);
    if (password !== true) {
      throw new UnauthorizedException();
    }
    const payload = {
      id: user.id,
      email: user.email,
      password: user.password,
      role: user.role,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }
}

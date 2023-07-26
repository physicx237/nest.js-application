import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { AuthDto } from '../auth/dto/auth.dto';
import { Role } from '../roles/role.enum';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@UseGuards(RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.Admin)
  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post()
  findOne(@Body() authDto: AuthDto): Promise<User> {
    return this.usersService.findOne(authDto);
  }

  @Roles(Role.Admin)
  @Get(':id')
  findOneForAdmin(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOneForAdmin(id);
  }

  @Put()
  update(
    @Body() createUserDto: CreateUserDto,
    @Headers('Authorization') authorization: string,
  ): Promise<UpdateResult> {
    return this.usersService.update(createUserDto, authorization);
  }

  @Delete()
  remove(@Body() authDto: AuthDto): Promise<void> {
    return this.usersService.remove(authDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  removeForAdmin(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.removeForAdmin(id);
  }
}

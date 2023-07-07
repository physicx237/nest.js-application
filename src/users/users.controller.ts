import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { Role } from 'src/roles/role.enum';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';

@UseGuards(RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.Admin)
  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get()
  findOne(@Body() authDto: AuthDto): Promise<User> {
    return this.usersService.findOne(authDto);
  }

  @Roles(Role.Admin)
  @Get(':id')
  findOneForAdmin(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOneForAdmin(id);
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

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthDto } from 'src/auth/dto/auth.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();

    user.name = createUserDto.name;
    user.age = createUserDto.age;
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    user.roles = createUserDto.roles;

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOneForAdmin(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id: id });
  }

  findOne(authDto: AuthDto): Promise<User> {
    return this.usersRepository.findOneBy({
      email: authDto.email,
      password: authDto.password,
    });
  }

  async remove(authDto: AuthDto): Promise<void> {
    await this.usersRepository.delete({
      email: authDto.email,
      password: authDto.password,
    });
  }

  async removeForAdmin(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}

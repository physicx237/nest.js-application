import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();

    user.name = createUserDto.name;
    user.age = createUserDto.age;
    user.email = createUserDto.email;
    user.password = await bcrypt.hash(createUserDto.password, 10);
    user.role = createUserDto.role;

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
    });
  }

  async update(
    createUserDto: CreateUserDto,
    authorization: string,
  ): Promise<UpdateResult> {
    const token = authorization.replace('Bearer ', '');
    const user = await this.jwtService.verifyAsync(token);
    return this.usersRepository.update(
      { id: user.id },
      {
        name: createUserDto.name,
        age: createUserDto.age,
        email: createUserDto.email,
        password: createUserDto.password,
        role: createUserDto.role,
      },
    );
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

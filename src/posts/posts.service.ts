import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Posts } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
    private readonly jwtService: JwtService,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    authorization: string,
  ): Promise<Posts> {
    const token = authorization.replace('Bearer ', '');
    const user = await this.jwtService.verifyAsync(token);

    const post = new Posts();

    post.text = createPostDto.text;
    post.userId = user.id;

    return this.postsRepository.save(post);
  }

  async findAll(authorization: string): Promise<Posts[]> {
    const token = authorization.replace('Bearer ', '');
    const user = await this.jwtService.verifyAsync(token);
    return this.postsRepository.findBy({ userId: user.id });
  }

  async update(
    createPostDto: CreatePostDto,
    authorization: string,
    id: number,
  ): Promise<UpdateResult> {
    const token = authorization.replace('Bearer ', '');
    const user = await this.jwtService.verifyAsync(token);
    return this.postsRepository.update(
      { userId: user.id, id: id },
      { text: createPostDto.text },
    );
  }

  async remove(id: number): Promise<void> {
    await this.postsRepository.delete(id);
  }
}

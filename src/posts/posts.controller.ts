import {
  Controller,
  Post,
  Get,
  Body,
  Delete,
  Param,
  Headers,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Posts } from './entities/post.entity';
import { UpdateResult } from 'typeorm';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  signUp(
    @Body() createPostDto: CreatePostDto,
    @Headers('Authorization') authorization: string,
  ): Promise<Posts> {
    return this.postsService.create(createPostDto, authorization);
  }

  @Get()
  findAll(@Headers('Authorization') authorization: string): Promise<Posts[]> {
    return this.postsService.findAll(authorization);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() createPostDto: CreatePostDto,
    @Headers('Authorization') authorization: string,
  ): Promise<UpdateResult> {
    return this.postsService.update(createPostDto, authorization, id);
  }

  @Delete(':id')
  remove(@Param() id: number): Promise<void> {
    return this.postsService.remove(id);
  }
}

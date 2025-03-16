import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UserId } from '../decorators/user-id.decorator';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('all')
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get()
  async findOne(@UserId(ParseIntPipe) userId: number): Promise<User> {
    return await this.usersService.findOne(+userId);
  }

  @Patch()
  async update(
    @UserId(ParseIntPipe) userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return await this.usersService.update(+userId, updateUserDto);
  }

  @Delete()
  async remove(@UserId(ParseIntPipe) userId: number): Promise<DeleteResult> {
    return await this.usersService.remove(+userId);
  }
}

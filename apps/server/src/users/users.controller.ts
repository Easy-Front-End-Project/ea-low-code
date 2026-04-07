import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @Get('list')
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get('detail')
  async findOne(@Query('id', ParseIntPipe) id: number): Promise<User> {
    return await this.usersService.findOne(id);
  }

  @Post('update')
  async update(@Body() updateUserDto: UpdateUserDto): Promise<User> {
    return await this.usersService.update(updateUserDto.id, updateUserDto.data);
  }

  @Post('delete')
  async remove(
    @Body() deleteUserDto: DeleteUserDto,
  ): Promise<{ message: string }> {
    await this.usersService.remove(deleteUserDto.id);
    return { message: `User with ID ${deleteUserDto.id} has been deleted` };
  }
}

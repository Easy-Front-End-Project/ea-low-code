import { Controller, Get, Post, Body, Query, ParseIntPipe, UseGuards } from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { DeleteUserDto } from './dto/delete-user.dto'
import { User } from './entities/user.entity'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('用户管理')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  @ApiOperation({
    summary: '创建用户（注册）',
    description: '创建新用户，密码会自动加密存储。此接口无需认证。',
  })
  @ApiResponse({ status: 201, description: '用户创建成功', type: User })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('list')
  @ApiOperation({ summary: '获取用户列表', description: '获取所有用户列表' })
  @ApiResponse({ status: 200, description: '获取成功', type: [User] })
  @ApiResponse({ status: 401, description: '未授权' })
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll()
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('detail')
  @ApiOperation({
    summary: '获取用户详情',
    description: '根据用户ID获取详细信息',
  })
  @ApiQuery({ name: 'id', description: '用户ID', example: 1 })
  @ApiResponse({ status: 200, description: '获取成功', type: User })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @ApiResponse({ status: 401, description: '未授权' })
  async findOne(@Query('id', ParseIntPipe) id: number): Promise<User> {
    return await this.usersService.findOne(id)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post('update')
  @ApiOperation({
    summary: '更新用户',
    description: '更新用户信息，密码更新会自动加密',
  })
  @ApiResponse({ status: 200, description: '更新成功', type: User })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @ApiResponse({ status: 401, description: '未授权' })
  async update(@Body() updateUserDto: UpdateUserDto): Promise<User> {
    return await this.usersService.update(updateUserDto.id, updateUserDto.data)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post('delete')
  @ApiOperation({ summary: '删除用户', description: '根据用户ID删除用户' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @ApiResponse({ status: 401, description: '未授权' })
  async remove(@Body() deleteUserDto: DeleteUserDto): Promise<{ message: string }> {
    await this.usersService.remove(deleteUserDto.id)
    return { message: `User with ID ${deleteUserDto.id} has been deleted` }
  }
}

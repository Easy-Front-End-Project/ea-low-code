import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

interface RequestWithUser extends Request {
  user: { userId: number; username: string };
}

@ApiTags('认证授权')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: '用户登录', description: '使用用户名和密码登录，返回 JWT Token' })
  @ApiResponse({ 
    status: 200, 
    description: '登录成功',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 1,
          username: 'john_doe',
          email: 'john@example.com',
          nickname: 'John',
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: '用户名或密码错误' })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: '获取当前用户信息', description: '需要携带 JWT Token' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ 
    status: 200, 
    description: '获取成功',
    schema: {
      example: {
        userId: 1,
        username: 'john_doe'
      }
    }
  })
  @ApiResponse({ status: 401, description: '未授权' })
  getProfile(@Request() req: RequestWithUser) {
    return req.user;
  }
}

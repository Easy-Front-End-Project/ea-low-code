import { Controller, Get, UseGuards, Request as NestRequest } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StatsService } from './stats.service';

@ApiTags('统计数据')
@Controller('stats')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: '获取仪表盘统计数据' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      example: {
        projectCount: 12,
        pageCount: 48,
        componentCount: 156,
        todayActivityCount: 5,
      },
    },
  })
  async getDashboardStats(@NestRequest() req: any) {
    const userId = req.user.userId;
    return await this.statsService.getDashboardStats(userId);
  }

  @Get('recent-projects')
  @ApiOperation({ summary: '获取最近项目' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      example: [
        {
          id: 1,
          name: '官网首页',
          thumbnail: 'https://example.com/thumb1.jpg',
          updatedAt: '2024-01-15T10:30:00.000Z',
        },
      ],
    },
  })
  async getRecentProjects(@NestRequest() req: any) {
    const userId = req.user.userId;
    return await this.statsService.getRecentProjects(userId);
  }

  @Get('activities')
  @ApiOperation({ summary: '获取最近活动' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      example: [
        {
          id: 1,
          type: 'create',
          description: '创建了项目 "官网首页"',
          createdAt: '2024-01-15T10:30:00.000Z',
        },
      ],
    },
  })
  async getRecentActivities(@NestRequest() req: any) {
    const userId = req.user.userId;
    return await this.statsService.getRecentActivities(userId);
  }
}

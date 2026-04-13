import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../pages/entities/project.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  /**
   * 获取仪表盘统计数据
   */
  async getDashboardStats(userId: number) {
    // 获取用户的项目数量
    const projectCount = await this.projectsRepository.count({
      where: { userId },
    });

    // 获取所有项目的页面数总和
    const projects = await this.projectsRepository.find({
      where: { userId },
      relations: ['pages'],
    });

    let pageCount = 0;
    let componentCount = 0;

    for (const project of projects) {
      // 统计页面数量
      if (project.pages) {
        pageCount += project.pages.length;
        
        // 统计组件数量
        for (const page of project.pages) {
          if (page.schema) {
            componentCount += this.countComponents(page.schema);
          }
        }
      }
    }

    // 获取今日活动数量（简化处理：今日更新的项目数）
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayActivityCount = await this.projectsRepository.count({
      where: {
        userId,
        updatedAt: today,
      },
    });

    return {
      projectCount,
      pageCount,
      componentCount,
      todayActivityCount,
    };
  }

  /**
   * 获取最近项目
   */
  async getRecentProjects(userId: number, limit: number = 4) {
    const projects = await this.projectsRepository
      .createQueryBuilder('p')
      .leftJoin('p.user', 'user')
      .addSelect([
        '(SELECT COUNT(*) FROM page_schemas ps WHERE ps.projectId = p.id) AS pageCount',
        'user.username',
        'user.email',
      ])
      .where('p.userId = :userId', { userId })
      .orderBy('p.updatedAt', 'DESC')
      .take(limit)
      .getRawMany();

    return projects.map((project: any) => ({
      id: project.p_id,
      name: project.p_name,
      description: project.p_description,
      pageCount: project.pageCount || 0,
      isPublished: project.p_isPublished,
      userName: project.user_username || '',
      userAccount: project.user_email || '',
      createdAt: project.p_createdAt,
      updatedAt: project.p_updatedAt,
    }));
  }

  /**
   * 获取最近活动
   */
  async getRecentActivities(userId: number, limit: number = 5) {
    // 获取最近更新的项目作为活动记录
    const projects = await this.projectsRepository.find({
      where: { userId },
      order: { updatedAt: 'DESC' },
      take: limit,
      select: ['id', 'name', 'createdAt', 'updatedAt'],
    });

    return projects.map(project => {
      const isNew = project.createdAt.getTime() === project.updatedAt.getTime();
      return {
        id: project.id,
        type: isNew ? 'create' : 'update',
        description: isNew 
          ? `创建了项目 "${project.name}"`
          : `更新了项目 "${project.name}"`,
        createdAt: project.updatedAt,
      };
    });
  }

  /**
   * 递归统计组件数量
   */
  private countComponents(schema: any): number {
    let count = 0;
    
    if (!schema || typeof schema !== 'object') {
      return count;
    }

    // 如果是一个组件节点
    if (schema.componentName || schema.type === 'component') {
      count++;
    }

    // 递归遍历子节点
    if (schema.children && Array.isArray(schema.children)) {
      for (const child of schema.children) {
        count += this.countComponents(child);
      }
    }

    // 遍历 components
    if (schema.components && Array.isArray(schema.components)) {
      for (const component of schema.components) {
        count += this.countComponents(component);
      }
    }

    return count;
  }
}

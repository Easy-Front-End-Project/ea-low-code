import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, MoreThanOrEqual } from 'typeorm'
import { Project } from '../pages/entities/project.entity'
import { RemoteComponent } from '../components/entities/remote-component.entity'

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(RemoteComponent)
    private componentsRepository: Repository<RemoteComponent>
  ) {}

  async getDashboardStats(userId: number) {
    const projectCount = await this.projectsRepository.count({
      where: { userId },
    })

    const projects = await this.projectsRepository.find({
      where: { userId },
      relations: ['pages'],
    })

    let pageCount = 0
    let pageComponentCount = 0

    for (const project of projects) {
      if (project.pages) {
        pageCount += project.pages.length
        for (const page of project.pages) {
          if (page.schema) {
            pageComponentCount += this.countComponents(page.schema)
          }
        }
      }
    }

    const remoteComponentCount = await this.componentsRepository.count({
      where: { userId },
    })

    const componentCount = pageComponentCount + remoteComponentCount

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [todayProjectUpdates, todayComponentUpdates] = await Promise.all([
      this.projectsRepository.count({
        where: {
          userId,
          updatedAt: MoreThanOrEqual(today),
        },
      }),
      this.componentsRepository.count({
        where: {
          userId,
          updatedAt: MoreThanOrEqual(today),
        },
      }),
    ])

    return {
      projectCount,
      pageCount,
      componentCount,
      todayActivityCount: todayProjectUpdates + todayComponentUpdates,
    }
  }

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
      .getRawMany()

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
    }))
  }

  async getRecentActivities(userId: number, limit: number = 10) {
    const [recentProjects, recentComponents] = await Promise.all([
      this.projectsRepository.find({
        where: { userId },
        order: { updatedAt: 'DESC' },
        take: Math.ceil(limit / 2),
        select: ['id', 'name', 'createdAt', 'updatedAt'],
      }),
      this.componentsRepository.find({
        where: { userId },
        order: { updatedAt: 'DESC' },
        take: Math.floor(limit / 2),
        select: ['id', 'name', 'createdAt', 'updatedAt'],
      }),
    ])

    const activities = []

    for (const project of recentProjects) {
      const isNew = project.createdAt.getTime() === project.updatedAt.getTime()
      activities.push({
        id: project.id,
        type: isNew ? 'create' : 'update',
        category: 'project',
        description: isNew ? `创建了项目 "${project.name}"` : `更新了项目 "${project.name}"`,
        createdAt: project.updatedAt,
      })
    }

    for (const component of recentComponents) {
      const isNew = component.createdAt.getTime() === component.updatedAt.getTime()
      activities.push({
        id: component.id,
        type: isNew ? 'create' : 'update',
        category: 'component',
        description: isNew
          ? `添加了远程组件 "${component.name}"`
          : `更新了组件 "${component.name}"`,
        createdAt: component.updatedAt,
      })
    }

    activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return activities.slice(0, limit)
  }

  private countComponents(schema: any): number {
    let count = 0

    if (!schema || typeof schema !== 'object') {
      return count
    }

    if (schema.componentName || schema.type === 'component') {
      count++
    }

    if (schema.children && Array.isArray(schema.children)) {
      for (const child of schema.children) {
        count += this.countComponents(child)
      }
    }

    if (schema.components && Array.isArray(schema.components)) {
      for (const component of schema.components) {
        count += this.countComponents(component)
      }
    }

    return count
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Project } from './entities/project.entity';
import { PageSchema } from './entities/page-schema.entity';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class PagesService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(PageSchema)
    private pageSchemaRepository: Repository<PageSchema>,
  ) {}

  async findAll(userId: number, query: any) {
    const { page = 1, pageSize = 12, keyword } = query;

    const queryBuilder = this.projectRepository
      .createQueryBuilder('p')
      .leftJoin('p.user', 'user')
      .addSelect([
        '(SELECT COUNT(*) FROM page_schemas ps WHERE ps.projectId = p.id) AS pageCount',
        'user.username',
        'user.email',
      ])
      .where('p.userId = :userId', { userId });

    if (keyword) {
      queryBuilder.andWhere('p.name LIKE :keyword', {
        keyword: `%${keyword}%`,
      });
    }

    const [list, total] = await queryBuilder
      .orderBy('p.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return {
      list: list.map((project) => ({
        id: project.id,
        name: project.name,
        description: project.description,
        pageCount: (project as any).pageCount || 0,
        isPublished: project.isPublished,
        userName: (project as any).username || '',
        userAccount: (project as any).email || '',
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      })),
      total,
      page,
      pageSize,
    };
  }

  async findOne(id: number, userId: number) {
    const project = await this.projectRepository.findOne({
      where: { id, userId },
      relations: ['user', 'pages'],
    });
    if (!project) {
      throw new NotFoundException('项目不存在');
    }
    return {
      ...project,
      pageCount: project.pages?.length || 0,
    };
  }

  async create(userId: number, createProjectDto: CreateProjectDto) {
    const defaultPageName = '首页';

    const project = this.projectRepository.create({
      name: createProjectDto.name,
      description: createProjectDto.description,
      userId,
      isPublished: false,
    });

    const savedProject = await this.projectRepository.save(project);

    const defaultPage = this.pageSchemaRepository.create({
      name: defaultPageName,
      schema: {
        components: [],
        config: {},
      },
      sortOrder: 0,
      projectId: savedProject.id,
    });

    await this.pageSchemaRepository.save(defaultPage);

    return savedProject;
  }

  async update(id: number, userId: number, updateData: Record<string, any>) {
    const project = await this.findOne(id, userId);
    Object.assign(project, updateData);
    delete (project as any).pageCount;
    return await this.projectRepository.save(project);
  }

  async remove(id: number, userId: number) {
    const project = await this.findOne(id, userId);
    await this.pageSchemaRepository.delete({ projectId: id });
    return await this.projectRepository.remove(project);
  }

  async clone(id: number, userId: number) {
    const source = await this.findOne(id, userId);

    const newProject = this.projectRepository.create({
      name: `${source.name} (副本)`,
      description: source.description,
      userId,
      isPublished: false,
    });

    const savedProject = await this.projectRepository.save(newProject);

    if (source.pages && source.pages.length > 0) {
      const newPages = source.pages.map((page) =>
        this.pageSchemaRepository.create({
          name: `${page.name}`,
          schema: JSON.parse(JSON.stringify(page.schema)),
          sortOrder: page.sortOrder,
          projectId: savedProject.id,
        }),
      );

      await this.pageSchemaRepository.save(newPages);
    }

    return savedProject;
  }
}

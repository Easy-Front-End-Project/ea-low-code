import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, Table, TableColumn } from 'typeorm';
import { EntitySchema } from 'typeorm';
import { DynamicModel } from './entities/dynamic-model.entity';
import { ModelField } from './entities/model-field.entity';
import { CreateModelDto } from './dto/create-model.dto';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';

const FIELD_TYPE_MAP: Record<string, string> = {
  text: 'varchar',
  number: 'int',
  date: 'date',
  datetime: 'datetime',
  boolean: 'tinyint',
  json: 'json',
};

const DEFAULT_FIELD_LENGTHS: Record<string, number> = {
  varchar: 255,
  text: 0,
  int: 11,
  bigint: 20,
  decimal: 10,
  date: 0,
  datetime: 0,
  tinyint: 1,
  json: 0,
};

@Injectable()
export class ModelsService {
  private readonly logger = new Logger(ModelsService.name);

  constructor(
    @InjectRepository(DynamicModel)
    private modelRepo: Repository<DynamicModel>,
    @InjectRepository(ModelField)
    private fieldRepo: Repository<ModelField>,
    @InjectDataSource()
    private dataSource: DataSource
  ) {}

  async findAll(keyword?: string): Promise<DynamicModel[]> {
    const queryBuilder = this.modelRepo.createQueryBuilder('model');

    if (keyword) {
      queryBuilder.where(
        '(model.name LIKE :keyword OR model.description LIKE :keyword)',
        { keyword: `%${keyword}%` }
      );
    }

    return queryBuilder.orderBy('model.createdAt', 'DESC').getMany();
  }

  async findOne(id: number): Promise<DynamicModel> {
    const model = await this.modelRepo.findOne({ where: { id } });
    if (!model) {
      throw new NotFoundException(`模型 ID ${id} 不存在`);
    }
    return model;
  }

  async findFields(
    modelId: number,
    page = 1,
    pageSize = 50
  ): Promise<{
    list: ModelField[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const [list, total] = await this.fieldRepo.findAndCount({
      where: { modelId },
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { list, total, page: Number(page), pageSize: Number(pageSize) };
  }

  async findModelWithFields(
    id: number
  ): Promise<{ model: DynamicModel; fields: ModelField[] }> {
    const model = await this.findOne(id);
    const fields = await this.fieldRepo.find({
      where: { modelId: id },
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
    });
    return { model, fields };
  }

  async createModel(dto: CreateModelDto): Promise<DynamicModel> {
    const existing = await this.modelRepo.findOne({
      where: { name: dto.name },
    });
    if (existing) {
      throw new BadRequestException(`模型名称 "${dto.name}" 已存在`);
    }

    const tableName = `dyn_${dto.name.toLowerCase().replace(/[^a-z0-9_]/g, '_')}`;

    const model = this.modelRepo.create({
      name: dto.name,
      tableName,
      description: dto.description || '',
    });

    const savedModel = await this.modelRepo.save(model);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const tableExists = await queryRunner.hasTable(tableName);
      if (tableExists) {
        throw new BadRequestException(`表名 "${tableName}" 已存在`);
      }

      const table = new Table({
        name: tableName,
        columns: [
          new TableColumn({
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          }),
          new TableColumn({
            name: 'created_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          }),
          new TableColumn({
            name: 'updated_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
          }),
        ],
      });

      await queryRunner.createTable(table);

      const systemFields = [
        {
          fieldName: 'id',
          fieldLabel: '主键',
          fieldType: 'number',
          sortOrder: 1,
          isSystem: true,
          isNullable: false,
        },
        {
          fieldName: 'created_at',
          fieldLabel: '创建时间',
          fieldType: 'datetime',
          sortOrder: 2,
          isSystem: true,
          isNullable: false,
        },
        {
          fieldName: 'updated_at',
          fieldLabel: '更新时间',
          fieldType: 'datetime',
          sortOrder: 3,
          isSystem: true,
          isNullable: false,
        },
      ];

      for (const sf of systemFields) {
        await queryRunner.manager.insert(ModelField, {
          modelId: savedModel.id,
          ...sf,
        });
      }

      await queryRunner.commitTransaction();

      this.logger.log(`创建动态表: ${tableName}`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await this.modelRepo.remove(savedModel);
      throw error;
    } finally {
      await queryRunner.release();
    }

    return savedModel;
  }

  async updateModel(
    id: number,
    dto: Partial<CreateModelDto>
  ): Promise<DynamicModel> {
    const model = await this.findOne(id);
    Object.assign(model, dto);
    return this.modelRepo.save(model);
  }

  async deleteModel(id: number): Promise<void> {
    const model = await this.findOne(id);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const tableExists = await queryRunner.hasTable(model.tableName);
      if (tableExists) {
        await queryRunner.dropTable(model.tableName);
        this.logger.log(`删除动态表: ${model.tableName}`);
      }

      await queryRunner.manager.delete(ModelField, { modelId: id });
      await this.modelRepo.remove(model);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async createField(dto: CreateFieldDto): Promise<ModelField> {
    const model = await this.findOne(dto.modelId);

    const existingField = await this.fieldRepo.findOne({
      where: { modelId: dto.modelId, fieldName: dto.fieldName },
    });
    if (existingField) {
      throw new BadRequestException(
        `字段名 "${dto.fieldName}" 在此模型中已存在`
      );
    }

    const ormType = FIELD_TYPE_MAP[dto.fieldType] || 'varchar';
    const length = dto.fieldLength || DEFAULT_FIELD_LENGTHS[ormType] || 255;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const columnOptions: any = {
        name: dto.fieldName,
        type: ormType,
        isNullable: dto.isNullable !== false,
      };

      if (ormType === 'varchar' && length > 0) {
        columnOptions.length = length;
      }

      if (dto.isUnique) {
        columnOptions.isUnique = true;
      }

      if (dto.defaultValue !== undefined && dto.defaultValue !== null) {
        columnOptions.default = dto.defaultValue;
      }

      await queryRunner.addColumn(
        model.tableName,
        new TableColumn(columnOptions)
      );

      const maxSort = await this.fieldRepo
        .createQueryBuilder('field')
        .select('MAX(field.sortOrder)', 'max')
        .where('field.modelId = :modelId', { modelId: dto.modelId })
        .getRawOne();

      const field = this.fieldRepo.create({
        modelId: dto.modelId,
        fieldName: dto.fieldName,
        fieldLabel: dto.fieldLabel,
        fieldType: dto.fieldType,
        fieldLength: length,
        isNullable: dto.isNullable !== false,
        isUnique: dto.isUnique || false,
        defaultValue: dto.defaultValue || null,
        sortOrder: dto.sortOrder ?? (maxSort?.max || 0) + 1,
        isSystem: false,
      });

      const savedField = await queryRunner.manager.save(field);
      await queryRunner.commitTransaction();

      this.logger.log(`添加字段 ${dto.fieldName} 到表 ${model.tableName}`);
      return savedField;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateField(
    id: number,
    dto: Partial<CreateFieldDto>
  ): Promise<ModelField> {
    const field = await this.fieldRepo.findOne({
      where: { id },
      relations: ['model'],
    });
    if (!field) {
      throw new NotFoundException(`字段 ID ${id} 不存在`);
    }

    if (field.isSystem) {
      throw new BadRequestException('系统字段不允许修改');
    }

    const model = field.model;

    const updateData: any = {};
    if (dto.fieldLabel !== undefined) updateData.fieldLabel = dto.fieldLabel;
    if (dto.fieldType !== undefined) updateData.fieldType = dto.fieldType;
    if (dto.fieldLength !== undefined) updateData.fieldLength = dto.fieldLength;
    if (dto.isNullable !== undefined) updateData.isNullable = dto.isNullable;
    if (dto.isUnique !== undefined) updateData.isUnique = dto.isUnique;
    if (dto.defaultValue !== undefined)
      updateData.defaultValue = dto.defaultValue;
    if (dto.sortOrder !== undefined) updateData.sortOrder = dto.sortOrder;

    if (Object.keys(updateData).length > 0) {
      const hasSchemaChange =
        dto.fieldType !== undefined ||
        dto.fieldLength !== undefined ||
        dto.isNullable !== undefined ||
        dto.isUnique !== undefined ||
        dto.defaultValue !== undefined;

      if (hasSchemaChange) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
          const ormType =
            FIELD_TYPE_MAP[dto.fieldType || field.fieldType] || 'varchar';
          const length =
            dto.fieldLength ??
            field.fieldLength ??
            DEFAULT_FIELD_LENGTHS[ormType];

          const columnOptions: any = {
            name: field.fieldName,
            type: ormType,
            isNullable: dto.isNullable ?? field.isNullable,
          };

          if (ormType === 'varchar' && length > 0) {
            columnOptions.length = length;
          }

          if (dto.isUnique ?? field.isUnique) {
            columnOptions.isUnique = true;
          }

          if (dto.defaultValue !== undefined) {
            columnOptions.default = dto.defaultValue;
          } else if (field.defaultValue !== null) {
            columnOptions.default = field.defaultValue;
          }

          await queryRunner.changeColumn(
            model.tableName,
            field.fieldName,
            new TableColumn(columnOptions)
          );

          await queryRunner.commitTransaction();
          this.logger.log(
            `修改字段 ${field.fieldName} 在表 ${model.tableName}`
          );
        } catch (error) {
          await queryRunner.rollbackTransaction();
          throw error;
        } finally {
          await queryRunner.release();
        }
      }
    }

    Object.assign(field, updateData);
    return this.fieldRepo.save(field);
  }

  async deleteField(id: number): Promise<void> {
    const field = await this.fieldRepo.findOne({
      where: { id },
      relations: ['model'],
    });
    if (!field) {
      throw new NotFoundException(`字段 ID ${id} 不存在`);
    }

    if (field.isSystem) {
      throw new BadRequestException('系统字段不允许删除');
    }

    const model = field.model;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.dropColumn(model.tableName, field.fieldName);
      await queryRunner.manager.remove(field);

      await queryRunner.commitTransaction();
      this.logger.log(`删除字段 ${field.fieldName} 从表 ${model.tableName}`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async sortFields(modelId: number, fieldIds: number[]): Promise<void> {
    for (let i = 0; i < fieldIds.length; i++) {
      await this.fieldRepo.update(
        { id: fieldIds[i], modelId },
        { sortOrder: i + 1 }
      );
    }
  }

  buildEntitySchema(
    model: DynamicModel,
    fields: ModelField[]
  ): EntitySchema<any> {
    const columns: Record<string, any> = {
      id: {
        primary: true,
        type: 'int',
        generated: 'increment',
      },
      created_at: {
        type: 'datetime',
        createDate: true,
      },
      updated_at: {
        type: 'datetime',
        updateDate: true,
      },
    };

    for (const field of fields) {
      const ormType = FIELD_TYPE_MAP[field.fieldType] || 'varchar';

      columns[field.fieldName] = {
        type: ormType,
        nullable: field.isNullable,
      };

      if (ormType === 'varchar' && field.fieldLength && field.fieldLength > 0) {
        columns[field.fieldName].length = field.fieldLength;
      }

      if (field.isUnique) {
        columns[field.fieldName].unique = true;
      }

      if (field.defaultValue !== null && field.defaultValue !== undefined) {
        columns[field.fieldName].default = field.defaultValue;
      }
    }

    return new EntitySchema({
      name: this.toEntityName(model.name),
      tableName: model.tableName,
      columns,
    });
  }

  async buildAllMetadatas(): Promise<void> {
    const models = await this.modelRepo.find({ where: { isActive: true } });
    const schemas: EntitySchema<any>[] = [];

    for (const model of models) {
      const fields = await this.fieldRepo.find({
        where: { modelId: model.id },
        order: { sortOrder: 'ASC' },
      });
      schemas.push(this.buildEntitySchema(model, fields));
    }

    if (schemas.length > 0) {
      this.dataSource.setOptions({ entities: schemas });
      try {
        await (this.dataSource as any).buildMetadatas();
      } catch (e) {
        this.logger.warn('构建元数据失败（可能部分实体已注册）:', e.message);
      }
    }

    this.logger.log(`已构建 ${schemas.length} 个动态模型的元数据`);
  }

  private toEntityName(name: string): string {
    return (
      name
        .split(/[-_]/)
        .map(
          (part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
        )
        .join('') + 'DynEntity'
    );
  }
}

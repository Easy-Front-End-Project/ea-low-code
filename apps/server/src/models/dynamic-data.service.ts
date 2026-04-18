import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { DynamicModel } from './entities/dynamic-model.entity';
import { ModelField } from './entities/model-field.entity';

@Injectable()
export class DynamicDataService {
  private readonly logger = new Logger(DynamicDataService.name);

  constructor(
    @InjectRepository(DynamicModel)
    private modelRepo: Repository<DynamicModel>,
    @InjectRepository(ModelField)
    private fieldRepo: Repository<ModelField>,
    @InjectDataSource()
    private dataSource: DataSource
  ) {}

  async find(tableName: string, body?: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    const where = this.buildWhere(body);
    const sql = `SELECT * FROM \`${tableName}\`${where ? ` WHERE ${where}` : ''}`;
    const data = await queryRunner.query(sql);
    await queryRunner.release();
    return data;
  }

  async page(tableName: string, body?: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    const page = Number(body?.page) || 0;
    const size = Number(body?.size) || 10;
    const where = this.buildWhere(body);
    const countSql = `SELECT COUNT(*) AS total FROM \`${tableName}\`${where ? ` WHERE ${where}` : ''}`;
    const [{ total }] = await queryRunner.query(countSql);
    const dataSql = `SELECT * FROM \`${tableName}\`${where ? ` WHERE ${where}` : ''} LIMIT ${size} OFFSET ${page * size}`;
    const data = await queryRunner.query(dataSql);
    await queryRunner.release();
    return { data, total: Number(total) };
  }

  async create(tableName: string, body: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    const keys = Object.keys(body);
    const values = Object.values(body);
    const placeholders = keys.map(() => '?').join(', ');
    const sql = `INSERT INTO \`${tableName}\` (${keys.map((k) => `\`${k}\``).join(', ')}) VALUES (${placeholders})`;
    const result = await queryRunner.query(sql, values);
    await queryRunner.release();
    return result;
  }

  async update(tableName: string, body: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    const { id, ...data } = body;
    const setClause = Object.entries(data)
      .map(([k]) => `\`${k}\` = ?`)
      .join(', ');
    const values = [...Object.values(data), id];
    const sql = `UPDATE \`${tableName}\` SET ${setClause} WHERE \`id\` = ?`;
    const result = await queryRunner.query(sql, values);
    await queryRunner.release();
    return result;
  }

  async delete(tableName: string, id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    const sql = `DELETE FROM \`${tableName}\` WHERE \`id\` = ?`;
    const result = await queryRunner.query(sql, [id]);
    await queryRunner.release();
    return result;
  }

  private buildWhere(body?: any): string {
    if (!body) return '';
    const excludeKeys = ['page', 'size', 'sortField', 'sortOrder'];
    const conditions: string[] = [];
    for (const [key, value] of Object.entries(body)) {
      if (
        !excludeKeys.includes(key) &&
        value !== undefined &&
        value !== null &&
        value !== ''
      ) {
        if (typeof value === 'string') {
          conditions.push(`\`${key}\` LIKE '%${value.replace(/'/g, "''")}%'`);
        } else {
          conditions.push(`\`${key}\` = ${value}`);
        }
      }
    }
    return conditions.join(' AND ');
  }
}

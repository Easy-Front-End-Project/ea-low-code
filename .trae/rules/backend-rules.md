# EA-LowCode 后端开发规范

## 概述

本项目后端基于 **NestJS + TypeORM + MySQL** 构建，遵循模块化、分层架构设计思想。本文档定义后端开发的代码规范、最佳实践和强制要求。

---

## 1. 项目结构规范

### 1.1 目录结构

```
apps/server/
├── src/
│   ├── modules/                  # 业务模块
│   │   ├── users/               # 用户模块示例
│   │   │   ├── dto/             # 数据传输对象
│   │   │   │   ├── create-user.dto.ts
│   │   │   │   ├── update-user.dto.ts
│   │   │   │   └── delete-user.dto.ts
│   │   │   ├── entities/        # 数据库实体
│   │   │   │   └── user.entity.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.module.ts
│   │   └── auth/                # 认证模块
│   ├── common/                  # 公共代码
│   │   ├── filters/             # 异常过滤器
│   │   ├── interceptors/        # 拦截器
│   │   ├── guards/              # 守卫
│   │   ├── decorators/          # 自定义装饰器
│   │   ├── utils/               # 工具函数
│   │   └── constants/           # 常量定义
│   ├── config/                  # 配置文件
│   ├── database/                # 数据库配置
│   └── main.ts                  # 应用入口
```

### 1.2 文件命名规范

| 类型 | 命名规范 | 示例 |
|------|----------|------|
| 控制器 | `*.controller.ts` | `users.controller.ts` |
| 服务 | `*.service.ts` | `users.service.ts` |
| 模块 | `*.module.ts` | `users.module.ts` |
| 实体 | `*.entity.ts` | `user.entity.ts` |
| DTO | `*.dto.ts` | `create-user.dto.ts` |
| 过滤器 | `*.filter.ts` | `http-exception.filter.ts` |
| 守卫 | `*.guard.ts` | `jwt-auth.guard.ts` |
| 装饰器 | `*.decorator.ts` | `roles.decorator.ts` |

---

## 2. API 设计规范

### 2.1 请求方式规范

**强制要求**：本项目统一使用 **GET** 和 **POST** 两种请求方式。

| 操作类型 | 请求方式 | 路径示例 | 说明 |
|----------|----------|----------|------|
| 创建资源 | POST | `/users/create` | 使用 POST 创建 |
| 查询列表 | GET | `/users/list` | 使用 GET 查询 |
| 查询详情 | GET | `/users/detail` | 使用 GET + Query 参数 |
| 更新资源 | POST | `/users/update` | 使用 POST + Body（含 id）|
| 删除资源 | POST | `/users/delete` | 使用 POST + Body（含 id）|

### 2.2 路径命名规范

- 使用 **小写字母** 和 **连字符**（kebab-case）
- 使用 **名词** 而非动词
- 使用 **复数形式** 表示资源集合

```typescript
// ✅ 正确
@Controller('users')
@Get('list')
@Post('create')

// ❌ 错误
@Controller('user')           // 应为复数
@Get('getList')               // 应为 list
@Post('createUser')           // 路径中不应有动词
```

### 2.3 参数传递规范

| 场景 | 参数位置 | 示例 |
|------|----------|------|
| 创建/更新/删除 | Body | `@Body() dto: CreateUserDto` |
| 查询详情 | Query | `@Query('id') id: number` |
| 认证信息 | Header | `Authorization: Bearer token` |

**禁止**使用 `@Param()` 路径参数。

---

## 3. DTO 设计规范

### 3.1 DTO 结构要求

每个操作必须有独立的 DTO：

```typescript
// create-user.dto.ts
export class CreateUserDto {
  @IsString()
  @Length(2, 50)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 100)
  password: string;
}

// update-user.dto.ts
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsInt()
  id: number;  // 更新必须包含 id
}

// delete-user.dto.ts
export class DeleteUserDto {
  @IsInt()
  id: number;
}
```

### 3.2 校验规则

**必须**为所有字段添加校验装饰器：

```typescript
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: '密码必须包含大小写字母和数字',
  })
  password: string;

  @IsOptional()
  @IsString()
  nickname?: string;
}
```

### 3.3 DTO 命名规范

| 操作 | DTO 名称 | 继承关系 |
|------|----------|----------|
| 创建 | `Create{X}Dto` | 独立定义 |
| 更新 | `Update{X}Dto` | `extends PartialType(Create{X}Dto)` |
| 删除 | `Delete{X}Dto` | 独立定义（仅含 id）|
| 查询 | `Query{X}Dto` | 独立定义（分页参数）|

---

## 4. 控制器规范

### 4.1 控制器模板

```typescript
import { Controller, Get, Post, Body, Query, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get('list')
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get('detail')
  async findOne(@Query('id', ParseIntPipe) id: number) {
    return await this.usersService.findOne(id);
  }

  @Post('update')
  async update(@Body() updateUserDto: UpdateUserDto) {
    const { id, ...dto } = updateUserDto;
    return await this.usersService.update(id, dto);
  }

  @Post('delete')
  async remove(@Body() deleteUserDto: DeleteUserDto) {
    return await this.usersService.remove(deleteUserDto.id);
  }
}
```

### 4.2 禁止事项

```typescript
// ❌ 禁止使用 PUT/DELETE/PATCH
@Put(':id')        // 禁止
@Delete(':id')     // 禁止
@Patch(':id')      // 禁止

// ❌ 禁止使用 @Param()
@Get(':id')        // 禁止
findOne(@Param('id') id: number)  // 禁止

// ❌ 禁止在控制器中写业务逻辑
@Post('create')
async create(@Body() dto: CreateUserDto) {
  // 禁止在这里写业务逻辑
  const user = new User();
  user.name = dto.name;
  await this.repository.save(user);
}
```

---

## 5. 服务层规范

### 5.1 服务层职责

- 处理业务逻辑
- 数据转换和校验
- 事务管理
- 调用 Repository 操作数据库

### 5.2 服务层模板

```typescript
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return await this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }
}
```

### 5.3 异常处理

**必须**在服务层抛出业务异常：

```typescript
import { NotFoundException, BadRequestException } from '@nestjs/common';

async findOne(id: number): Promise<User> {
  const user = await this.usersRepository.findOne({ where: { id } });
  if (!user) {
    throw new NotFoundException(`User with ID ${id} not found`);
  }
  return user;
}

async create(dto: CreateUserDto): Promise<User> {
  const existing = await this.usersRepository.findOne({
    where: { username: dto.username },
  });
  if (existing) {
    throw new BadRequestException('用户名已存在');
  }
  // ...
}
```

---

## 6. 实体设计规范

### 6.1 实体模板

```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  username: string;

  @Column({ length: 100 })
  email: string;

  @Column({ length: 100 })
  password: string;

  @Column({ length: 50, nullable: true })
  nickname: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 6.2 字段命名规范

- 使用 **camelCase** 命名
- 布尔字段以 **is/has/can** 开头
- 时间字段以 **At** 结尾

```typescript
// ✅ 正确
isActive: boolean;
hasPermission: boolean;
canEdit: boolean;
createdAt: Date;
updatedAt: Date;

// ❌ 错误
active: boolean;        // 应为 isActive
create_time: Date;      // 应为 createdAt
```

---

## 7. 配置管理规范

### 7.1 环境变量

**必须**使用环境变量管理配置：

```typescript
// app.module.ts
ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: ['../../.env', '../.env', './.env'],
}),

TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: 'mysql',
    host: configService.get('DB_HOST', 'localhost'),
    port: configService.get('DB_PORT', 3306),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_DATABASE'),
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: configService.get('NODE_ENV') !== 'production',
  }),
  inject: [ConfigService],
}),
```

### 7.2 环境变量文件

```bash
# .env（不提交到仓库）
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=secret
DB_DATABASE=low_code_db
JWT_SECRET=your-secret-key

# .env.example（提交到仓库）
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=
JWT_SECRET=
```

---

## 8. 安全规范

### 8.1 密码安全

**必须**使用 bcrypt 加密密码：

```typescript
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

async hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

### 8.2 JWT 认证

**必须**保护敏感接口：

```typescript
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  // ...
}

// 或针对单个方法
@Post('create')
@UseGuards(JwtAuthGuard)
async create(@Body() dto: CreateUserDto) {
  // ...
}
```

### 8.3 权限控制

```typescript
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  @Post('delete')
  @Roles('admin')
  async remove(@Body() dto: DeleteUserDto) {
    // ...
  }
}
```

---

## 9. 日志规范

### 9.1 日志级别

```typescript
// 错误日志
this.logger.error('Failed to create user', error.stack);

// 警告日志
this.logger.warn('User not found', { userId: id });

// 信息日志
this.logger.log('User created successfully', { userId: user.id });

// 调试日志
this.logger.debug('Processing user data', dto);
```

### 9.2 日志内容要求

- **必须**包含上下文信息（userId、requestId 等）
- **禁止**记录敏感信息（密码、token 等）
- **必须**记录异常堆栈

---

## 10. 测试规范

### 10.1 测试文件结构

```
users/
├── dto/
├── entities/
├── users.controller.ts
├── users.service.ts
├── users.module.ts
├── users.controller.spec.ts    # 控制器测试
└── users.service.spec.ts       # 服务测试
```

### 10.2 服务层测试模板

```typescript
describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const dto = { username: 'test', email: 'test@example.com', password: '123456' };
      const result = await service.create(dto);
      expect(result).toBeDefined();
    });

    it('should throw error when username exists', async () => {
      // ...
    });
  });
});
```

---

## 11. 代码质量检查清单

提交代码前必须检查：

- [ ] 所有 DTO 都有完整的校验装饰器
- [ ] 控制器只使用 GET 和 POST
- [ ] 不使用 @Param()，使用 @Query() 或 @Body()
- [ ] 服务层抛出合适的异常
- [ ] 敏感信息使用环境变量
- [ ] 密码已加密处理
- [ ] 代码通过 ESLint 检查
- [ ] 单元测试通过
- [ ] 文档已更新

---

## 12. 禁止事项

| 禁止项 | 说明 |
|--------|------|
| ❌ 使用 PUT/DELETE/PATCH | 统一使用 GET/POST |
| ❌ 使用 @Param() | 使用 @Query() 或 @Body() |
| ❌ 明文存储密码 | 必须使用 bcrypt 加密 |
| ❌ 在控制器写业务逻辑 | 业务逻辑放在 Service |
| ❌ 提交 .env 文件 | 必须添加到 .gitignore |
| ❌ 使用 any 类型 | 必须定义明确的类型 |
| ❌ 忽略异常处理 | 必须处理所有异常 |
| ❌ 硬编码配置 | 必须使用环境变量 |

---

## 参考文档

- [NestJS 官方文档](https://docs.nestjs.com/)
- [TypeORM 官方文档](https://typeorm.io/)
- [Class Validator 文档](https://github.com/typestack/class-validator)
- [项目架构文档](./backend-architecture.md)
- [开发计划文档](./backend-todo-plan.md)

/**
 * Schema v1 → v2 数据迁移脚本
 *
 * 用法：npx tsx scripts/migrate-schema-v2.ts
 *
 * 功能：
 * - 连接数据库，读取所有 page_schemas 表中的 schema 数据
 * - 检测 v1 格式的 schema 并执行迁移
 * - 写回数据库
 * - 输出迁移报告
 *
 * 注意：执行前请先备份数据库！
 */

import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// 加载环境变量
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = resolve(__dirname, '..')

dotenv.config({ path: resolve(rootDir, '.env') })
dotenv.config({ path: resolve(rootDir, 'apps/server/.env') })

// ==================== 迁移逻辑 ====================

const SCHEMA_VERSION = '2.0'
const LEGACY_SCHEMA_VERSION = '1.0'

interface MigrationResult {
  total: number
  migrated: number
  skipped: number
  errors: number
  details: Array<{
    id: number
    name: string
    status: 'migrated' | 'skipped' | 'error'
    message?: string
  }>
}

function isV1Schema(schema: unknown): boolean {
  if (!schema || typeof schema !== 'object') return false
  const obj = schema as Record<string, unknown>
  return obj.version === LEGACY_SCHEMA_VERSION || (!obj.version && Array.isArray(obj.components))
}

function isV2Schema(schema: unknown): boolean {
  if (!schema || typeof schema !== 'object') return false
  const obj = schema as Record<string, unknown>
  return obj.version === SCHEMA_VERSION
}

function migrateSlots(slots: Record<string, unknown> | undefined): Record<string, unknown> {
  if (!slots || typeof slots !== 'object') return {}

  const result: Record<string, unknown> = {}

  for (const [slotName, slotValue] of Object.entries(slots)) {
    if (slotValue && typeof slotValue === 'object' && 'name' in (slotValue as Record<string, unknown>)) {
      result[slotName] = slotValue
    } else if (slotValue && typeof slotValue === 'object') {
      result[slotName] = { name: slotName, props: slotValue }
    } else {
      result[slotName] = { name: slotName }
    }
  }

  return result
}

function migrateComponentV1ToV2(component: Record<string, unknown>): Record<string, unknown> {
  const migratedSlots = migrateSlots(component.slots as Record<string, unknown> | undefined)
  const slotProps = component.scopeBindings
    ? { ...(component.scopeBindings as Record<string, unknown>) }
    : undefined

  return {
    id: component.id,
    type: component.type,
    props: component.props ?? {},
    style: component.style ?? {},
    events: component.events ?? [],
    children: migrateChildrenV1ToV2(component.children as Record<string, unknown>[] | undefined),
    slots: migratedSlots,
    slotProps,
    positionStyle: component.positionStyle,
    cssVariables: component.cssVariables,
    customCSS: component.customCSS,
    isRemote: component.isRemote,
    remoteConfig: component.remoteConfig,
    childrenText: component.childrenText,
    alias: component.alias,
    scopeBindings: component.scopeBindings,
  }
}

function migrateChildrenV1ToV2(children: Record<string, unknown>[] | undefined): Record<string, unknown>[] {
  if (!Array.isArray(children)) return []
  return children.map(child => migrateComponentV1ToV2(child))
}

function migrateStoreSchemaToV2(schema: Record<string, unknown>): Record<string, unknown> {
  return {
    version: SCHEMA_VERSION,
    components: migrateChildrenV1ToV2(schema.components as Record<string, unknown>[] | undefined),
    layout: schema.layout ?? { type: 'default', config: {} },
    meta: schema.meta ?? { title: '未命名页面', description: '', viewport: {} },
    settings: schema.settings ?? {},
    variables: schema.variables ?? [],
  }
}

// ==================== 数据库操作 ====================

async function migrate() {
  console.log('=== Schema v1 → v2 数据迁移 ===\n')

  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || 'nestjs_db',
  }

  console.log('数据库配置:')
  console.log(`  主机: ${dbConfig.host}:${dbConfig.port}`)
  console.log(`  数据库: ${dbConfig.database}\n`)

  if (!dbConfig.user || !dbConfig.password) {
    console.error('错误：缺少数据库凭据，请检查 .env 文件中的 DB_USERNAME 和 DB_PASSWORD')
    process.exit(1)
  }

  const connection = await mysql.createConnection(dbConfig)

  try {
    // 查询所有页面 schema
    const [rows] = await connection.execute('SELECT id, name, `schema` FROM page_schemas')
    const pages = rows as Array<{ id: number; name: string; schema: unknown }>

    console.log(`共找到 ${pages.length} 个页面\n`)

    const result: MigrationResult = {
      total: pages.length,
      migrated: 0,
      skipped: 0,
      errors: 0,
      details: [],
    }

    for (const page of pages) {
      try {
        const schema = page.schema

        if (isV2Schema(schema)) {
          result.skipped++
          result.details.push({ id: page.id, name: page.name, status: 'skipped', message: '已是 v2 格式' })
          continue
        }

        if (!isV1Schema(schema)) {
          result.skipped++
          result.details.push({ id: page.id, name: page.name, status: 'skipped', message: '无法识别的 schema 格式' })
          continue
        }

        // 执行迁移
        const migratedSchema = migrateStoreSchemaToV2(schema as Record<string, unknown>)

        // 写回数据库
        await connection.execute('UPDATE page_schemas SET `schema` = ? WHERE id = ?', [
          JSON.stringify(migratedSchema),
          page.id,
        ])

        result.migrated++
        result.details.push({ id: page.id, name: page.name, status: 'migrated' })
      } catch (error) {
        result.errors++
        const message = error instanceof Error ? error.message : String(error)
        result.details.push({ id: page.id, name: page.name, status: 'error', message })
      }
    }

    // 输出报告
    console.log('=== 迁移报告 ===')
    console.log(`总计: ${result.total}`)
    console.log(`已迁移: ${result.migrated}`)
    console.log(`已跳过: ${result.skipped}`)
    console.log(`错误: ${result.errors}\n`)

    if (result.migrated > 0) {
      console.log('已迁移的页面:')
      result.details
        .filter(d => d.status === 'migrated')
        .forEach(d => console.log(`  [${d.id}] ${d.name}`))
      console.log()
    }

    if (result.errors > 0) {
      console.log('出错的页面:')
      result.details
        .filter(d => d.status === 'error')
        .forEach(d => console.log(`  [${d.id}] ${d.name}: ${d.message}`))
      console.log()
    }

    if (result.migrated === 0 && result.errors === 0) {
      console.log('没有需要迁移的数据。')
    }
  } finally {
    await connection.end()
  }
}

migrate().catch(error => {
  console.error('迁移失败:', error)
  process.exit(1)
})

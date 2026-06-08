export interface ComponentSchema {
  id: string
  type: string
  props: Record<string, unknown>
  style: Record<string, string>
  events: Array<Record<string, unknown>>
  children: ComponentSchema[]
  slots: Record<string, unknown>
  positionStyle?: Record<string, string>
  cssVariables?: Record<string, string>
  customCSS?: string
  isRemote?: boolean
  remoteConfig?: { id: string; url: string; styleUrl?: string; exportName: string }
  childrenText?: string
}

export interface PageSchema {
  version: string
  components: ComponentSchema[]
  layout: {
    type: string
    config: Record<string, unknown>
  }
  meta: {
    title: string
    description: string
    viewport: Record<string, unknown>
  }
}

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

export function generateUniqueId(prefix?: string): string
export function generateComponentId(): string
export function createComponentSchema(type: string, defaultProps?: Record<string, unknown>): ComponentSchema
export function cloneComponentSchema(schema: ComponentSchema): ComponentSchema
export function validateSchema(schema: unknown): ValidationResult
export function flattenComponents(components: ComponentSchema[]): ComponentSchema[]
export function getComponentTreeDepth(components: ComponentSchema[]): number
export function findComponentPath(components: ComponentSchema[], targetId: string): string[] | null
export function createDefaultPageSchema(): PageSchema
export function exportSchemaToJson(schema: unknown): string
export function importSchemaFromJson(json: string): unknown | null
export function executeFunctionCode(code: string, context?: Record<string, unknown>): Promise<unknown> | null
export function executeFunctionCodeSync(code: string, context?: Record<string, unknown>): unknown
export function resolveValue(
  value: unknown,
  getVariableValue?: (name: string) => unknown,
  getVariableType?: (name: string) => string | undefined,
  context?: Record<string, unknown>,
  defaultValue?: unknown
): unknown
export function resolveComponentId(
  componentIdOrAlias: string | null | undefined,
  getComponentIdByAlias?: (alias: string) => string | null
): string | null
export function isAliasFormat(value: unknown): boolean
export function extractAlias(value: string): string | null

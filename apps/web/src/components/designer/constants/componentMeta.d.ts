export interface PropOption {
  label: string
  value: string | number | boolean
}

export interface PropDefinition {
  name: string
  label: string
  type: string
  default?: unknown
  options?: PropOption[]
  description?: string | { text: string; link?: string }
}

export interface SlotDefinition {
  name: string
  label: string
}

export interface EventDefinition {
  name: string
  label: string
  description?: string
}

export interface RemoteConfig {
  id: string
  url: string
  styleUrl?: string
  exportName: string
}

export interface StyleConfigPart {
  name: string
  label: string
  styles: string[]
}

export interface CssVariableDefinition {
  name: string
  label: string
  type: string
  default?: string
}

export interface StyleConfig {
  parts: StyleConfigPart[]
  cssVariables: CssVariableDefinition[]
  dynamicCssVariables?: Record<string, unknown>
}

export interface ComponentMeta {
  type: string
  name: string
  category: string
  icon: string
  isChildComponent?: boolean
  parentComponents?: string[]
  isRemote?: boolean
  remoteConfig?: RemoteConfig
  props: PropDefinition[]
  events?: EventDefinition[]
  slots: SlotDefinition[]
  styleConfig?: StyleConfig
  childComponents?: string[]
  defaultSlot?: string
}

export interface CategoryItem {
  key: string
  value: string
  label: string
}

export interface CategoryGrouped {
  regular: ComponentMeta[]
  child: ComponentMeta[]
}

export interface ParentGroup {
  parentType: string
  parentName: string
  components: ComponentMeta[]
}

export interface RemoteConfigStorage {
  globalUrl: string
  components: Array<Record<string, unknown>>
}

export const componentMetaList: ComponentMeta[]
export const allComponentMetaList: ComponentMeta[]

export function getComponentsByCategory(category: string): ComponentMeta[]
export function getComponentsByCategoryGrouped(category: string): CategoryGrouped
export function getComponentsByParentGroup(category: string): ParentGroup[]
export function getComponentMeta(type: string): ComponentMeta | null
export function getCategories(): CategoryItem[]
export function getRemoteConfig(): RemoteConfigStorage
export function getRemoteComponents(): Array<Record<string, unknown>>
export function saveRemoteComponents(components: Array<Record<string, unknown>>): void
export function addRemoteComponent(component: Record<string, unknown>): void
export function removeRemoteComponent(id: string): void
export function getRemoteComponentMetaList(): ComponentMeta[]

import { type Reactive } from 'vue'

interface SelectorState {
  visible: boolean
  resolve: ((value: string) => void) | null
  reject: ((reason?: unknown) => void) | null
}

interface EditorOptions {
  title?: string
  value?: string
  language?: string
  extraLibs?: Array<{ content: string; filePath: string }>
  showApiHelp?: boolean
}

interface EditorState {
  visible: boolean
  title: string
  value: string
  language: string
  extraLibs: Array<{ content: string; filePath: string }>
  showApiHelp: boolean
  resolve: ((value: string) => void) | null
  reject: ((reason?: unknown) => void) | null
}

interface ComponentSelectorState {
  visible: boolean
  resolve: ((value: string) => void) | null
  reject: ((reason?: unknown) => void) | null
}

interface VariableManagerState {
  visible: boolean
}

export function useGlobalDialogs(): {
  selectorState: Reactive<SelectorState>
  editorState: Reactive<EditorState>
  componentSelectorState: Reactive<ComponentSelectorState>
  variableManagerState: Reactive<VariableManagerState>
  openVariableSelector: () => Promise<string>
  closeVariableSelector: () => void
  confirmVariableSelection: (variableName: string) => void
  openEditor: (options?: EditorOptions) => Promise<string>
  closeEditor: () => void
  saveEditorContent: (value: string) => void
  cancelEditor: () => void
  openComponentSelector: () => Promise<string>
  closeComponentSelector: () => void
  confirmComponentSelection: (componentId: string) => void
  openVariableManager: () => void
  closeVariableManager: () => void
}

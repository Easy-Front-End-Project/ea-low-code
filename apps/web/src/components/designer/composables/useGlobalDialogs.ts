import { reactive } from 'vue'

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

// 全局变量选择器状态
const selectorState = reactive<SelectorState>({
  visible: false,
  resolve: null,
  reject: null,
})

// 全局编辑器状态
const editorState = reactive<EditorState>({
  visible: false,
  title: '',
  value: '',
  language: 'json',
  extraLibs: [],
  showApiHelp: false,
  resolve: null,
  reject: null,
})

// 全局组件选择器状态
const componentSelectorState = reactive<ComponentSelectorState>({
  visible: false,
  resolve: null,
  reject: null,
})

// 全局变量管理器状态
const variableManagerState = reactive<VariableManagerState>({
  visible: false,
})

/**
 * 全局对话框管理
 * 用于管理 VariableSelector 和 MonacoEditor 弹窗的单例
 */
export function useGlobalDialogs() {
  // 打开变量选择器
  function openVariableSelector(): Promise<string> {
    selectorState.visible = true
    return new Promise((resolve, reject) => {
      selectorState.resolve = resolve
      selectorState.reject = reject
    })
  }

  // 关闭变量选择器
  function closeVariableSelector(): void {
    selectorState.visible = false
    selectorState.resolve = null
    selectorState.reject = null
  }

  // 确认选择变量
  function confirmVariableSelection(variableName: string): void {
    if (selectorState.resolve) {
      selectorState.resolve(variableName)
    }
    closeVariableSelector()
  }

  // 打开编辑器
  function openEditor(options: EditorOptions = {}): Promise<string> {
    editorState.title = options.title || '编辑'
    editorState.value = options.value || ''
    editorState.language = options.language || 'json'
    editorState.extraLibs = options.extraLibs || []
    editorState.showApiHelp = options.showApiHelp || false
    editorState.visible = true

    return new Promise((resolve, reject) => {
      editorState.resolve = resolve
      editorState.reject = reject
    })
  }

  // 关闭编辑器
  function closeEditor(): void {
    editorState.visible = false
    editorState.value = ''
    editorState.extraLibs = []
    editorState.showApiHelp = false
    editorState.resolve = null
    editorState.reject = null
  }

  // 保存编辑器内容
  function saveEditorContent(value: string): void {
    if (editorState.resolve) {
      editorState.resolve(value)
    }
    closeEditor()
  }

  // 取消编辑器
  function cancelEditor(): void {
    if (editorState.reject) {
      editorState.reject(new Error('User cancelled'))
    }
    closeEditor()
  }

  // 打开组件选择器
  function openComponentSelector(): Promise<string> {
    componentSelectorState.visible = true
    return new Promise((resolve, reject) => {
      componentSelectorState.resolve = resolve
      componentSelectorState.reject = reject
    })
  }

  // 关闭组件选择器
  function closeComponentSelector(): void {
    componentSelectorState.visible = false
    componentSelectorState.resolve = null
    componentSelectorState.reject = null
  }

  // 确认选择组件
  function confirmComponentSelection(componentId: string): void {
    if (componentSelectorState.resolve) {
      componentSelectorState.resolve(componentId)
    }
    closeComponentSelector()
  }

  // 打开变量管理器
  function openVariableManager(): void {
    variableManagerState.visible = true
  }

  // 关闭变量管理器
  function closeVariableManager(): void {
    variableManagerState.visible = false
  }

  return {
    // 状态
    selectorState,
    editorState,
    componentSelectorState,
    variableManagerState,
    // 方法
    openVariableSelector,
    closeVariableSelector,
    confirmVariableSelection,
    openEditor,
    closeEditor,
    saveEditorContent,
    cancelEditor,
    openComponentSelector,
    closeComponentSelector,
    confirmComponentSelection,
    openVariableManager,
    closeVariableManager,
  }
}

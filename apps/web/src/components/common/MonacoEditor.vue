<template>
  <div ref="editorContainer" class="monaco-editor-container" :style="{ height: height }"></div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
  import * as monaco from 'monaco-editor'
  import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
  import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
  import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
  import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
  import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

  interface ExtraLib {
    content: string
    filePath: string
  }

  // 配置 Monaco Environment 以加载 Web Workers
  self.MonacoEnvironment = {
    getWorker(_: unknown, label: string) {
      if (label === 'json') {
        return new jsonWorker()
      }
      if (label === 'css' || label === 'scss' || label === 'less') {
        return new cssWorker()
      }
      if (label === 'html' || label === 'handlebars' || label === 'razor') {
        return new htmlWorker()
      }
      if (label === 'typescript' || label === 'javascript') {
        return new tsWorker()
      }
      return new editorWorker()
    },
  }

  const props = withDefaults(defineProps<{
    modelValue?: string
    language?: string
    height?: string
    extraLibs?: ExtraLib[]
    fixedOverflowWidgets?: boolean
  }>(), {
    modelValue: '',
    language: 'javascript',
    height: '200px',
    extraLibs: () => [],
    fixedOverflowWidgets: false,
  })

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
  }>()

  const editorContainer = ref<HTMLElement | null>(null)
  let editor: monaco.editor.IStandaloneCodeEditor | null = null
  let resizeObserver: ResizeObserver | null = null

  onMounted(async () => {
    await nextTick()

    if (!editorContainer.value) {
      console.warn('[MonacoEditor] editorContainer is null, skipping initialization')
      return
    }

    try {
      // 配置 JavaScript 语言服务以启用代码提示
      if (props.language === 'javascript' || props.language === 'typescript') {
        console.log('[MonacoEditor] 配置 JavaScript/TypeScript 语言服务')
        const tsLanguageService = monaco.languages.typescript as any
        tsLanguageService.javascriptDefaults.setCompilerOptions({
          target: tsLanguageService.ScriptTarget.ES2020,
          allowNonTsExtensions: true,
          moduleResolution: tsLanguageService.ModuleResolutionKind.NodeJs,
          module: tsLanguageService.ModuleKind.CommonJS,
          noEmit: true,
          esModuleInterop: true,
          allowJs: true,
          checkJs: false,
          strict: false,
        })

        // 添加自定义类型定义（用于代码提示）
        if (props.extraLibs && props.extraLibs.length > 0) {
          console.log('[MonacoEditor] 添加 extraLibs:', props.extraLibs)
          props.extraLibs.forEach(lib => {
            tsLanguageService.javascriptDefaults.addExtraLib(lib.content, lib.filePath)
          })
        }
      }

      // 创建编辑器实例
      editor = monaco.editor.create(editorContainer.value, {
        value: props.modelValue || '',
        language: props.language,
        theme: 'vs',
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: false,
        fixedOverflowWidgets: props.fixedOverflowWidgets,
        scrollbar: {
          useShadows: false,
          verticalHasArrows: true,
          horizontalHasArrows: true,
          vertical: 'auto',
          horizontal: 'auto',
        },
      })

      // 监听内容变化
      editor.onDidChangeModelContent(() => {
        const value = editor!.getValue()
        emit('update:modelValue', value)
      })

      // 使用 ResizeObserver 监听容器尺寸变化
      resizeObserver = new ResizeObserver(() => {
        if (editor) {
          editor.layout()
        }
      })
      resizeObserver.observe(editorContainer.value)
    } catch (error) {
      console.error('Monaco Editor 初始化失败:', error)
    }
  })

  // 监听外部值变化
  watch(
    () => props.modelValue,
    (newValue: string | undefined) => {
      if (editor && newValue !== undefined && editor.getValue() !== newValue) {
        editor.setValue(newValue)
      }
    }
  )

  onBeforeUnmount(() => {
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }
    if (editor) {
      editor.dispose()
      editor = null
    }
  })
</script>

<style lang="scss" scoped>
  @import '@/styles/mixins/bem.scss';

  @include b(monaco-editor-container) {
    width: 100%;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    overflow: hidden;
  }
</style>

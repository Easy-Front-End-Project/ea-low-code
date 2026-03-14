<template>
  <div ref="editorContainer" class="monaco-editor-container" :style="{ height: height }"></div>
</template>

<script setup>
  import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
  import loader from '@monaco-editor/loader'

  const props = defineProps({
    modelValue: {
      type: String,
      default: '',
    },
    language: {
      type: String,
      default: 'javascript',
    },
    height: {
      type: String,
      default: '200px',
    },
    extraLibs: {
      type: Array,
      default: () => [],
    },
  })

  const emit = defineEmits(['update:modelValue'])

  const editorContainer = ref(null)
  let editor = null
  let resizeObserver = null

  onMounted(async () => {
    await nextTick()

    if (!editorContainer.value) {
      console.warn('[MonacoEditor] editorContainer is null, skipping initialization')
      return
    }

    try {
      // 加载 monaco-editor
      const monaco = await loader.init()

      if (!editorContainer.value) {
        console.warn('[MonacoEditor] editorContainer became null after loader.init(), skipping initialization')
        return
      }

      // 添加自定义类型定义（用于代码提示）
      if (props.extraLibs && props.extraLibs.length > 0) {
        props.extraLibs.forEach((lib) => {
          monaco.languages.typescript.javascriptDefaults.addExtraLib(lib.content, lib.filePath)
        })
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
        const value = editor.getValue()
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
    (newValue) => {
      if (editor && newValue !== undefined && editor.getValue() !== newValue) {
        editor.setValue(newValue)
      }
    },
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

<style scoped>
  .monaco-editor-container {
    width: 100%;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    overflow: hidden;
  }
</style>

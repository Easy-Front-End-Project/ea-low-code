<template>
  <div class="project-settings-view">
    <ea-page-header @back="goBack">
      <span slot="content" class="text-large font-600">项目设置</span>
      <div slot="extra">
        <ea-button type="primary" @click="handleSave">保存设置</ea-button>
      </div>
    </ea-page-header>

    <div class="project-settings-view__container">
      <!-- 主内容区域 - 带加载状态 -->
      <Loading :loading="loading" text="加载项目数据中...">
        <!-- 项目不存在 - 使用 ea-result 提示 -->
        <div v-if="projectNotFound" class="result-state">
          <ea-result
            type="warning"
            title="项目不存在"
            sub-title="该项目可能已被删除或您没有访问权限"
          >
            <div slot="extra">
              <ea-button type="primary" @click="goBack">返回项目列表</ea-button>
            </div>
          </ea-result>
        </div>

        <!-- 其他错误状态 -->
        <div v-else-if="loadError" class="error-state">
          <ea-icon
            name="triangle-exclamation"
            variant="solid"
            size="32"
            class="text-red-500"
          ></ea-icon>
          <p class="text-gray-600 mt-2">{{ loadError }}</p>
          <div class="error-actions mt-4 flex gap-3 justify-center">
            <ea-button type="primary" @click="loadProjectData(route.params.id as string)"> 重试 </ea-button>
            <ea-button @click="goBack"> 返回列表 </ea-button>
          </div>
        </div>

        <!-- 正常内容 -->
        <ea-tabs
          v-else
          :active="activeMenu"
          class="project-settings-view__tabs"
          tab-position="left"
        >
          <ea-tab panel="pages">页面管理</ea-tab>
          <ea-tab-panel name="pages">
            <ea-container class="pages-panel" direction="vertical">
              <ea-header height="auto" class="pages-panel__header">
                <PagesSearchBar
                  v-model:keyword="pagesStore.keyword"
                  @search="handlePagesSearch"
                  @create="showCreatePageDialog = true"
                  @refresh="handlePagesRefresh"
                />
              </ea-header>

              <ea-main class="pages-panel__main">
                <Loading :loading="pagesStore.loading" text="加载中...">
                  <ea-empty
                    v-if="!pagesStore.hasPages && !pagesStore.loading"
                    class="block h-full"
                    description="暂无页面，点击新建按钮创建"
                  >
                    <ea-button type="primary" @click="showCreatePageDialog = true">
                      新建页面
                    </ea-button>
                  </ea-empty>

                  <div v-else class="pages-panel__grid">
                    <PageCard
                      v-for="page in pagesStore.pages"
                      :key="page.id"
                      :page="page"
                      @card-click="handleCardClick"
                      @edit="showEditDialog = true; editingPage = page"
                      @clone="handleClonePage"
                      @delete="handleDeletePage"
                      @preview="handlePreviewPage"
                    />
                  </div>
                </Loading>
              </ea-main>

              <ea-footer
                v-if="pagesStore.hasPages && !pagesStore.loading"
                height="64px"
                class="pages-panel__footer"
              >
                <div class="pages-panel__pagination">
                  <ea-pagination
                    :total="pagesStore.total"
                    :page-size="pagesStore.pageSize"
                    :current-page="pagesStore.currentPage"
                    :layout="['total', 'prev', 'pager', 'next']"
                    @current-change="handlePageChange"
                    @size-change="handlePageSizeChange"
                  />
                </div>
              </ea-footer>
            </ea-container>
          </ea-tab-panel>

          <ea-tab panel="basic">基础信息</ea-tab>
          <ea-tab-panel name="basic">
            <div class="settings-form">
              <div class="form-item">
                <label class="form-label">
                  项目名称
                  <span class="required">*</span>
                </label>
                <EaInput v-model="form.name" placeholder="请输入项目名称" size="default" />
              </div>

              <div class="form-item">
                <label class="form-label">项目描述</label>
                <EaInput
                  v-model="form.description"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入项目描述"
                  size="default"
                />
              </div>
            </div>
          </ea-tab-panel>

          <!-- 创建页面弹窗 -->
          <CreatePageDialog v-model:visible="showCreatePageDialog" :project-id="route.params.id as string" />

          <!-- 编辑页面弹窗 -->
          <EditPageDialog v-model:visible="showEditDialog" :page="editingPage" />
        </ea-tabs>
      </Loading>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { getProjectDetail, updateProject } from '@/api/projects'
  import EaInput from '@/components/ea-ui-wrap/EaInput.vue'
  import Loading from '@/components/common/Loading.vue'
  import PagesSearchBar from '@/components/pages/PagesSearchBar.vue'
  import PageCard from '@/components/pages/PageCard.vue'
  import CreatePageDialog from '@/components/pages/CreatePageDialog.vue'
  import EditPageDialog from '@/components/pages/EditPageDialog.vue'
  import { usePagesStore } from '@/stores/pages'

  const route = useRoute()
  const router = useRouter()
  const pagesStore = usePagesStore()

  const activeMenu = ref('pages')
  const loading = ref(false)
  const saving = ref(false)
  const loadError = ref('')
  const projectNotFound = ref(false)
  const showCreatePageDialog = ref(false)
  const showEditDialog = ref(false)
  const editingPage = ref(null)

  const form = ref({
    name: '',
    description: '',
  })

  function goBack() {
    router.push({ name: 'projects' })
  }

  async function initProject(id: string) {
    await loadProjectData(id)
    if (activeMenu.value === 'pages') {
      await loadPagesData(id)
    }
  }

  onMounted(async () => {
    if (route.params.id) {
      await initProject(route.params.id as string)
      await loadPagesData(route.params.id as string)
    }
  })

  // 监听路由变化（切换项目时），重置页面数据
  watch(
    () => route.params.id,
    async newId => {
      if (newId) {
        pagesStore.reset()
        showCreatePageDialog.value = false
        showEditDialog.value = false
        editingPage.value = null

        await initProject(newId as string)
      }
    }
  )

  watch(activeMenu, async newTab => {
    if (newTab === 'pages' && route.params.id) {
      pagesStore.reset()
      await loadPagesData(route.params.id)
    }
  })

  async function loadProjectData(id: string) {
    loading.value = true
    loadError.value = ''
    projectNotFound.value = false

    try {
      const project = await getProjectDetail(Number(id))
      form.value.name = project.name || ''
      form.value.description = project.description || ''
    } catch (error: any) {
      console.error('加载项目数据失败:', error)
      const status = error?.response?.status
      if (status === 401) {
        loadError.value = '登录已过期，请重新登录'
        projectNotFound.value = false
      } else if (status === 404) {
        // 项目不存在 - 标记但不跳转
        projectNotFound.value = true
        loadError.value = ''
      } else {
        loadError.value = '加载数据失败，请检查网络连接或刷新页面重试'
        projectNotFound.value = false
      }
    } finally {
      loading.value = false
    }
  }

  async function loadPagesData(projectId: string | string[]) {
    const id = Number(projectId)
    if (!id || isNaN(id)) return

    try {
      await pagesStore.fetchPages(id)
    } catch {
      window.$message?.error('加载页面列表失败')
    }
  }

  function handlePagesSearch() {
    pagesStore.setPage(1)
    if (route.params.id) {
      loadPagesData(route.params.id)
    }
  }

  function handlePagesRefresh() {
    if (route.params.id) {
      loadPagesData(route.params.id)
    }
  }

  function handlePageChange(page: number) {
    pagesStore.setPage(page)
    if (route.params.id) {
      loadPagesData(route.params.id)
    }
  }

  function handlePageSizeChange(size: number) {
    pagesStore.setPageSize(size)
    if (route.params.id) {
      loadPagesData(route.params.id)
    }
  }

  function handleCardClick(page: any) {
    router.push({ name: 'designer', params: { id: page.id } })
  }

  async function handleClonePage(page: any) {
    try {
      await pagesStore.clonePage(page.id)
      window.$message?.success(`页面「${page.name || page.id}」复制成功`)
    } catch (error: any) {
      window.$message?.error(error.message || '复制失败')
    }
  }

  async function handleDeletePage(page: any) {
    if (!confirm(`确定要删除页面「${page.name || page.id}」吗？此操作不可恢复。`)) return

    try {
      await pagesStore.removePage(page.id)
      window.$message?.success('页面已删除')
    } catch (error: any) {
      window.$message?.error(error.message || '删除失败')
    }
  }

  function handlePreviewPage(page: any) {
    const url = router.resolve({ name: 'preview', params: { pageId: page.id } }).href
    window.open(url, '_blank')
  }

  async function handleSave() {
    if (!form.value.name.trim()) {
      window.$message?.warning('请输入项目名称')
      return
    }

    saving.value = true
    try {
      await updateProject({
        id: Number(route.params.id),
        name: form.value.name.trim(),
        description: form.value.description,
      })
      window.$message?.success('保存成功')
    } catch (error: any) {
      window.$message?.error(error.message || '保存失败')
    } finally {
      saving.value = false
    }
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/mixins/bem.scss';

  ea-empty::part(container) {
    height: 100%;
  }

  @include b(project-settings-view) {
    height: 100%;
    padding: 1rem;

    @include e(container) {
      margin-top: 1rem;
      height: calc(100% - 80px);
    }

    @include e(tabs) {
      width: 100%;
      height: 100%;

      &::part(content) {
        overflow-y: auto;
      }
    }
  }

  @include b(pages-panel) {
    height: 100%;

    @include e(header) {
      padding: 0;
    }

    @include e(main) {
      padding: 12px 0;
      overflow-y: auto;
    }

    @include e(grid) {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }

    @include e(footer) {
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      border-top: 1px solid var(--ea-border-light);
    }

    @include e(pagination) {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }

  ea-tab-panel[name='pages'] {
    height: 100%;

    &::part(container) {
      height: 100%;
    }
  }

  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 400px;
    gap: 12px;
  }

  .result-state {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
    padding: 2rem;
  }

  .error-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
  }

  .settings-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 640px;
  }

  .form-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .form-label {
    font-size: 0.875rem;
    color: var(--ea-text-regular);
    font-weight: 500;
  }

  .required {
    color: var(--ea-danger);
    margin-left: 4px;
  }

  .placeholder-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
    gap: 16px;
  }
</style>

<template>
  <ea-container class="cloud-view" direction="vertical">
    <!-- 搜索栏 - 固定在 header -->
    <ea-header height="auto" class="cloud-view__header">
      <ImageSearchBar
        v-model:keyword="imagesStore.keyword"
        v-model:group-id="imagesStore.selectedGroupId"
        :group-options="imagesStore.groupOptions"
        @search="handleSearch"
        @upload="showUploadDialog = true"
        @create-group="showCreateGroupDialog = true"
        @refresh="handleRefresh"
      />
    </ea-header>

    <!-- 主内容区域 - 可滚动 -->
    <ea-main class="cloud-view__main">
      <Loading :loading="imagesStore.loading" text="加载中...">
        <!-- 空状态 -->
        <div v-if="!imagesStore.hasImages && !imagesStore.loading" class="cloud-view__empty">
          <div class="cloud-view__empty-content">
            <ea-icon name="image" size="64" color="#c0c4cc"></ea-icon>
            <p>暂无图片，点击上方按钮上传</p>
          </div>
        </div>

        <!-- 图片网格列表 -->
        <div v-else class="cloud-view__grid">
          <ImageCard
            v-for="image in imagesStore.images"
            :key="image.id"
            :image="image"
            :preview-list="allImageUrls"
            @download="handleDownload"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </div>
      </Loading>

      <!-- 上传图片弹窗 -->
      <UploadImageDialog
        v-model:visible="showUploadDialog"
        :group-options="imagesStore.groups"
        @success="handleUploadSuccess"
      />

      <!-- 创建分组弹窗 -->
      <CreateGroupDialog
        v-model:visible="showCreateGroupDialog"
        @success="handleCreateGroupSuccess"
      />

      <!-- 编辑图片弹窗 -->
      <EditImageDialog
        v-model:visible="showEditDialog"
        :image="editingImage"
        :group-options="imagesStore.groups"
        @success="handleEditSuccess"
      />
    </ea-main>

    <!-- 分页 - 固定在 footer -->
    <ea-footer
      v-if="!imagesStore.loading && imagesStore.hasImages"
      height="64px"
      class="cloud-view__footer"
    >
      <div class="cloud-view__pagination">
        <ea-pagination
          :total="imagesStore.total"
          :page-size="imagesStore.pageSize"
          :current-page="imagesStore.currentPage"
          :layout="['total', 'prev', 'pager', 'next']"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </ea-footer>
  </ea-container>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useImagesStore } from '@/stores/images.js'
  import ImageSearchBar from '@/components/images/ImageSearchBar.vue'
  import ImageCard from '@/components/images/ImageCard.vue'
  import UploadImageDialog from '@/components/images/UploadImageDialog.vue'
  import CreateGroupDialog from '@/components/images/CreateGroupDialog.vue'
  import EditImageDialog from '@/components/images/EditImageDialog.vue'
  import Loading from '@/components/common/Loading.vue'

  const imagesStore = useImagesStore()
  const showUploadDialog = ref(false)
  const showCreateGroupDialog = ref(false)
  const showEditDialog = ref(false)
  const editingImage = ref(null)

  const allImageUrls = computed(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
    return imagesStore.images.map(img => `${baseUrl}${img.url}`)
  })

  onMounted(async () => {
    await Promise.all([imagesStore.fetchGroups(), imagesStore.fetchImages()])
  })

  function handleSearch() {
    imagesStore.setPage(1)
    imagesStore.fetchImages()
  }

  function handleRefresh() {
    Promise.all([imagesStore.fetchGroups(), imagesStore.fetchImages()])
  }

  function handlePageChange(page) {
    imagesStore.setPage(page)
    imagesStore.fetchImages()
  }

  function handleSizeChange(size) {
    imagesStore.setPageSize(size)
    imagesStore.fetchImages()
  }

  function handleDownload(image) {
    const link = document.createElement('a')
    link.href = image.url
    link.download = image.filename
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.$message?.success('开始下载')
  }

  function handleEdit(image) {
    editingImage.value = image
    showEditDialog.value = true
  }

  async function handleDelete(image) {
    try {
      await imagesStore.removeImage(image.id)
    } catch (error) {
      window.$message?.error(error.message || '删除失败')
    }
  }

  function handleUploadSuccess() {
    imagesStore.fetchImages()
    imagesStore.fetchGroups()
  }

  function handleCreateGroupSuccess() {
    imagesStore.fetchGroups()
  }

  function handleEditSuccess() {
    imagesStore.fetchImages()
    imagesStore.fetchGroups()
  }
</script>

<style lang="scss" scoped>
  .cloud-view {
    height: 100%;

    &__header {
      padding: 0;
    }

    &__main {
      padding: 12px 0;
      overflow-y: auto;
    }

    &__empty {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;

      &-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;

        p {
          font-size: 14px;
          color: var(--ea-text-secondary);
        }
      }
    }

    &__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
      max-width: 1440px;
      margin: 0 auto;
    }

    &__footer {
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      border-top: 1px solid var(--ea-border-light);
    }

    &__pagination {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
</style>

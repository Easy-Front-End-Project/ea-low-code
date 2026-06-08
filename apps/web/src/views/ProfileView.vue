<template>
  <div class="profile-view">
    <!-- 顶部用户信息卡片 -->
    <div class="profile-header">
      <ea-avatar size="60px">{{ avatarText }}</ea-avatar>
      <div class="profile-header-info">
        <div class="profile-username">
          <span>{{ form.nickname || form.username }}</span>
          <ea-icon name="pen" variant="solid" @click="openNameDialog"></ea-icon>
        </div>
        <div class="profile-email">{{ form.email }}</div>
      </div>
    </div>

    <!-- 基本信息 -->
    <div class="profile-section">
      <h3 class="section-title">基本信息</h3>
      <div class="info-row">
        <div class="info-item">
          <span class="info-label">User ID</span>
          <span class="info-value">{{ form.id }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">注册日期</span>
          <span class="info-value">{{ formatDate(form.createdAt) }}</span>
        </div>
      </div>
    </div>

    <!-- 账号安全 -->
    <div class="profile-section">
      <h3 class="section-title">账号安全</h3>

      <!-- 密码修改 -->
      <div class="security-item">
        <div class="security-info">
          <ea-icon name="lock" size="18" class="security-icon"></ea-icon>
          <div class="security-detail">
            <span class="security-title">密码修改</span>
            <span class="security-desc">********</span>
          </div>
        </div>
        <ea-button size="small" @click="showPasswordDialog = true">修改</ea-button>
      </div>
    </div>

    <!-- 修改昵称弹窗 -->
    <ea-dialog :visible="showNameDialog" title="修改昵称" width="400px" @closed="showNameDialog = false">
      <div class="name-form">
        <div class="form-item">
          <label>昵称</label>
          <ea-input v-model="editName" placeholder="请输入昵称" />
        </div>
      </div>
      <div slot="footer">
        <ea-button class="mr-4" @click="cancelEditName">取消</ea-button>
        <ea-button type="primary" :loading="savingName" @click="saveName">保存</ea-button>
      </div>
    </ea-dialog>

    <!-- 修改密码弹窗 -->
    <ea-dialog :visible="showPasswordDialog" title="密码修改" width="400px" @closed="showPasswordDialog = false">
      <div class="password-form">
        <div class="form-item">
          <label><span class="required">*</span>旧密码</label>
          <ea-input v-model="passwordForm.oldPassword" type="password" placeholder="请输入旧密码" show-password />
        </div>
        <div class="form-item">
          <label><span class="required">*</span>新密码</label>
          <ea-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码" show-password />
        </div>
        <div class="form-item">
          <label><span class="required">*</span>确认密码</label>
          <ea-input v-model="passwordForm.confirmPassword" type="password" placeholder="请确认新密码" show-password />
        </div>
      </div>
      <div slot="footer">
        <ea-button class="mr-4" @click="showPasswordDialog = false">取消</ea-button>
        <ea-button type="primary" :loading="changingPassword" @click="handleChangePassword">提交</ea-button>
      </div>
    </ea-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { changePassword } from '@/api/auth'
import { updateUser } from '@/api/user'

const userStore = useUserStore()

const avatarText = computed(() => {
  const username = userStore.user?.username
  return username?.charAt(0)?.toUpperCase() || 'U'
})

const form = ref({
  id: userStore.user?.id || '',
  username: userStore.user?.username || '',
  email: userStore.user?.email || '',
  nickname: userStore.user?.nickname || '',
  createdAt: userStore.user?.createdAt || '',
})

// 编辑昵称
const showNameDialog = ref(false)
const editName = ref('')
const savingName = ref(false)

function openNameDialog() {
  editName.value = form.value.nickname || ''
  showNameDialog.value = true
}

async function saveName() {
  if (!editName.value.trim()) {
    window.$message?.warning('昵称不能为空')
    return
  }

  savingName.value = true
  try {
    await updateUser({
      id: form.value.id,
      data: { nickname: editName.value.trim() },
    })
    form.value.nickname = editName.value.trim()
    // 更新 store 中的用户信息
    userStore.user = { ...userStore.user, nickname: editName.value.trim() }
    window.$message?.success('昵称修改成功')
    showNameDialog.value = false
  } catch (error: any) {
    window.$message?.error(error.message || '修改失败')
  } finally {
    savingName.value = false
  }
}

function cancelEditName() {
  showNameDialog.value = false
  editName.value = ''
}

// 格式化日期
function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

// 修改密码
const showPasswordDialog = ref(false)
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})
const changingPassword = ref(false)

async function handleChangePassword() {
  if (!passwordForm.value.oldPassword || !passwordForm.value.newPassword || !passwordForm.value.confirmPassword) {
    window.$message?.warning('请填写所有密码字段')
    return
  }
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    window.$message?.warning('两次输入的新密码不一致')
    return
  }
  if (passwordForm.value.newPassword.length < 6) {
    window.$message?.warning('新密码长度不能少于6位')
    return
  }

  changingPassword.value = true
  try {
    await changePassword({
      oldPassword: passwordForm.value.oldPassword,
      newPassword: passwordForm.value.newPassword,
    })
    window.$message?.success('密码修改成功')
    showPasswordDialog.value = false
    passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
  } catch (error: any) {
    window.$message?.error(error.message || '密码修改失败')
  } finally {
    changingPassword.value = false
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixins/bem.scss';

@include b(profile-view) {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

// 顶部用户信息
.profile-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  margin-bottom: 24px;

  ::part(container) {
    background: #fff;
    color: #667eea;
    font-weight: 600;
  }
}

.profile-header-info {
  color: #fff;
}

.profile-username {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 600;

  .name-input {
    width: 150px;
  }
}

.profile-email {
  font-size: 14px;
  opacity: 0.9;
  margin-top: 4px;
}

// 分区样式
.profile-section {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgb(0 0 0 / 5%);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--ea-text-primary);
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--ea-border-light);
}

// 基本信息
.info-row {
  display: flex;
  justify-content: space-between;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 12px;
  color: var(--ea-text-secondary);
}

.info-value {
  font-size: 14px;
  color: var(--ea-text-primary);
}

// 安全设置
.security-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid var(--ea-border-light);

  &:last-child {
    border-bottom: none;
  }

  &.danger {
    .security-title {
      color: var(--ea-danger);
    }
  }
}

.security-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.security-icon {
  color: var(--ea-text-secondary);
}

.security-detail {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.security-title {
  font-size: 14px;
  color: var(--ea-text-primary);
}

.security-desc {
  font-size: 12px;
  color: var(--ea-text-secondary);
}

// 昵称表单
.name-form {
  padding: 16px 0;
}

// 密码表单
.password-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 14px;
    color: var(--ea-text-regular);
  }
}

.required {
  color: var(--ea-danger);
  margin-right: 4px;
}

.mr-4 {
  margin-right: 16px;
}
</style>

export const apiList = {
  // 认证相关接口
  auth: {
    // 用户登录
    login: '/auth/login',
    // 获取当前用户信息
    profile: '/auth/profile',
    // 发送验证码
    sendVerificationCode: '/auth/send-verification-code',
    // 验证验证码
    verifyCode: '/auth/verify-code',
    // 重置密码
    resetPassword: '/auth/reset-password',
    // 修改密码
    changePassword: '/auth/change-password',
  },

  // 用户相关接口
  user: {
    // 创建用户（注册）
    create: '/users/create',
    // 获取用户列表
    list: '/users/list',
    // 获取用户详情
    detail: '/users/detail',
    // 更新用户信息
    update: '/users/update',
    // 删除用户
    delete: '/users/delete',
  },

  // 统计相关接口
  stats: {
    // 仪表盘统计数据
    dashboard: '/stats/dashboard',
    // 最近项目
    recentProjects: '/stats/recent-projects',
    // 最近活动
    activities: '/stats/activities',
  },

  // 远程组件管理接口
  components: {
    // 获取组件列表
    list: '/components/list',
    // 获取组件详情
    detail: '/components/detail',
    // 创建组件
    create: '/components/create',
    // 更新组件
    update: '/components/update',
    // 删除组件
    delete: '/components/delete',
    // 切换启用状态
    toggleEnabled: '/components/toggle-enabled',
    // 获取 URL 预设列表
    presetsList: '/components/presets/list',
    // 创建 URL 预设
    presetsCreate: '/components/presets/create',
    // 更新 URL 预设
    presetsUpdate: '/components/presets/update',
    // 删除 URL 预设
    presetsDelete: '/components/presets/delete',
    // 设置默认 URL 预设
    presetsSetDefault: '/components/presets/set-default',
  },
}

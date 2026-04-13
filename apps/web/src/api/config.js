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
}

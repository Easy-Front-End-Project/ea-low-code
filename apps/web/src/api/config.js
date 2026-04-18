export const apiList = {
  // ==================== 认证模块 ====================
  auth: {
    /** 用户登录 */
    login: '/auth/login',
    /** 获取当前登录用户信息 */
    profile: '/auth/profile',
    /** 发送邮箱/手机验证码 */
    sendVerificationCode: '/auth/send-verification-code',
    /** 验证验证码（用于注册/重置密码） */
    verifyCode: '/auth/verify-code',
    /** 重置密码（通过验证码） */
    resetPassword: '/auth/reset-password',
    /** 修改密码（需要旧密码） */
    changePassword: '/auth/change-password',
  },

  // ==================== 用户模块 ====================
  user: {
    /** 创建新用户（管理员操作） */
    create: '/users/create',
    /** 获取用户列表（分页） */
    list: '/users/list',
    /** 获取用户详情 */
    detail: '/users/detail',
    /** 更新用户信息 */
    update: '/users/update',
    /** 删除用户 */
    delete: '/users/delete',
  },

  // ==================== 统计模块 ====================
  stats: {
    /** 仪表盘统计数据（项目数、组件数、活跃度等） */
    dashboard: '/stats/dashboard',
    /** 最近访问的项目列表 */
    recentProjects: '/stats/recent-projects',
    /** 最近活动日志 */
    activities: '/stats/activities',
  },

  // ==================== 远程组件模块 ====================
  components: {
    /** 获取远程组件列表（支持搜索、筛选） */
    list: '/components/list',
    /** 获取组件详细信息（含配置项） */
    detail: '/components/detail',
    /** 创建新组件 */
    create: '/components/create',
    /** 更新组件信息 */
    update: '/components/update',
    /** 删除组件 */
    delete: '/components/delete',
    /** 切换组件启用/禁用状态 */
    toggleEnabled: '/components/toggle-enabled',

    // --- URL 预设管理 ---
    /** 获取 URL 预设列表 */
    presetsList: '/components/presets/list',
    /** 创建 URL 预设 */
    presetsCreate: '/components/presets/create',
    /** 更新 URL 预设 */
    presetsUpdate: '/components/presets/update',
    /** 删除 URL 预设 */
    presetsDelete: '/components/presets/delete',
    /** 设置默认 URL 预设 */
    presetsSetDefault: '/components/presets/set-default',
  },

  // ==================== 项目管理模块 ====================
  projects: {
    /** 获取项目列表（分页、关键词搜索） */
    list: '/pages/list',
    /** 获取项目基本信息 */
    detail: '/pages/detail',
    /** 获取项目下的所有页面列表 */
    projectPages: '/pages/project-pages',
    /** 获取页面详细信息（含 schema 数据） */
    pageDetail: '/pages/page-detail',
    /** 创建项目 */
    create: '/pages/create',
    /** 在项目中创建页面 */
    pageCreate: '/pages/page-create',
    /** 更新项目信息 */
    update: '/pages/update',
    /** 更新页面内容（schema） */
    pageUpdate: '/pages/page-update',
    /** 删除项目及其所有页面 */
    delete: '/pages/delete',
    /** 克隆/复制项目 */
    clone: '/pages/clone',
    /** 删除单个页面 */
    pageDelete: '/pages/page-delete',
    /** 克隆/复制页面 */
    pageClone: '/pages/page-clone',
    /** 导入项目（JSON 文件或数据） */
    import: '/pages/import',
    /** 导出项目（返回 JSON 数据） */
    export: '/pages/export',
  },

  // ==================== 图片云管理模块 ====================
  images: {
    // --- 分组管理 ---
    /** 获取所有图片分组列表 */
    groupsList: '/images/groups/list',
    /** 创建新的图片分组 */
    groupsCreate: '/images/groups/create',
    /** 删除图片分组（需确保分组下无图片） */
    groupsDelete: '/images/groups/delete',

    // --- 图片管理 ---
    /** 获取图片列表（支持分页、分组筛选、关键词搜索） */
    list: '/images/list',
    /** 获取图片详细信息 */
    detail: '/images/detail',
    /** 上传图片（FormData，支持自定义名称和分组） */
    upload: '/images/upload',
    /** 删除图片（同步删除物理文件） */
    delete: '/images/delete',
    /** 更新图片信息（名称、分组、描述） */
    update: '/images/update',
  },

  // ==================== 动态建模模块 ====================
  models: {
    // --- 模型管理 ---
    /** 获取所有模型列表（支持关键词搜索） */
    list: '/models/list',
    /** 获取模型详情（含字段列表） */
    detail: '/models/detail',
    /** 创建数据模型（同时创建物理表） */
    create: '/models/create',
    /** 更新模型信息（描述等） */
    update: '/models/update',
    /** 删除模型（同时删除物理表和字段记录） */
    delete: '/models/delete',

    // --- 字段管理 ---
    /** 获取模型的字段列表（分页） */
    fieldsList: '/models/fields/list',
    /** 新增模型字段（同步添加物理列） */
    fieldsCreate: '/models/fields/create',
    /** 更新模型字段定义（同步修改物理列） */
    fieldsUpdate: '/models/fields/update',
    /** 删除模型字段（同步删除物理列） */
    fieldsDelete: '/models/fields/delete',
    /** 批量更新字段排序序号 */
    fieldsSort: '/models/fields/sort',
  },
}

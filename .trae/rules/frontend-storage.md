# 前端存储规范

## localStorage Key 命名规范

**必须使用小写+下划线命名风格**，采用企业级命名规范：

```javascript
// ✅ 正确 - 企业级命名
const STORAGE_KEYS = {
  TOKEN: 'ea_platform_session_token',
  USER: 'ea_platform_user_profile',
  SETTINGS: 'ea_platform_user_settings',
}

// ❌ 错误
const STORAGE_KEYS = {
  TOKEN: 'access_token', // 太直接，容易被识别
  TOKEN: 'tk', // 过于简短，无意义
  TOKEN: 'EAPlatformToken', // 驼峰式，不符合规范
}
```

### 命名规则

1. **格式**：`{项目标识}_{模块}_{具体含义}`
2. **项目标识**：如 `ea_platform`、`ea_lc`
3. **模块**：如 `session`、`user`、`config`
4. **具体含义**：如 `token`、`profile`、`settings`

### 封装要求

所有 localStorage 操作必须封装在 `utils/storage.js` 中：

```javascript
// utils/storage.js
const STORAGE_KEYS = {
  TOKEN: 'ea_platform_session_token',
  USER: 'ea_platform_user_profile',
}

export function getToken() {
  return localStorage.getItem(STORAGE_KEYS.TOKEN)
}

export function setToken(token) {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token)
}

export function removeToken() {
  localStorage.removeItem(STORAGE_KEYS.TOKEN)
}
```

禁止在业务代码中直接调用 `localStorage.getItem/setItem`。

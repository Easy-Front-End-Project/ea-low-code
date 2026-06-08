/** @type {import('stylelint').Config} */
export default {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-vue/scss',
  ],
  rules: {
    // BEM 命名规则：类名必须为 kebab-case，允许 BEM 格式（block__element--modifier）
    'selector-class-pattern': [
      '^[a-z]([a-z0-9-]+)?(__[a-z0-9-]+)?(--[a-z0-9-]+)?$',
      {
        message: (selector) =>
          `类名 "${selector}" 不符合 BEM 命名规范。应使用 kebab-case 格式：block__element--modifier`,
      },
    ],

    // 允许 :deep() 和 ::v-deep 伪元素
    'selector-pseudo-element-no-unknown': null,

    // 允许 :deep() 和 :global() 伪类
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['deep', 'global'],
      },
    ],

    // SCSS 规则
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['include', 'mixin', 'use', 'forward'],
      },
    ],

    // 允许 SCSS @import 带 .scss 扩展名（项目使用 @import 引入 bem mixin）
    'scss/load-partial-extension': null,

    // 允许 SCSS @import 不带下划线前缀（规则已在 stylelint-scss v7 中移除，此处保留以兼容旧版）
    // 'scss/at-import-no-partial-leading-underscore': null,

    // 允许 BEM mixin 中 @at-root 生成的选择器
    'selector-max-compound-selectors': 4,

    // 允许 ea-* 自定义元素选择器（包括 :deep(ea-*) 简写形式）
    'selector-type-no-unknown': null,

    // 关闭与 prettier 冲突的规则
    'declaration-block-single-line-max-declarations': null,
    'no-descending-specificity': null,
    'selector-max-specificity': null,
    'no-empty-source': null,
    'no-invalid-position-declaration': null,
  },
}

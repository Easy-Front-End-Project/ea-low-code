import * as Vue from "vue";

/**
 * 加载远程 UMD 组件
 * @param {string} url - 远程组件 URL
 * @param {string} [exportName] - 导出的组件名，默认自动检测
 */
export async function loadRemoteComponent(url, exportName) {
  const script = await fetch(url).then((r) => r.text());
  const module = { exports: {} };

  new Function("module", "exports", "require", script)(
    module,
    module.exports,
    (id) => (id === "vue" ? Vue : null),
  );

  const exports = module.exports;

  // 如果指定了导出名，直接取
  if (exportName) {
    return exports[exportName];
  }

  // 自动检测：优先 default，其次第一个组件属性
  return (
    exports.default ||
    exports.EaRemoteComponent ||
    Object.values(exports).find((v) => v?.render || v?.setup) ||
    exports
  );
}

/**
 * 创建异步组件加载器（用于 defineAsyncComponent）
 */
export const createRemoteComponent = (url, exportName) => () =>
  loadRemoteComponent(url, exportName);

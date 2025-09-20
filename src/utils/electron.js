// src/utils/electron.js
// Electron 环境检测和特定功能工具

/**
 * 检测是否在 Electron 环境中运行
 * @returns {boolean} 是否在 Electron 环境中
 */
export function isElectron() {
  // 渲染进程中检测 Electron 环境
  if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') {
    return true;
  }

  // 主进程中检测 Electron 环境
  if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
    return true;
  }

  return false;
}

/**
 * 获取 Electron API（如果在 Electron 环境中）
 * @returns {object|null} Electron API 或 null
 */
export function getElectronAPI() {
  if (isElectron() && window.require) {
    try {
      const electron = window.require('electron');
      return electron;
    } catch (error) {
      console.warn('Failed to get Electron API:', error);
    }
  }
  return null;
}

/**
 * 在 Electron 环境中打开外部链接
 * @param {string} url - 要打开的 URL
 */
export function openExternal(url) {
  const electron = getElectronAPI();
  if (electron && electron.shell) {
    electron.shell.openExternal(url);
  } else {
    // 在浏览器环境中使用 window.open
    window.open(url, '_blank');
  }
}

/**
 * 设置窗口标题（Electron 环境）
 * @param {string} title - 新的窗口标题
 */
export function setWindowTitle(title) {
  const electron = getElectronAPI();
  if (electron && electron.remote) {
    const currentWindow = electron.remote.getCurrentWindow();
    if (currentWindow) {
      currentWindow.setTitle(title);
    }
  } else if (document) {
    // 在浏览器环境中更新文档标题
    document.title = title;
  }
}

export default {
  isElectron,
  getElectronAPI,
  openExternal,
  setWindowTitle
};
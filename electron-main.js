import { app, BrowserWindow, protocol } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

// 处理 __dirname 在 ES 模块中的问题
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 禁用安全策略警告
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      // 允许在渲染进程中使用 Electron API
      enableRemoteModule: true,
    }
  });

  // 加载应用
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    // 打开开发者工具
    mainWindow.webContents.openDevTools();
  } else {
    // 生产环境加载本地文件
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

// 处理 Windows 系统中通过单实例运行应用的问题
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    // 当尝试启动第二个实例时，聚焦到第一个实例的窗口
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  // 当 Electron 完成初始化时创建窗口
  app.whenReady().then(() => {
    // 注册自定义协议
    protocol.registerSchemesAsPrivileged([
      { scheme: 'app', privileges: { secure: true, standard: true } }
    ]);
    
    createWindow();

    app.on('activate', () => {
      // 在 macOS 上，当点击 dock 图标且没有其他窗口打开时，通常会重新创建一个窗口
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  // 当所有窗口都关闭时退出应用（Windows & Linux）
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
}
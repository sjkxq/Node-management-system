<template>
  <div v-if="isElectronEnv" class="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4" role="alert">
    <p class="font-bold">Electron 环境</p>
    <p>您正在 Electron 桌面应用中运行此程序</p>
    <div class="mt-2">
      <button @click="minimizeWindow" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2">
        最小化
      </button>
      <button @click="maximizeWindow" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2">
        最大化
      </button>
      <button @click="closeWindow" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
        关闭
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { isElectron, getElectronAPI } from '../utils/electron';

export default {
  name: 'ElectronFeatures',
  setup() {
    const isElectronEnv = ref(isElectron());
    let electron = null;
    let currentWindow = null;

    onMounted(() => {
      if (isElectronEnv.value) {
        electron = getElectronAPI();
        if (electron && electron.remote) {
          currentWindow = electron.remote.getCurrentWindow();
        }
      }
    });

    const minimizeWindow = () => {
      if (currentWindow) {
        currentWindow.minimize();
      }
    };

    const maximizeWindow = () => {
      if (currentWindow) {
        if (currentWindow.isMaximized()) {
          currentWindow.unmaximize();
        } else {
          currentWindow.maximize();
        }
      }
    };

    const closeWindow = () => {
      if (currentWindow) {
        currentWindow.close();
      }
    };

    return {
      isElectronEnv,
      minimizeWindow,
      maximizeWindow,
      closeWindow
    };
  }
};
</script>
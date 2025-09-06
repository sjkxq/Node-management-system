import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 检查是否为单文件构建模式
  const isSingleFile = mode === 'single'
  
  return {
    plugins: [
      vue(),
      // 仅在单文件构建模式下启用插件
      isSingleFile && viteSingleFile()
    ].filter(Boolean),
    server: {
      port: 3000
    },
    build: {
      outDir: 'dist',
      // 单文件构建配置
      ...(isSingleFile && {
        assetsInlineLimit: 100000000,
        cssCodeSplit: false,
        rollupOptions: {
          output: {
            inlineDynamicImports: true,
          },
        },
      })
    }
  }
})
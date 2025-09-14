import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    // 启用jsdom环境
    environment: 'jsdom',
    // 设置全局API
    globals: true,
    // 匹配测试文件
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    // 排除不需要测试的文件
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    // 根目录
    root: './',
    // 启用覆盖率
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{js,ts,vue}', 'tests/**/*.{js,ts,vue}'],
      exclude: [
        'src/main.js',
        '**/node_modules/**',
        '**/dist/**'
      ]
    }
  }
})
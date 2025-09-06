import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // 主题状态：'light' | 'dark' | 'system'
  const theme = ref('system')
  
  // 实际应用的主题：'light' | 'dark'
  const appliedTheme = ref('light')

  // 初始化主题
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      theme.value = savedTheme
    }
    
    updateAppliedTheme()
    applyThemeToDocument()
  }

  // 更新应用的主题
  const updateAppliedTheme = () => {
    if (theme.value === 'system') {
      appliedTheme.value = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    } else {
      appliedTheme.value = theme.value
    }
  }

  // 将主题应用到文档
  const applyThemeToDocument = () => {
    if (appliedTheme.value === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // 设置主题
  const setTheme = (newTheme) => {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
    updateAppliedTheme()
    applyThemeToDocument()
  }

  // 切换主题
  const toggleTheme = () => {
    if (appliedTheme.value === 'light') {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }

  // 监听系统主题变化
  const watchSystemTheme = () => {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (theme.value === 'system') {
        updateAppliedTheme()
        applyThemeToDocument()
      }
    })
  }

  // 初始化时开始监听系统主题变化
  watchSystemTheme()

  return {
    theme,
    appliedTheme,
    initTheme,
    setTheme,
    toggleTheme
  }
})
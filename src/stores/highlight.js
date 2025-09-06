import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useHighlightStore = defineStore('highlight', () => {
  // 高亮颜色设置
  const highlightColors = ref({
    nodeBorder: '#f472b6',  // 粉色
    edgeColor: '#f472b6',   // 粉色
    edgeHighlight: '#f472b6' // 粉色
  })

  // 初始化高亮颜色设置
  const initHighlightColors = () => {
    const savedColors = localStorage.getItem('highlightColors')
    if (savedColors) {
      try {
        highlightColors.value = JSON.parse(savedColors)
      } catch (e) {
        console.warn('Failed to parse highlight colors from localStorage:', e)
      }
    }
  }

  // 设置高亮颜色
  const setHighlightColors = (colors) => {
    highlightColors.value = { ...highlightColors.value, ...colors }
    localStorage.setItem('highlightColors', JSON.stringify(highlightColors.value))
  }

  // 重置为默认颜色
  const resetToDefault = () => {
    highlightColors.value = {
      nodeBorder: '#f472b6',
      edgeColor: '#f472b6',
      edgeHighlight: '#f472b6'
    }
    localStorage.removeItem('highlightColors')
  }

  return {
    highlightColors,
    initHighlightColors,
    setHighlightColors,
    resetToDefault
  }
})
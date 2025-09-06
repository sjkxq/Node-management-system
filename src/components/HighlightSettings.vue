<template>
  <div class="highlight-settings p-4">
    <div class="mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-4">高亮颜色设置</h2>
          <p class="text-gray-600 dark:text-gray-400">自定义节点和关系高亮时的颜色</p>
        </div>
        <button
          @click="exitSettings"
          class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <i class="fas fa-arrow-left mr-2"></i>
          返回
        </button>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 mb-6">
      <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">颜色设置</h3>
      
      <div class="space-y-6">
        <!-- 节点边框颜色 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            节点高亮边框颜色
          </label>
          <div class="flex items-center space-x-4">
            <input
              v-model="form.nodeBorder"
              type="color"
              class="w-12 h-12 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer"
            />
            <div class="flex-1">
              <input
                v-model="form.nodeBorder"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-600 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#RRGGBB"
              />
            </div>
          </div>
        </div>

        <!-- 边颜色 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            关系高亮颜色
          </label>
          <div class="flex items-center space-x-4">
            <input
              v-model="form.edgeColor"
              type="color"
              class="w-12 h-12 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer"
            />
            <div class="flex-1">
              <input
                v-model="form.edgeColor"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-600 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#RRGGBB"
              />
            </div>
          </div>
        </div>

        <!-- 边高亮颜色 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            关系高亮边框颜色
          </label>
          <div class="flex items-center space-x-4">
            <input
              v-model="form.edgeHighlight"
              type="color"
              class="w-12 h-12 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer"
            />
            <div class="flex-1">
              <input
                v-model="form.edgeHighlight"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-600 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#RRGGBB"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-3 mt-6">
        <button
          @click="resetToDefault"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:text-white rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          重置默认
        </button>
        <button
          @click="saveSettings"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          保存设置
        </button>
      </div>
    </div>

    <div class="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
      <h4 class="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
        <i class="fas fa-info-circle mr-2"></i>使用说明
      </h4>
      <p class="text-sm text-blue-700 dark:text-blue-300">
        1. 点击颜色选择器可以选择预定义颜色<br>
        2. 在文本框中可以直接输入十六进制颜色值<br>
        3. 设置会自动保存并在下次访问时生效<br>
        4. 点击"重置默认"可以恢复到系统默认颜色
      </p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useHighlightStore } from '../stores/highlight'

export default {
  name: 'HighlightSettings',
  emits: ['exit'],
  setup(props, { emit }) {
    const highlightStore = useHighlightStore()
    
    // 表单数据
    const form = ref({
      nodeBorder: '#f472b6',
      edgeColor: '#f472b6',
      edgeHighlight: '#f472b6'
    })

    // 初始化表单数据
    onMounted(() => {
      form.value = { ...highlightStore.highlightColors }
    })

    // 保存设置
    const saveSettings = () => {
      highlightStore.setHighlightColors(form.value)
      alert('高亮颜色设置已保存！')
    }

    // 重置为默认
    const resetToDefault = () => {
      highlightStore.resetToDefault()
      form.value = { ...highlightStore.highlightColors }
      alert('已恢复默认颜色设置！')
    }

    // 退出设置
    const exitSettings = () => {
      emit('exit')
    }

    return {
      form,
      saveSettings,
      resetToDefault,
      exitSettings
    }
  }
}
</script>

<style scoped>
input[type="color"] {
  -webkit-appearance: none;
  border: none;
  width: 48px;
  height: 48px;
  cursor: pointer;
}

input[type="color"]::-webkit-color-swatch {
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
}

.dark input[type="color"]::-webkit-color-swatch {
  border: 1px solid #4b5563;
}
</style>
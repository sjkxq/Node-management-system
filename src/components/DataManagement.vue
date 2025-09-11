<template>
  <div class="data-management p-4 h-full flex flex-col">
    <div class="mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-xl font-bold text-gray-800 mb-4">数据管理</h2>
          <p class="text-gray-600">管理数据的导入和导出</p>
        </div>
        <button
          @click="exitDataManagement"
          class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <i class="fas fa-arrow-left mr-2"></i>
          返回
        </button>
      </div>
    </div>
    
    <!-- 标签页 -->
    <div class="mb-6 border-b border-gray-200">
      <nav class="flex space-x-8">
        <button
          @click="activeTab = 'export'"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm',
            activeTab === 'export' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          数据导出
        </button>
        <button
          @click="activeTab = 'import'"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm',
            activeTab === 'import' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          数据导入
        </button>
      </nav>
    </div>
    
    <!-- 数据导出标签页 -->
    <div v-show="activeTab === 'export'" class="flex-1 overflow-auto">
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 class="text-lg font-semibold text-gray-700 mb-4">导出数据</h3>
        
        <div class="space-y-4">
          <div class="p-4 border border-gray-200 rounded-lg">
            <h4 class="font-medium text-gray-800 mb-2">完整数据导出</h4>
            <p class="text-sm text-gray-600 mb-3">导出所有节点、关系、类型和标签数据</p>
            <button
              @click="exportAllData"
              class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
            >
              <i class="fas fa-file-export mr-2"></i>
              导出完整数据
            </button>
          </div>
          
          <div class="p-4 border border-gray-200 rounded-lg">
            <h4 class="font-medium text-gray-800 mb-2">节点数据导出</h4>
            <p class="text-sm text-gray-600 mb-3">仅导出节点和关系数据</p>
            <button
              @click="exportNodesData"
              class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
            >
              <i class="fas fa-file-export mr-2"></i>
              导出节点数据
            </button>
          </div>
          
          <div class="p-4 border border-gray-200 rounded-lg">
            <h4 class="font-medium text-gray-800 mb-2">类型和标签导出</h4>
            <p class="text-sm text-gray-600 mb-3">仅导出节点类型、关系类型和标签定义</p>
            <button
              @click="exportTypesAndTagsData"
              class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md flex items-center"
            >
              <i class="fas fa-file-export mr-2"></i>
              导出类型和标签
            </button>
          </div>
        </div>
      </div>
      
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 class="text-sm font-semibold text-blue-800 mb-2">
          <i class="fas fa-info-circle mr-2"></i>导出说明
        </h4>
        <p class="text-sm text-blue-700">
          1. 数据将以JSON格式导出<br>
          2. 文件名将包含导出时间戳<br>
          3. 导出的文件可用于备份或在其他系统中导入<br>
          4. 完整数据导出包含所有系统信息
        </p>
      </div>
    </div>
    
    <!-- 数据导入标签页 -->
    <div v-show="activeTab === 'import'" class="flex-1 overflow-auto">
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 class="text-lg font-semibold text-gray-700 mb-4">导入数据</h3>
        
        <div class="space-y-4">
          <div class="p-4 border border-gray-200 rounded-lg">
            <h4 class="font-medium text-gray-800 mb-2">完整数据导入</h4>
            <p class="text-sm text-gray-600 mb-3">导入完整的节点、关系、类型和标签数据</p>
            <label 
              class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center cursor-pointer w-fit"
            >
              <i class="fas fa-file-import mr-2"></i>
              选择完整数据文件
              <input 
                type="file" 
                accept=".json" 
                @change="importAllData" 
                class="hidden"
              />
            </label>
          </div>
          
          <div class="p-4 border border-gray-200 rounded-lg">
            <h4 class="font-medium text-gray-800 mb-2">节点数据导入</h4>
            <p class="text-sm text-gray-600 mb-3">仅导入节点和关系数据</p>
            <label 
              class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center cursor-pointer w-fit"
            >
              <i class="fas fa-file-import mr-2"></i>
              选择节点数据文件
              <input 
                type="file" 
                accept=".json" 
                @change="importNodesData" 
                class="hidden"
              />
            </label>
          </div>
          
          <div class="p-4 border border-gray-200 rounded-lg">
            <h4 class="font-medium text-gray-800 mb-2">类型和标签导入</h4>
            <p class="text-sm text-gray-600 mb-3">仅导入节点类型、关系类型和标签定义</p>
            <label 
              class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md flex items-center cursor-pointer w-fit"
            >
              <i class="fas fa-file-import mr-2"></i>
              选择类型和标签文件
              <input 
                type="file" 
                accept=".json" 
                @change="importTypesAndTagsData" 
                class="hidden"
              />
            </label>
          </div>
        </div>
      </div>
      
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 class="text-sm font-semibold text-yellow-800 mb-2">
          <i class="fas fa-exclamation-triangle mr-2"></i>导入警告
        </h4>
        <p class="text-sm text-yellow-700">
          1. 导入数据将覆盖现有同名数据<br>
          2. 建议在导入前先备份当前数据<br>
          3. 确保导入的文件格式正确<br>
          4. 不兼容的文件可能导致数据错误
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, inject } from 'vue'
import { useNodeStore } from '../stores/nodes'

export default {
  name: 'DataManagement',
  setup() {
    const nodeStore = useNodeStore()
    const closeDataManagement = inject('closeDataManagement')
    
    // 标签页状态
    const activeTab = ref('export')
    
    // 导出数据方法
    const exportAllData = () => {
      const data = nodeStore.exportData()
      downloadFile(data, 'all-data')
    }
    
    const exportNodesData = () => {
      const data = nodeStore.exportNodesData()
      downloadFile(data, 'nodes-data')
    }
    
    const exportTypesAndTagsData = () => {
      const data = nodeStore.exportTypesAndTagsData()
      downloadFile(data, 'types-tags-data')
    }
    
    // 导入数据方法
    const importAllData = (event) => {
      handleFileImport(event, 'all')
    }
    
    const importNodesData = (event) => {
      handleFileImport(event, 'nodes')
    }
    
    const importTypesAndTagsData = (event) => {
      handleFileImport(event, 'types-tags')
    }
    
    // 通用文件下载方法
    const downloadFile = (data, prefix) => {
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      
      // 创建包含时间戳的文件名
      const now = new Date()
      const timestamp = now.getFullYear() + 
        String(now.getMonth() + 1).padStart(2, '0') + 
        String(now.getDate()).padStart(2, '0') + '-' +
        String(now.getHours()).padStart(2, '0') + 
        String(now.getMinutes()).padStart(2, '0') + 
        String(now.getSeconds()).padStart(2, '0')
      
      const filename = `node-management-${prefix}-${timestamp}.json`
      
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
    
    // 通用文件导入处理方法
    const handleFileImport = (event, type) => {
      const file = event.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          let result
          
          switch (type) {
            case 'all':
              result = nodeStore.importData(e.target.result)
              break
            case 'nodes':
              result = nodeStore.importNodesData(data)
              break
            case 'types-tags':
              result = nodeStore.importTypesAndTagsData(data)
              break
          }
          
          if (result.success) {
            alert('数据导入成功！')
          } else {
            alert('数据导入失败：' + result.error)
          }
        } catch (error) {
          alert('文件格式错误：' + error.message)
        }
        
        // 清空input值，以便可以重复导入相同文件
        event.target.value = ''
      }
      reader.readAsText(file)
    }
    
    // 退出数据管理界面
    const exitDataManagement = () => {
      if (closeDataManagement) {
        closeDataManagement()
      }
    }
    
    return {
      activeTab,
      exportAllData,
      exportNodesData,
      exportTypesAndTagsData,
      importAllData,
      importNodesData,
      importTypesAndTagsData,
      exitDataManagement
    }
  }
}
</script>
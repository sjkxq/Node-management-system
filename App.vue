<template>
  <div id="app" class="flex flex-col h-screen">
    <header class="bg-blue-600 text-white p-2 sm:p-4 shadow-md">
      <div class="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        <h1 class="text-xl sm:text-2xl font-bold">节点管理系统</h1>
        <div class="flex flex-wrap justify-center gap-1 sm:gap-2">
          <button 
            @click="toggleTheme"
            class="bg-gray-700 hover:bg-gray-800 text-white px-2 py-1 sm:px-3 sm:py-2 rounded-md flex items-center text-sm sm:text-base"
            v-if="!showTypeManager && !showTagManager && !showHierarchyManager && !showHighlightSettings"
          >
            <i :class="[
              'fas',
              appliedTheme === 'dark' ? 'fa-sun' : 'fa-moon',
              'mr-1 sm:mr-2 text-xs sm:text-base'
            ]"></i>
            <span>{{ appliedTheme === 'dark' ? '日间模式' : '夜间模式' }}</span>
          </button>
          
          <button 
            @click="openHighlightSettings"
            class="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 sm:px-3 sm:py-2 rounded-md flex items-center text-sm sm:text-base"
            v-if="!showTypeManager && !showTagManager && !showHierarchyManager && !showHighlightSettings"
          >
            <i class="fas fa-palette mr-1 sm:mr-2 text-xs sm:text-base"></i>
            <span>高亮设置</span>
          </button>
          
          <button 
            @click="openNodeModal" 
            class="bg-green-500 hover:bg-green-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-md flex items-center text-sm sm:text-base"
            v-if="!showTypeManager && !showTagManager && !showHierarchyManager && !showHighlightSettings"
          >
            <i class="fas fa-plus mr-1 sm:mr-2 text-xs sm:text-base"></i>
            <span>添加节点</span>
          </button>
          <button 
            @click="openLinkModal"
            class="bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-md flex items-center text-sm sm:text-base"
            v-if="!showTypeManager && !showTagManager && !showHierarchyManager && !showHighlightSettings"
          >
            <i class="fas fa-link mr-1 sm:mr-2 text-xs sm:text-base"></i>
            <span>添加关系</span>
          </button>
          <button 
            @click="exportData"
            class="bg-cyan-500 hover:bg-cyan-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-md flex items-center text-sm sm:text-base"
            v-if="!showTypeManager && !showTagManager && !showHierarchyManager && !showHighlightSettings"
          >
            <i class="fas fa-file-export mr-1 sm:mr-2 text-xs sm:text-base"></i>
            <span>导出数据</span>
          </button>
          <label 
            class="bg-amber-500 hover:bg-amber-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-md flex items-center cursor-pointer text-sm sm:text-base"
            v-if="!showTypeManager && !showTagManager && !showHierarchyManager && !showHighlightSettings"
          >
            <i class="fas fa-file-import mr-1 sm:mr-2 text-xs sm:text-base"></i>
            <span>导入数据</span>
            <input 
              type="file" 
              accept=".json" 
              @change="importData" 
              class="hidden"
            />
          </label>
          <button 
            @click="openTypeManager"
            class="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-md flex items-center text-sm sm:text-base"
            v-if="!showTypeManager && !showTagManager && !showHierarchyManager && !showHighlightSettings"
          >
            <i class="fas fa-cog mr-1 sm:mr-2 text-xs sm:text-base"></i>
            <span>类型管理</span>
          </button>
          <button 
            @click="openTagManager"
            class="bg-indigo-500 hover:bg-indigo-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-md flex items-center text-sm sm:text-base"
            v-if="!showTypeManager && !showTagManager && !showHierarchyManager && !showHighlightSettings"
          >
            <i class="fas fa-tags mr-1 sm:mr-2 text-xs sm:text-base"></i>
            <span>标签管理</span>
          </button>
          <button 
            @click="openHierarchyManager"
            class="bg-teal-500 hover:bg-teal-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-md flex items-center text-sm sm:text-base"
            v-if="!showTypeManager && !showTagManager && !showHierarchyManager && !showHighlightSettings"
          >
            <i class="fas fa-sitemap mr-1 sm:mr-2 text-xs sm:text-base"></i>
            <span>层次结构</span>
          </button>
        </div>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
      <!-- 侧边栏 -->
      <aside class="hidden md:block w-64 bg-gray-100 border-r border-gray-300 flex flex-col" v-if="!showTypeManager && !showTagManager && !showHierarchyManager && !showHighlightSettings">
        <div class="p-3 sm:p-4 border-b border-gray-300">
          <h2 class="text-base sm:text-lg font-semibold mb-2">节点列表</h2>
          <NodeList @node-selected="handleNodeSelected" />
        </div>
        
        <div class="p-3 sm:p-4 flex-1">
          <h2 class="text-base sm:text-lg font-semibold mb-2">操作面板</h2>
          <div class="space-y-2">
            <button 
              @click="resetView" 
              class="w-full bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 sm:py-2 sm:px-4 rounded-md text-sm sm:text-base"
            >
              重置视图
            </button>
            <button 
              @click="toggleFullScreen" 
              class="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-1 px-2 sm:py-2 sm:px-4 rounded-md text-sm sm:text-base"
            >
              {{ isFullScreen ? '退出全屏' : '全屏显示' }}
            </button>
          </div>
        </div>
      </aside>

      <!-- 主内容区 -->
      <main class="flex-1 flex flex-col">
        <!-- 搜索和过滤组件 -->
        <SearchFilter 
          v-if="!showTypeManager && !showTagManager && !showHierarchyManager && !showHighlightSettings"
          @filter-change="handleFilterChange"
        />
        
        <NetworkGraph 
          ref="networkGraph" 
          class="flex-1" 
          @node-selected="handleNodeSelected"
          @link-selected="handleLinkSelected"
          v-show="!showTypeManager && !showTagManager && !showHierarchyManager && !showHighlightSettings"
        />
        
        <!-- 类型管理界面 -->
        <TypeManager v-if="showTypeManager" class="flex-1 overflow-auto" />
        
        <!-- 标签管理界面 -->
        <TagManager v-if="showTagManager" class="flex-1 overflow-auto" />
        
        <!-- 层次结构管理界面 -->
        <HierarchyManager v-if="showHierarchyManager" class="flex-1 overflow-auto" />
        
        <!-- 高亮颜色设置界面 -->
        <HighlightSettings 
          v-if="showHighlightSettings" 
          class="flex-1 overflow-auto" 
          @exit="closeHighlightSettings"
        />
      </main>
    </div>

    <!-- 节点模态框 -->
    <NodeModal />
    
    <!-- 关系模态框 -->
    <LinkModal />
  </div>
</template>

<script>
import { ref, computed, provide } from 'vue'
import NetworkGraph from './src/components/NetworkGraph.vue'
import NodeList from './src/components/NodeList.vue'
import NodeModal from './src/components/NodeModal.vue'
import LinkModal from './src/components/LinkModal.vue'
import TypeManager from './src/components/TypeManager.vue'
import TagManager from './src/components/TagManager.vue'
import HierarchyManager from './src/components/HierarchyManager.vue'
import SearchFilter from './src/components/SearchFilter.vue'
import HighlightSettings from './src/components/HighlightSettings.vue'
import { useNodeStore } from './src/stores/nodes'
import { useThemeStore } from './src/stores/theme'

export default {
  name: 'App',
  components: {
    NetworkGraph,
    NodeList,
    NodeModal,
    LinkModal,
    TypeManager,
    TagManager,
    HierarchyManager,
    SearchFilter,
    HighlightSettings
  },
  setup() {
    const networkGraph = ref(null)
    const nodeStore = useNodeStore()
    const isFullScreen = ref(false)
    const selectedNode = ref(null)
    const showTypeManager = ref(false)
    const showTagManager = ref(false)
    const showHierarchyManager = ref(false)
    const showHighlightSettings = ref(false)

    const openNodeModal = () => {
      nodeStore.openNodeModal()
    }

    const openLinkModal = () => {
      nodeStore.openLinkModal()
    }

    const resetView = () => {
      if (networkGraph.value) {
        networkGraph.value.resetView()
      }
    }

    const toggleFullScreen = () => {
      isFullScreen.value = !isFullScreen.value
      // 全屏切换逻辑可以在这里添加
    }
    
    const handleNodeSelected = (node) => {
      selectedNode.value = node
      if (networkGraph.value) {
        if (node) {
          // 高亮显示选中的节点及其关系
          networkGraph.value.highlightNode(node.id)
        } else {
          // 重置高亮显示
          networkGraph.value.resetHighlight()
        }
      }
    }
    
    const handleLinkSelected = (link) => {
      // 当选中关系时，可以在这里处理逻辑
      // 例如，可以打开编辑模态框
      if (link) {
        nodeStore.openLinkModal(link)
      }
    }
    
    const handleFilterChange = () => {
      // 当过滤条件改变时，重置高亮显示
      if (networkGraph.value) {
        networkGraph.value.resetHighlight()
      }
    }
    
    const openTypeManager = () => {
      showTypeManager.value = true
    }
    
    const closeTypeManager = () => {
      showTypeManager.value = false
    }
    
    const openTagManager = () => {
      showTagManager.value = true
    }
    
    const closeTagManager = () => {
      showTagManager.value = false
    }
    
    const openHierarchyManager = () => {
      showHierarchyManager.value = true
    }
    
    const closeHierarchyManager = () => {
      showHierarchyManager.value = false
    }
    
    // 提供关闭各种管理界面的方法给子组件
    provide('closeTypeManager', closeTypeManager)
    provide('closeTagManager', closeTagManager)
    provide('closeHierarchyManager', closeHierarchyManager)

    const exportData = () => {
      const data = nodeStore.exportData()
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
      
      const filename = `node-management-data-${timestamp}.json`
      
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }

    const importData = (event) => {
      const file = event.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = nodeStore.importData(e.target.result)
        if (result.success) {
          alert('数据导入成功！')
        } else {
          alert('数据导入失败：' + result.error)
        }
        // 清空input值，以便可以重复导入相同文件
        event.target.value = ''
      }
      reader.readAsText(file)
    }

    const openHighlightSettings = () => {
      showHighlightSettings.value = true
    }
    
    const closeHighlightSettings = () => {
      showHighlightSettings.value = false
    }

    return {
      networkGraph,
      isFullScreen,
      showTypeManager,
      showTagManager,
      showHierarchyManager,
      showHighlightSettings,
      selectedNode,
      openNodeModal,
      openLinkModal,
      resetView,
      toggleFullScreen,
      handleNodeSelected,
      handleLinkSelected,
      handleFilterChange,
      openTypeManager,
      closeTypeManager,
      openTagManager,
      closeTagManager,
      openHierarchyManager,
      closeHierarchyManager,
      exportData,
      importData,
      openHighlightSettings,
      closeHighlightSettings
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
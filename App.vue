<template>
  <div id="app" class="flex flex-col h-screen">
    <ElectronFeatures />
    <header class="bg-blue-600 text-white p-2 sm:p-4 shadow-md">
      <div class="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        <h1 class="text-xl sm:text-2xl font-bold">节点管理系统</h1>
        <div class="flex flex-wrap justify-center gap-1 sm:gap-2">
          <button 
            @click="toggleTheme"
            class="bg-gray-700 hover:bg-gray-800 text-white px-2 py-1 sm:px-3 sm:py-2 rounded-md flex items-center text-sm sm:text-base"
            v-if="!showSettings && !showHierarchyManager && !showDataManagement"
          >
            <i :class="[
              'fas',
              appliedTheme === 'dark' ? 'fa-sun' : 'fa-moon',
              'mr-1 sm:mr-2 text-xs sm:text-base'
            ]"></i>
            <span>{{ appliedTheme === 'dark' ? '日间模式' : '夜间模式' }}</span>
          </button>
          
          <button 
            @click="openSettings"
            class="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 sm:px-3 sm:py-2 rounded-md flex items-center text-sm sm:text-base"
            v-if="!showSettings && !showHierarchyManager && !showDataManagement"
          >
            <i class="fas fa-cog mr-1 sm:mr-2 text-xs sm:text-base"></i>
            <span>系统设置</span>
          </button>
          
          <button 
            @click="openDataManagement"
            class="bg-cyan-600 hover:bg-cyan-700 text-white px-2 py-1 sm:px-3 sm:py-2 rounded-md flex items-center text-sm sm:text-base"
            v-if="!showSettings && !showHierarchyManager && !showDataManagement"
          >
            <i class="fas fa-database mr-1 sm:mr-2 text-xs sm:text-base"></i>
            <span>数据管理</span>
          </button>
          
          <button 
            @click="exportToImage"
            class="bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 sm:px-3 sm:py-2 rounded-md flex items-center text-sm sm:text-base"
            v-if="!showSettings && !showHierarchyManager && !showDataManagement"
          >
            <i class="fas fa-camera mr-1 sm:mr-2 text-xs sm:text-base"></i>
            <span>导出图片</span>
          </button>
          
          <button 
            @click="openNodeModal" 
            class="bg-green-500 hover:bg-green-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-md flex items-center text-sm sm:text-base"
            v-if="!showSettings && !showHierarchyManager && !showDataManagement"
          >
            <i class="fas fa-plus mr-1 sm:mr-2 text-xs sm:text-base"></i>
            <span>添加节点</span>
          </button>
          <button 
            @click="openLinkModal"
            class="bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-md flex items-center text-sm sm:text-base"
            v-if="!showSettings && !showHierarchyManager && !showDataManagement"
          >
            <i class="fas fa-link mr-1 sm:mr-2 text-xs sm:text-base"></i>
            <span>添加关系</span>
          </button>
          <button 
            @click="openHierarchyManager"
            class="bg-teal-500 hover:bg-teal-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-md flex items-center text-sm sm:text-base"
            v-if="!showSettings && !showHierarchyManager && !showDataManagement"
          >
            <i class="fas fa-sitemap mr-1 sm:mr-2 text-xs sm:text-base"></i>
            <span>层次结构</span>
          </button>
        </div>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
      <!-- 侧边栏 -->
      <aside class="hidden md:block w-64 bg-gray-100 border-r border-gray-300 flex flex-col" v-if="!showSettings && !showHierarchyManager && !showDataManagement">
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
          v-if="!showSettings && !showHierarchyManager && !showDataManagement"
          @filter-change="handleFilterChange"
        />
        
        <NetworkGraph 
          ref="networkGraph" 
          class="flex-1" 
          @node-selected="handleNodeSelected"
          @link-selected="handleLinkSelected"
          v-show="!showSettings && !showHierarchyManager && !showDataManagement"
        />
        
        <!-- 系统设置界面 -->
        <Settings v-if="showSettings" class="flex-1 overflow-auto" />
        
        <!-- 数据管理界面 -->
        <DataManagement v-if="showDataManagement" class="flex-1 overflow-auto" />
        
        <!-- 层次结构管理界面 -->
        <HierarchyManager v-if="showHierarchyManager" class="flex-1 overflow-auto" />
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
import Settings from './src/components/Settings.vue'
import DataManagement from './src/components/DataManagement.vue'
import HierarchyManager from './src/components/HierarchyManager.vue'
import SearchFilter from './src/components/SearchFilter.vue'
import { useNodeStore } from './src/stores/nodes'
import { useThemeStore } from './src/stores/theme'

export default {
  name: 'App',
  components: {
    NetworkGraph,
    NodeList,
    NodeModal,
    LinkModal,
    Settings,
    DataManagement,
    HierarchyManager,
    SearchFilter,
    ElectronFeatures: () => import('./src/components/ElectronFeatures.vue')
  },
  setup() {
    const networkGraph = ref(null)
    const nodeStore = useNodeStore()
    const isFullScreen = ref(false)
    const selectedNode = ref(null)
    const showSettings = ref(false)
    const showDataManagement = ref(false)
    const showHierarchyManager = ref(false)

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
    
    const openSettings = () => {
      showSettings.value = true
    }
    
    const closeSettings = () => {
      showSettings.value = false
    }
    
    const openDataManagement = () => {
      showDataManagement.value = true
    }
    
    const closeDataManagement = () => {
      showDataManagement.value = false
    }
    
    const openHierarchyManager = () => {
      showHierarchyManager.value = true
    }
    
    const closeHierarchyManager = () => {
      showHierarchyManager.value = false
    }
    
    // 导出图片功能
    const exportToImage = () => {
      if (networkGraph.value) {
        networkGraph.value.exportToImage()
      }
    }
    
    // 提供关闭各种管理界面的方法给子组件
    provide('closeTypeManager', closeSettings)
    provide('closeDataManagement', closeDataManagement)
    provide('closeHierarchyManager', closeHierarchyManager)

    return {
      networkGraph,
      isFullScreen,
      showSettings,
      showDataManagement,
      showHierarchyManager,
      selectedNode,
      openNodeModal,
      openLinkModal,
      resetView,
      toggleFullScreen,
      handleNodeSelected,
      handleLinkSelected,
      handleFilterChange,
      openSettings,
      closeSettings,
      openDataManagement,
      closeDataManagement,
      openHierarchyManager,
      closeHierarchyManager,
      exportToImage
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
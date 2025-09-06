<template>
  <div id="app" class="flex flex-col h-screen">
    <header class="bg-blue-600 text-white p-4 shadow-md">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold">联系人知识图谱管理系统</h1>
        <div class="flex space-x-2">
          <button 
            @click="openNodeModal" 
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <i class="fas fa-plus mr-2"></i>
            添加节点
          </button>
          <button 
            @click="openLinkModal"
            class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <i class="fas fa-link mr-2"></i>
            添加关系
          </button>
        </div>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
      <!-- 侧边栏 -->
      <aside class="w-64 bg-gray-100 border-r border-gray-300 flex flex-col">
        <div class="p-4 border-b border-gray-300">
          <h2 class="text-lg font-semibold mb-2">节点列表</h2>
          <NodeList />
        </div>
        
        <div class="p-4 flex-1">
          <h2 class="text-lg font-semibold mb-2">操作面板</h2>
          <div class="space-y-2">
            <button 
              @click="resetView" 
              class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
            >
              重置视图
            </button>
            <button 
              @click="toggleFullScreen" 
              class="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-md"
            >
              {{ isFullScreen ? '退出全屏' : '全屏显示' }}
            </button>
          </div>
        </div>
      </aside>

      <!-- 主内容区 -->
      <main class="flex-1 flex flex-col">
        <NetworkGraph 
          ref="networkGraph" 
          class="flex-1" 
          @node-selected="handleNodeSelected"
          @link-selected="handleLinkSelected"
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
import { ref } from 'vue'
import NetworkGraph from './src/components/NetworkGraph.vue'
import NodeList from './src/components/NodeList.vue'
import NodeModal from './src/components/NodeModal.vue'
import LinkModal from './src/components/LinkModal.vue'
import { useNodeStore } from './src/stores/nodes'

export default {
  name: 'App',
  components: {
    NetworkGraph,
    NodeList,
    NodeModal,
    LinkModal
  },
  setup() {
    const networkGraph = ref(null)
    const nodeStore = useNodeStore()
    const isFullScreen = ref(false)
    const selectedNode = ref(null)

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
      // 可以在这里处理选中关系的逻辑
    }

    return {
      networkGraph,
      isFullScreen,
      openNodeModal,
      openLinkModal,
      resetView,
      toggleFullScreen,
      handleNodeSelected,
      handleLinkSelected
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
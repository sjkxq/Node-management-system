<template>
  <div class="node-list">
    <div class="mb-2 sm:mb-3">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="搜索节点..."
        class="w-full px-2 py-1 sm:px-3 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    
    <div class="space-y-1 sm:space-y-2 max-h-64 sm:max-h-96 overflow-y-auto">
      <div
        v-for="node in filteredNodes"
        :key="node.id"
        @click="selectNode(node)"
        @dblclick="editNode(node)"
        class="p-2 sm:p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition-colors flex items-center"
        :class="{ 'bg-blue-50 border-blue-300': selectedNode?.id === node.id }"
      >
        <div
          class="w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-1 sm:mr-2"
          :class="getNodeColorClass(node.type)"
        ></div>
        <div class="flex-1 min-w-0">
          <div class="font-medium text-sm sm:text-base truncate">{{ node.name }}</div>
          <div class="text-xs text-gray-500 truncate">{{ getNodeTypeName(node.type) }}</div>
          <div class="text-xs text-gray-400 mt-1">
            关系: {{ getLinksForNode(node.id).length }} 个
          </div>
        </div>
        <div class="flex flex-col space-y-0.5 sm:space-y-1">
          <button
            @click.stop="editNode(node)"
            class="text-blue-500 hover:text-blue-700 text-xs sm:text-sm"
            title="编辑节点"
          >
            <i class="fas fa-edit"></i>
          </button>
          <button
            @click.stop="deleteNode(node)"
            class="text-red-500 hover:text-red-700 text-xs sm:text-sm"
            title="删除节点"
          >
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      
      <div v-if="filteredNodes.length === 0" class="text-center py-3 sm:py-4 text-gray-500 text-sm sm:text-base">
        暂无节点数据
      </div>
    </div>
    
    <!-- 显示选中节点的关系 -->
    <div v-if="selectedNode" class="mt-3 sm:mt-4 p-2 sm:p-3 border border-gray-200 rounded-md bg-gray-50">
      <h3 class="font-medium text-sm sm:text-base mb-2">节点关系</h3>
      <div 
        v-for="link in getLinksForNode(selectedNode.id)" 
        :key="link.id"
        class="flex justify-between items-center py-1 border-b border-gray-100"
      >
        <div class="text-xs sm:text-sm">
          <span>{{ getNodeNameById(link.source === selectedNode.id ? link.target : link.source) }}</span>
          <span class="mx-1 sm:mx-2 text-gray-400">-</span>
          <span class="text-gray-600">{{ getLinkTypeName(link.type) }}</span>
        </div>
        <button 
          @click="editLink(link)"
          class="text-blue-500 hover:text-blue-700 text-xs"
        >
          <i class="fas fa-edit"></i> 编辑
        </button>
      </div>
      <div v-if="getLinksForNode(selectedNode.id).length === 0" class="text-xs sm:text-sm text-gray-500">
        暂无关系
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useNodeStore } from '../stores/nodes'
import { useTypeStore } from '../stores/types'

export default {
  name: 'NodeList',
  emits: ['node-selected'],
  setup(props, { emit }) {
    const nodeStore = useNodeStore()
    const typeStore = useTypeStore()
    const searchTerm = ref('')
    const selectedNode = ref(null)

    const filteredNodes = computed(() => {
      // 使用存储中的过滤后节点
      if (nodeStore.filteredNodes.length > 0) {
        if (!searchTerm.value) {
          return nodeStore.filteredNodes
        }
        
        // 如果同时有全局过滤和本地搜索，合并两者
        const term = searchTerm.value.toLowerCase()
        return nodeStore.filteredNodes.filter(node => 
          node.name.toLowerCase().includes(term) ||
          node.type.toLowerCase().includes(term)
        )
      }
      
      // 只使用本地搜索
      if (!searchTerm.value) {
        return nodeStore.nodes
      }
      
      const term = searchTerm.value.toLowerCase()
      return nodeStore.nodes.filter(node => 
        node.name.toLowerCase().includes(term) ||
        node.type.toLowerCase().includes(term)
      )
    })

    const selectNode = (node) => {
      selectedNode.value = node
      emit('node-selected', node)
    }

    const editNode = (node) => {
      nodeStore.openNodeModal(node)
    }

    const deleteNode = (node) => {
      if (confirm(`确定要删除节点 "${node.name}" 吗？`)) {
        nodeStore.deleteNode(node.id)
      }
    }
    
    const editLink = (link) => {
      nodeStore.openLinkModal(link)
    }

    const getNodeColorClass = (type) => {
      const colorClasses = {
        person: 'bg-blue-500',
        company: 'bg-green-500',
        organization: 'bg-yellow-500',
        tag: 'bg-pink-500'
      }
      return colorClasses[type] || 'bg-gray-500'
    }

    const getNodeTypeName = (type) => {
      const typeNames = {
        person: '节点',
        company: '公司',
        organization: '组织',
        tag: '标签'
      }
      return typeNames[type] || '未知类型'
    }
    
    const getLinkTypeName = (type) => {
      const typeNames = {
        connection: '连接',
        employment: '雇佣',
        membership: '成员',
        partnership: '合作',
        tagged: '标记'
      }
      return typeNames[type] || '未知关系'
    }
    
    const getNodeNameById = (id) => {
      const node = nodeStore.nodes.find(n => n.id === id)
      return node ? node.name : '未知节点'
    }
    
    const getLinksForNode = (nodeId) => {
      return nodeStore.links.filter(link => 
        link.source === nodeId || link.target === nodeId
      )
    }

    return {
      searchTerm,
      selectedNode,
      filteredNodes,
      selectNode,
      editNode,
      deleteNode,
      editLink,
      getNodeColorClass,
      getNodeTypeName,
      getLinkTypeName,
      getNodeNameById,
      getLinksForNode
    }
  }
}
</script>
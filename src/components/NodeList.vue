<template>
  <div class="node-list">
    <div class="mb-3">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="搜索节点..."
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    
    <div class="space-y-2 max-h-96 overflow-y-auto">
      <div
        v-for="node in filteredNodes"
        :key="node.id"
        @click="selectNode(node)"
        @dblclick="editNode(node)"
        class="p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition-colors flex items-center"
        :class="{ 'bg-blue-50 border-blue-300': selectedNode?.id === node.id }"
      >
        <div
          class="w-3 h-3 rounded-full mr-2"
          :class="getNodeColorClass(node.type)"
        ></div>
        <div class="flex-1 min-w-0">
          <div class="font-medium truncate">{{ node.name }}</div>
          <div class="text-xs text-gray-500 truncate">{{ getNodeTypeName(node.type) }}</div>
        </div>
        <button
          @click.stop="deleteNode(node)"
          class="text-red-500 hover:text-red-700 ml-2"
        >
          <i class="fas fa-trash"></i>
        </button>
      </div>
      
      <div v-if="filteredNodes.length === 0" class="text-center py-4 text-gray-500">
        暂无节点数据
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useNodeStore } from '../stores/nodes'

export default {
  name: 'NodeList',
  emits: ['node-selected'],
  setup(props, { emit }) {
    const nodeStore = useNodeStore()
    const searchTerm = ref('')
    const selectedNode = ref(null)

    const filteredNodes = computed(() => {
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
        person: '联系人',
        company: '公司',
        organization: '组织',
        tag: '标签'
      }
      return typeNames[type] || '未知类型'
    }

    return {
      searchTerm,
      selectedNode,
      filteredNodes,
      selectNode,
      editNode,
      deleteNode,
      getNodeColorClass,
      getNodeTypeName
    }
  }
}
</script>
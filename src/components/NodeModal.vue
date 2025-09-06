<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
      <div class="border-b border-gray-200 px-6 py-4">
        <h3 class="text-lg font-semibold text-gray-900">
          {{ editingNode ? '编辑节点' : '添加节点' }}
        </h3>
      </div>
      
      <div class="px-6 py-4">
        <form @submit.prevent="saveNode">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">节点名称</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入节点名称"
            />
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">节点类型</label>
            <select
              v-model="form.type"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option 
                v-for="nodeType in nodeTypes" 
                :key="nodeType.id" 
                :value="nodeType.id"
              >
                {{ nodeType.name }}
              </option>
            </select>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">描述</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入节点描述（可选）"
            ></textarea>
          </div>
          
          <div class="mb-4" v-if="form.type === 'person'">
            <label class="block text-sm font-medium text-gray-700 mb-1">职位</label>
            <input
              v-model="form.position"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入职位（可选）"
            />
          </div>
          
          <div class="mb-4" v-if="form.type === 'person'">
            <label class="block text-sm font-medium text-gray-700 mb-1">联系方式</label>
            <input
              v-model="form.contact"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入联系方式（可选）"
            />
          </div>
        </form>
      </div>
      
      <div class="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
        <button
          @click="closeModal"
          class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          取消
        </button>
        <button
          @click="saveNode"
          class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          保存
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, reactive, watch } from 'vue'
import { useNodeStore } from '../stores/nodes'
import { useTypeStore } from '../stores/types'

export default {
  name: 'NodeModal',
  setup() {
    const nodeStore = useNodeStore()
    const typeStore = useTypeStore()
    
    const isVisible = computed(() => nodeStore.isNodeModalOpen)
    const editingNode = computed(() => nodeStore.editingNode)
    const nodeTypes = computed(() => typeStore.nodeTypes)
    
    const form = reactive({
      name: '',
      type: 'person',
      description: '',
      position: '',
      contact: ''
    })
    
    // 当打开模态框时，初始化表单
    watch(isVisible, (newVal) => {
      if (newVal) {
        if (editingNode.value) {
          // 编辑模式
          form.name = editingNode.value.name || ''
          form.type = editingNode.value.type || 'person'
          form.description = editingNode.value.description || ''
          form.position = editingNode.value.position || ''
          form.contact = editingNode.value.contact || ''
        } else {
          // 新增模式
          form.name = ''
          form.type = 'person'
          form.description = ''
          form.position = ''
          form.contact = ''
        }
      }
    })
    
    const closeModal = () => {
      nodeStore.closeNodeModal()
    }
    
    const saveNode = () => {
      if (!form.name.trim()) return
      
      const nodeData = {
        name: form.name.trim(),
        type: form.type,
        description: form.description.trim(),
        position: form.position.trim(),
        contact: form.contact.trim()
      }
      
      if (editingNode.value) {
        // 编辑节点
        nodeStore.updateNode(editingNode.value.id, nodeData)
      } else {
        // 添加新节点
        nodeStore.addNode(nodeData)
      }
      
      closeModal()
    }
    
    return {
      isVisible,
      editingNode,
      nodeTypes,
      form,
      closeModal,
      saveNode
    }
  }
}
</script>
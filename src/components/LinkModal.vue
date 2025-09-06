<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
      <div class="border-b border-gray-200 px-6 py-4">
        <h3 class="text-lg font-semibold text-gray-900">
          {{ editingLink ? '编辑关系' : '添加关系' }}
        </h3>
      </div>
      
      <div class="px-6 py-4">
        <form @submit.prevent="saveLink">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">起始节点</label>
            <select
              v-model="form.source"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>请选择起始节点</option>
              <option
                v-for="node in nodes"
                :key="node.id"
                :value="node.id"
              >
                {{ node.name }} ({{ getNodeTypeName(node.type) }})
              </option>
            </select>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">目标节点</label>
            <select
              v-model="form.target"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>请选择目标节点</option>
              <option
                v-for="node in nodes"
                :key="node.id"
                :value="node.id"
                :disabled="node.id === form.source"
              >
                {{ node.name }} ({{ getNodeTypeName(node.type) }})
              </option>
            </select>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">关系类型</label>
            <select
              v-model="form.type"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option 
                v-for="linkType in linkTypes" 
                :key="linkType.id" 
                :value="linkType.id"
              >
                {{ linkType.name }}
              </option>
            </select>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">描述</label>
            <textarea
              v-model="form.description"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入关系描述（可选）"
            ></textarea>
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
          @click="saveLink"
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
  name: 'LinkModal',
  setup() {
    const nodeStore = useNodeStore()
    const typeStore = useTypeStore()
    
    const isVisible = computed(() => nodeStore.isLinkModalOpen)
    const editingLink = computed(() => nodeStore.editingLink)
    const nodes = computed(() => nodeStore.nodes)
    const linkTypes = computed(() => typeStore.linkTypes)
    
    const form = reactive({
      source: '',
      target: '',
      type: 'connection',
      description: ''
    })
    
    // 当打开模态框时，初始化表单
    watch(isVisible, (newVal) => {
      if (newVal) {
        if (editingLink.value) {
          // 编辑模式
          form.source = editingLink.value.source || ''
          form.target = editingLink.value.target || ''
          form.type = editingLink.value.type || 'connection'
          form.description = editingLink.value.description || ''
        } else {
          // 新增模式
          form.source = ''
          form.target = ''
          form.type = 'connection'
          form.description = ''
        }
      }
    })
    
    const closeModal = () => {
      nodeStore.closeLinkModal()
    }
    
    const saveLink = () => {
      if (!form.source || !form.target) return
      if (form.source === form.target) return
      
      const linkData = {
        source: form.source,
        target: form.target,
        type: form.type,
        description: form.description.trim()
      }
      
      if (editingLink.value) {
        // 编辑关系
        nodeStore.updateLink(editingLink.value.id, linkData)
      } else {
        // 添加新关系
        nodeStore.addLink(linkData)
      }
      
      closeModal()
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
      isVisible,
      editingLink,
      nodes,
      linkTypes,
      form,
      closeModal,
      saveLink,
      getNodeTypeName
    }
  }
}
</script>
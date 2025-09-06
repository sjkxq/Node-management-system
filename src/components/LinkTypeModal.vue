<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
      <div class="border-b border-gray-200 px-6 py-4">
        <h3 class="text-lg font-semibold text-gray-900">
          {{ editingType ? '编辑关系类型' : '添加关系类型' }}
        </h3>
      </div>
      
      <div class="px-6 py-4">
        <form @submit.prevent="saveType">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">类型名称</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入类型名称"
            />
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">描述</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入类型描述（可选）"
            ></textarea>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">颜色</label>
            <div class="flex items-center">
              <input
                v-model="form.color"
                type="color"
                class="w-10 h-10 border border-gray-300 rounded-md cursor-pointer"
              />
              <input
                v-model="form.color"
                type="text"
                class="ml-2 flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#94a3b8"
              />
            </div>
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
          @click="saveType"
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
import { useTypeStore } from '../stores/types'

export default {
  name: 'LinkTypeModal',
  setup() {
    const typeStore = useTypeStore()
    
    const isVisible = computed(() => typeStore.isLinkTypeModalOpen)
    const editingType = computed(() => typeStore.editingLinkType)
    
    const form = reactive({
      name: '',
      description: '',
      color: '#94a3b8'
    })
    
    // 当打开模态框时，初始化表单
    watch(isVisible, (newVal) => {
      if (newVal) {
        if (editingType.value) {
          // 编辑模式
          form.name = editingType.value.name || ''
          form.description = editingType.value.description || ''
          form.color = editingType.value.color || '#94a3b8'
        } else {
          // 新增模式
          form.name = ''
          form.description = ''
          form.color = '#94a3b8'
        }
      }
    })
    
    const closeModal = () => {
      typeStore.closeLinkTypeModal()
    }
    
    const saveType = () => {
      if (!form.name.trim()) return
      
      const typeData = {
        name: form.name.trim(),
        description: form.description.trim(),
        color: form.color
      }
      
      if (editingType.value) {
        // 编辑类型
        typeStore.updateLinkType(editingType.value.id, typeData)
      } else {
        // 添加新类型
        typeStore.addLinkType(typeData)
      }
      
      closeModal()
    }
    
    return {
      isVisible,
      editingType,
      form,
      closeModal,
      saveType
    }
  }
}
</script>
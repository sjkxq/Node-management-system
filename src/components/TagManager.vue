<template>
  <div class="tag-manager p-4">
    <div class="mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-xl font-bold text-gray-800 mb-4">标签管理</h2>
          <p class="text-gray-600">管理系统中的标签定义</p>
        </div>
        <button
          @click="exitTagManager"
          class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <i class="fas fa-arrow-left mr-2"></i>
          返回
        </button>
      </div>
    </div>
    
    <!-- 标签列表 -->
    <div class="mb-8">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-700">标签列表</h3>
        <button
          @click="openTagModal"
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <i class="fas fa-plus mr-2"></i>
          添加标签
        </button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="tag in tags"
          :key="tag.id"
          class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex justify-between items-start">
            <div class="flex items-center">
              <div
                class="w-4 h-4 rounded-full mr-2"
                :style="{ backgroundColor: tag.color }"
              ></div>
              <h4 class="font-medium text-gray-800">{{ tag.name }}</h4>
            </div>
            <div class="flex space-x-2">
              <button
                @click="editTag(tag)"
                class="text-blue-500 hover:text-blue-700"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                @click="deleteTag(tag.id)"
                class="text-red-500 hover:text-red-700"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
          <div class="mt-2">
            <div
              class="inline-block px-2 py-1 text-xs rounded"
              :style="{ 
                backgroundColor: tag.color + '20', 
                color: tag.color,
                border: '1px solid ' + tag.color
              }"
            >
              示例
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 节点标签关联 -->
    <div>
      <h3 class="text-lg font-semibold text-gray-700 mb-4">节点标签关联</h3>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">选择节点</label>
        <select
          v-model="selectedNode"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">请选择节点</option>
          <option
            v-for="node in nodes"
            :key="node.id"
            :value="node.id"
          >
            {{ node.name }}
          </option>
        </select>
      </div>
      
      <div v-if="selectedNode" class="mb-4">
        <h4 class="font-medium text-gray-800 mb-2">
          为 "{{ getNodeName(selectedNode) }}" 添加标签
        </h4>
        <div class="flex flex-wrap gap-2 mb-4">
          <div
            v-for="tag in tags"
            :key="tag.id"
            @click="toggleNodeTag(selectedNode, tag.id)"
            class="px-3 py-1 rounded-full cursor-pointer flex items-center"
            :class="{
              'bg-gray-200': !isNodeTagged(selectedNode, tag.id),
              'border': !isNodeTagged(selectedNode, tag.id)
            }"
            :style="isNodeTagged(selectedNode, tag.id) ? 
              { backgroundColor: tag.color + '20', borderColor: tag.color, color: tag.color } : 
              {}"
          >
            <div
              class="w-3 h-3 rounded-full mr-2"
              :style="{ backgroundColor: tag.color }"
            ></div>
            {{ tag.name }}
          </div>
        </div>
        
        <div class="mt-4">
          <h5 class="font-medium text-gray-700 mb-2">已关联的标签:</h5>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="tag in getTagsForSelectedNode"
              :key="tag.id"
              class="px-3 py-1 rounded-full flex items-center"
              :style="{ 
                backgroundColor: tag.color + '20', 
                borderColor: tag.color, 
                color: tag.color,
                border: '1px solid ' + tag.color
              }"
            >
              <div
                class="w-3 h-3 rounded-full mr-2"
                :style="{ backgroundColor: tag.color }"
              ></div>
              {{ tag.name }}
              <button
                @click="removeNodeTag(selectedNode, tag.id)"
                class="ml-2 text-gray-500 hover:text-gray-700"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div v-if="getTagsForSelectedNode.length === 0" class="text-gray-500 text-sm">
              该节点暂无标签
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 标签模态框 -->
    <div v-if="isTagModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="border-b border-gray-200 px-6 py-4">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ editingTag ? '编辑标签' : '添加标签' }}
          </h3>
        </div>
        
        <div class="px-6 py-4">
          <form @submit.prevent="saveTag">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">标签名称</label>
              <input
                v-model="tagForm.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入标签名称"
              />
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">颜色</label>
              <div class="flex items-center">
                <input
                  v-model="tagForm.color"
                  type="color"
                  class="w-10 h-10 border border-gray-300 rounded-md cursor-pointer"
                />
                <input
                  v-model="tagForm.color"
                  type="text"
                  class="ml-2 flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="#ef4444"
                />
              </div>
            </div>
          </form>
        </div>
        
        <div class="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
          <button
            @click="closeTagModal"
            class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            取消
          </button>
          <button
            @click="saveTag"
            class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, inject } from 'vue'
import { useNodeStore } from '../stores/nodes'

export default {
  name: 'TagManager',
  setup() {
    const nodeStore = useNodeStore()
    // 注入关闭标签管理界面的方法
    const closeTagManager = inject('closeTagManager')
    
    const isTagModalOpen = ref(false)
    const editingTag = ref(null)
    const selectedNode = ref('')
    
    const tagForm = ref({
      name: '',
      color: '#ef4444'
    })
    
    // 计算属性
    const tags = computed(() => nodeStore.tags)
    const nodes = computed(() => nodeStore.nodes)
    const getTagsForSelectedNode = computed(() => {
      if (!selectedNode.value) return []
      return nodeStore.getTagsForNode(selectedNode.value)
    })
    
    // 方法
    const openTagModal = (tag = null) => {
      editingTag.value = tag
      if (tag) {
        tagForm.value.name = tag.name
        tagForm.value.color = tag.color
      } else {
        tagForm.value.name = ''
        tagForm.value.color = '#ef4444'
      }
      isTagModalOpen.value = true
    }
    
    const closeTagModal = () => {
      isTagModalOpen.value = false
      editingTag.value = null
    }
    
    const saveTag = () => {
      if (!tagForm.value.name.trim()) return
      
      const tagData = {
        name: tagForm.value.name.trim(),
        color: tagForm.value.color
      }
      
      if (editingTag.value) {
        // 编辑标签
        nodeStore.updateTag(editingTag.value.id, tagData)
      } else {
        // 添加新标签
        nodeStore.addTag(tagData)
      }
      
      closeTagModal()
    }
    
    const editTag = (tag) => {
      openTagModal(tag)
    }
    
    const deleteTag = (id) => {
      if (confirm('确定要删除这个标签吗？')) {
        nodeStore.deleteTag(id)
      }
    }
    
    const getNodeName = (nodeId) => {
      const node = nodeStore.nodes.find(n => n.id === nodeId)
      return node ? node.name : '未知节点'
    }
    
    const toggleNodeTag = (nodeId, tagId) => {
      if (isNodeTagged(nodeId, tagId)) {
        nodeStore.removeNodeTag(nodeId, tagId)
      } else {
        nodeStore.addNodeTag(nodeId, tagId)
      }
    }
    
    const isNodeTagged = (nodeId, tagId) => {
      return nodeStore.nodeTags.some(nt => 
        nt.nodeId === nodeId && nt.tagId === tagId
      )
    }
    
    const removeNodeTag = (nodeId, tagId) => {
      nodeStore.removeNodeTag(nodeId, tagId)
    }
    
    // 退出标签管理界面的方法
    const exitTagManager = () => {
      if (closeTagManager) {
        closeTagManager()
      }
    }
    
    return {
      // 状态
      isTagModalOpen,
      editingTag,
      selectedNode,
      tagForm,
      
      // 数据
      tags,
      nodes,
      getTagsForSelectedNode,
      
      // 方法
      openTagModal,
      closeTagModal,
      saveTag,
      editTag,
      deleteTag,
      getNodeName,
      toggleNodeTag,
      isNodeTagged,
      removeNodeTag,
      exitTagManager
    }
  }
}
</script>
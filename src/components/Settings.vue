<template>
  <div class="settings p-4 h-full flex flex-col">
    <div class="mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-xl font-bold text-gray-800 mb-4">系统设置</h2>
          <p class="text-gray-600">管理节点类型、关系类型、标签和高亮颜色设置</p>
        </div>
        <button
          @click="exitSettings"
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
          @click="activeTab = 'types'"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm',
            activeTab === 'types' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          类型管理
        </button>
        <button
          @click="activeTab = 'tags'"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm',
            activeTab === 'tags' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          标签管理
        </button>
        <button
          @click="activeTab = 'highlight'"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm',
            activeTab === 'highlight' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          高亮设置
        </button>
      </nav>
    </div>
    
    <!-- 类型管理标签页 -->
    <div v-show="activeTab === 'types'" class="flex-1 overflow-auto">
      <div class="mb-8">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-700">节点类型</h3>
          <button
            @click="addNodeType"
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <i class="fas fa-plus mr-2"></i>
            添加节点类型
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="type in nodeTypes"
            :key="type.id"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex justify-between items-start">
              <div class="flex items-center">
                <div
                  class="w-4 h-4 rounded-full mr-2"
                  :style="{ backgroundColor: type.color }"
                ></div>
                <h4 class="font-medium text-gray-800">{{ type.name }}</h4>
              </div>
              <div class="flex space-x-2">
                <button
                  @click="editNodeType(type)"
                  class="text-blue-500 hover:text-blue-700"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="deleteNodeType(type.id)"
                  class="text-red-500 hover:text-red-700"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
            <p class="text-sm text-gray-600 mt-2">{{ type.description }}</p>
            <div class="flex items-center mt-2 text-xs text-gray-500">
              <span class="mr-3">形状: {{ getShapeName(type.shape) }}</span>
              <span>颜色: {{ type.color }}</span>
            </div>
            <div class="mt-2">
              <div
                class="inline-block px-2 py-1 text-xs rounded"
                :style="{ 
                  backgroundColor: type.color + '20', 
                  color: type.color,
                  border: '1px solid ' + type.color
                }"
              >
                示例
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-700">关系类型</h3>
          <button
            @click="addLinkType"
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <i class="fas fa-plus mr-2"></i>
            添加关系类型
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="type in linkTypes"
            :key="type.id"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex justify-between items-start">
              <div class="flex items-center">
                <div
                  class="w-4 h-4 rounded-full mr-2"
                  :style="{ backgroundColor: type.color }"
                ></div>
                <h4 class="font-medium text-gray-800">{{ type.name }}</h4>
              </div>
              <div class="flex space-x-2">
                <button
                  @click="editLinkType(type)"
                  class="text-blue-500 hover:text-blue-700"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="deleteLinkType(type.id)"
                  class="text-red-500 hover:text-red-700"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
            <p class="text-sm text-gray-600 mt-2">{{ type.description }}</p>
            <div class="flex items-center mt-2 text-xs text-gray-500">
              <span>颜色: {{ type.color }}</span>
            </div>
            <div class="mt-2">
              <div
                class="inline-block px-2 py-1 text-xs rounded"
                :style="{ 
                  backgroundColor: type.color + '20', 
                  color: type.color,
                  border: '1px solid ' + type.color
                }"
              >
                示例
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 标签管理标签页 -->
    <div v-show="activeTab === 'tags'" class="flex-1 overflow-auto">
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
    </div>
    
    <!-- 高亮设置标签页 -->
    <div v-show="activeTab === 'highlight'" class="flex-1 overflow-auto">
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 class="text-lg font-semibold text-gray-700 mb-4">颜色设置</h3>
        
        <div class="space-y-6">
          <!-- 节点边框颜色 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              节点高亮边框颜色
            </label>
            <div class="flex items-center space-x-4">
              <input
                v-model="highlightForm.nodeBorder"
                type="color"
                class="w-12 h-12 border border-gray-300 rounded-md cursor-pointer"
              />
              <div class="flex-1">
                <input
                  v-model="highlightForm.nodeBorder"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="#RRGGBB"
                />
              </div>
            </div>
          </div>

          <!-- 边颜色 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              关系高亮颜色
            </label>
            <div class="flex items-center space-x-4">
              <input
                v-model="highlightForm.edgeColor"
                type="color"
                class="w-12 h-12 border border-gray-300 rounded-md cursor-pointer"
              />
              <div class="flex-1">
                <input
                  v-model="highlightForm.edgeColor"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="#RRGGBB"
                />
              </div>
            </div>
          </div>

          <!-- 边高亮颜色 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              关系高亮边框颜色
            </label>
            <div class="flex items-center space-x-4">
              <input
                v-model="highlightForm.edgeHighlight"
                type="color"
                class="w-12 h-12 border border-gray-300 rounded-md cursor-pointer"
              />
              <div class="flex-1">
                <input
                  v-model="highlightForm.edgeHighlight"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="#RRGGBB"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <button
            @click="resetHighlightToDefault"
            class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            重置默认
          </button>
          <button
            @click="saveHighlightSettings"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            保存设置
          </button>
        </div>
      </div>

      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 class="text-sm font-semibold text-blue-800 mb-2">
          <i class="fas fa-info-circle mr-2"></i>使用说明
        </h4>
        <p class="text-sm text-blue-700">
          1. 点击颜色选择器可以选择预定义颜色<br>
          2. 在文本框中可以直接输入十六进制颜色值<br>
          3. 设置会自动保存并在下次访问时生效<br>
          4. 点击"重置默认"可以恢复到系统默认颜色
        </p>
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
    
    <!-- 类型管理模态框 -->
    <NodeTypeModal />
    <LinkTypeModal />
  </div>
</template>

<script>
import { ref, computed, onMounted, inject } from 'vue'
import { useTypeStore } from '../stores/types'
import { useHighlightStore } from '../stores/highlight'
import { useNodeStore } from '../stores/nodes'
import NodeTypeModal from './NodeTypeModal.vue'
import LinkTypeModal from './LinkTypeModal.vue'

export default {
  name: 'Settings',
  components: {
    NodeTypeModal,
    LinkTypeModal
  },
  setup() {
    const typeStore = useTypeStore()
    const highlightStore = useHighlightStore()
    const nodeStore = useNodeStore()
    const closeTypeManager = inject('closeTypeManager')
    
    // 标签页状态
    const activeTab = ref('types')
    
    // 标签管理状态
    const isTagModalOpen = ref(false)
    const editingTag = ref(null)
    
    const tagForm = ref({
      name: '',
      color: '#ef4444'
    })
    
    // 高亮设置表单
    const highlightForm = ref({
      nodeBorder: '#f472b6',
      edgeColor: '#f472b6',
      edgeHighlight: '#f472b6'
    })
    
    // 类型数据
    const nodeTypes = computed(() => typeStore.nodeTypes)
    const linkTypes = computed(() => typeStore.linkTypes)
    const tags = computed(() => nodeStore.tags)
    
    // 初始化高亮设置表单
    onMounted(() => {
      highlightForm.value = { ...highlightStore.highlightColors }
    })
    
    // 类型管理方法
    const addNodeType = () => {
      typeStore.openNodeTypeModal()
    }
    
    const editNodeType = (type) => {
      typeStore.openNodeTypeModal(type)
    }
    
    const deleteNodeType = (id) => {
      // 添加警告提示，防止误删重要类型
      if (['person', 'company', 'organization', 'tag'].includes(id)) {
        if (!confirm('这是系统默认类型，删除后可能影响系统功能。确定要删除吗？')) {
          return
        }
      } else {
        if (!confirm('确定要删除这个节点类型吗？')) {
          return
        }
      }
      typeStore.deleteNodeType(id)
    }
    
    const addLinkType = () => {
      typeStore.openLinkTypeModal()
    }
    
    const editLinkType = (type) => {
      typeStore.openLinkTypeModal(type)
    }
    
    const deleteLinkType = (id) => {
      // 添加警告提示，防止误删重要类型
      if (['connection', 'employment', 'membership', 'partnership', 'tagged'].includes(id)) {
        if (!confirm('这是系统默认类型，删除后可能影响系统功能。确定要删除吗？')) {
          return
        }
      } else {
        if (!confirm('确定要删除这个关系类型吗？')) {
          return
        }
      }
      typeStore.deleteLinkType(id)
    }
    
    const getShapeName = (shape) => {
      const shapeNames = {
        circle: '圆形',
        box: '矩形',
        ellipse: '椭圆形',
        diamond: '菱形'
      }
      return shapeNames[shape] || shape
    }
    
    // 标签管理方法
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
    
    // 高亮设置方法
    const saveHighlightSettings = () => {
      highlightStore.setHighlightColors(highlightForm.value)
      alert('高亮颜色设置已保存！')
    }
    
    const resetHighlightToDefault = () => {
      highlightStore.resetToDefault()
      highlightForm.value = { ...highlightStore.highlightColors }
      alert('已恢复默认颜色设置！')
    }
    
    // 退出设置界面
    const exitSettings = () => {
      if (closeTypeManager) {
        closeTypeManager()
      }
    }
    
    return {
      activeTab,
      highlightForm,
      isTagModalOpen,
      editingTag,
      tagForm,
      nodeTypes,
      linkTypes,
      tags,
      addNodeType,
      editNodeType,
      deleteNodeType,
      addLinkType,
      editLinkType,
      deleteLinkType,
      getShapeName,
      openTagModal,
      closeTagModal,
      saveTag,
      editTag,
      deleteTag,
      saveHighlightSettings,
      resetHighlightToDefault,
      exitSettings
    }
  }
}
</script>
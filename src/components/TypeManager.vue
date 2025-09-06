<template>
  <div class="type-manager p-4 h-full flex flex-col">
    <div class="mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-xl font-bold text-gray-800 mb-4">类型管理</h2>
          <p class="text-gray-600">管理节点和关系的类型定义</p>
        </div>
        <button
          @click="exitTypeManager"
          class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <i class="fas fa-arrow-left mr-2"></i>
          返回
        </button>
      </div>
    </div>
    
    <!-- 节点类型管理 -->
    <div class="mb-8 flex-1 overflow-auto">
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
    
    <!-- 关系类型管理 -->
    <div class="flex-1 overflow-auto">
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
    
    <!-- 模态框 -->
    <NodeTypeModal />
    <LinkTypeModal />
  </div>
</template>

<script>
import { computed, inject } from 'vue'
import { useTypeStore } from '../stores/types'
import NodeTypeModal from './NodeTypeModal.vue'
import LinkTypeModal from './LinkTypeModal.vue'

export default {
  name: 'TypeManager',
  components: {
    NodeTypeModal,
    LinkTypeModal
  },
  setup() {
    const typeStore = useTypeStore()
    // 注入关闭类型管理界面的方法
    const closeTypeManager = inject('closeTypeManager')
    
    const nodeTypes = computed(() => typeStore.nodeTypes)
    const linkTypes = computed(() => typeStore.linkTypes)
    
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
    
    // 退出类型管理界面的方法
    const exitTypeManager = () => {
      if (closeTypeManager) {
        closeTypeManager()
      }
    }
    
    return {
      nodeTypes,
      linkTypes,
      addNodeType,
      editNodeType,
      deleteNodeType,
      addLinkType,
      editLinkType,
      deleteLinkType,
      getShapeName,
      exitTypeManager
    }
  }
}
</script>
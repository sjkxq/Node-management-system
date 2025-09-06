<template>
  <div class="hierarchy-manager p-4">
    <div class="mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-xl font-bold text-gray-800 mb-4">层次结构管理</h2>
          <p class="text-gray-600">管理节点之间的层次关系</p>
        </div>
        <button
          @click="exitHierarchyManager"
          class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <i class="fas fa-arrow-left mr-2"></i>
          返回
        </button>
      </div>
    </div>
    
    <!-- 层次结构可视化 -->
    <div class="mb-8">
      <h3 class="text-lg font-semibold text-gray-700 mb-4">层次结构图</h3>
      <div class="border border-gray-200 rounded-lg p-4 bg-gray-50 min-h-64">
        <div v-if="hierarchyTree.length === 0" class="text-center py-8 text-gray-500">
          暂无层次结构数据
        </div>
        <div v-else class="hierarchy-tree">
          <ul class="pl-0">
            <li v-for="node in hierarchyTree" :key="node.id" class="mb-4">
              <div class="flex items-center">
                <div 
                  class="px-3 py-2 rounded-md shadow-sm"
                  :class="getNodeColorClass(node.type)"
                >
                  <span class="font-medium">{{ node.name }}</span>
                  <span class="text-xs ml-2 opacity-75">({{ getNodeTypeName(node.type) }})</span>
                </div>
              </div>
              <ul v-if="node.children && node.children.length > 0" class="pl-8 mt-2 border-l-2 border-gray-300">
                <li v-for="child in node.children" :key="child.id" class="mb-2 relative">
                  <div class="absolute -left-8 top-3 w-4 h-4 border-t-2 border-l-2 border-gray-400"></div>
                  <div class="flex items-center">
                    <div 
                      class="px-3 py-2 rounded-md shadow-sm"
                      :class="getNodeColorClass(child.type)"
                    >
                      <span class="font-medium">{{ child.name }}</span>
                      <span class="text-xs ml-2 opacity-75">({{ getNodeTypeName(child.type) }})</span>
                    </div>
                  </div>
                  <ul v-if="child.children && child.children.length > 0" class="pl-8 mt-2 border-l-2 border-gray-300">
                    <li v-for="grandchild in child.children" :key="grandchild.id" class="mb-2 relative">
                      <div class="absolute -left-8 top-3 w-4 h-4 border-t-2 border-l-2 border-gray-400"></div>
                      <div class="flex items-center">
                        <div 
                          class="px-3 py-2 rounded-md shadow-sm"
                          :class="getNodeColorClass(grandchild.type)"
                        >
                          <span class="font-medium">{{ grandchild.name }}</span>
                          <span class="text-xs ml-2 opacity-75">({{ getNodeTypeName(grandchild.type) }})</span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
    
    <!-- 添加层次关系 -->
    <div class="mb-8">
      <h3 class="text-lg font-semibold text-gray-700 mb-4">添加层次关系</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">父节点</label>
          <select
            v-model="hierarchyForm.parentId"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">请选择父节点</option>
            <option
              v-for="node in nodes"
              :key="node.id"
              :value="node.id"
            >
              {{ node.name }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">子节点</label>
          <select
            v-model="hierarchyForm.childId"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">请选择子节点</option>
            <option
              v-for="node in nodes"
              :key="node.id"
              :value="node.id"
              :disabled="node.id === hierarchyForm.parentId"
            >
              {{ node.name }}
            </option>
          </select>
        </div>
        
        <div class="flex items-end">
          <button
            @click="addHierarchy"
            :disabled="!hierarchyForm.parentId || !hierarchyForm.childId || hierarchyForm.parentId === hierarchyForm.childId"
            class="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md flex items-center justify-center"
          >
            <i class="fas fa-plus mr-2"></i>
            添加关系
          </button>
        </div>
      </div>
    </div>
    
    <!-- 现有层次关系 -->
    <div>
      <h3 class="text-lg font-semibold text-gray-700 mb-4">现有层次关系</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                父节点
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                子节点
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="hierarchy in hierarchies" :key="`${hierarchy.parentId}-${hierarchy.childId}`">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div 
                    class="w-3 h-3 rounded-full mr-2"
                    :class="getNodeColorClass(getNodeById(hierarchy.parentId)?.type)"
                  ></div>
                  <span>{{ getNodeName(hierarchy.parentId) }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div 
                    class="w-3 h-3 rounded-full mr-2"
                    :class="getNodeColorClass(getNodeById(hierarchy.childId)?.type)"
                  ></div>
                  <span>{{ getNodeName(hierarchy.childId) }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="removeHierarchy(hierarchy.parentId, hierarchy.childId)"
                  class="text-red-600 hover:text-red-900"
                >
                  删除
                </button>
              </td>
            </tr>
            <tr v-if="hierarchies.length === 0">
              <td colspan="3" class="px-6 py-4 text-center text-gray-500">
                暂无层次关系
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, inject } from 'vue'
import { useNodeStore } from '../stores/nodes'

export default {
  name: 'HierarchyManager',
  setup() {
    const nodeStore = useNodeStore()
    // 注入关闭层次结构管理界面的方法
    const closeHierarchyManager = inject('closeHierarchyManager')
    
    const hierarchyForm = ref({
      parentId: '',
      childId: ''
    })
    
    // 计算属性
    const nodes = computed(() => nodeStore.nodes)
    const hierarchies = computed(() => nodeStore.hierarchies)
    
    // 构建层次结构树
    const hierarchyTree = computed(() => {
      // 找到所有没有父节点的根节点
      const rootNodes = nodes.value.filter(node => {
        return !hierarchies.value.some(h => h.childId === node.id)
      })
      
      // 递归构建子树
      const buildTree = (node) => {
        const children = hierarchies.value
          .filter(h => h.parentId === node.id)
          .map(h => nodes.value.find(n => n.id === h.childId))
          .filter(n => n)
          .map(child => buildTree(child))
        
        return {
          ...node,
          children
        }
      }
      
      return rootNodes.map(node => buildTree(node))
    })
    
    // 方法
    const getNodeById = (id) => {
      return nodeStore.nodes.find(node => node.id === id)
    }
    
    const getNodeName = (nodeId) => {
      const node = getNodeById(nodeId)
      return node ? node.name : '未知节点'
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
    
    const getNodeColorClass = (type) => {
      const colorClasses = {
        person: 'bg-blue-100 text-blue-800 border border-blue-200',
        company: 'bg-green-100 text-green-800 border border-green-200',
        organization: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
        tag: 'bg-pink-100 text-pink-800 border border-pink-200'
      }
      return colorClasses[type] || 'bg-gray-100 text-gray-800 border border-gray-200'
    }
    
    const addHierarchy = () => {
      if (!hierarchyForm.value.parentId || !hierarchyForm.value.childId) return
      if (hierarchyForm.value.parentId === hierarchyForm.value.childId) return
      
      nodeStore.addHierarchy(
        hierarchyForm.value.parentId,
        hierarchyForm.value.childId
      )
      
      // 重置表单
      hierarchyForm.value.parentId = ''
      hierarchyForm.value.childId = ''
    }
    
    const removeHierarchy = (parentId, childId) => {
      if (confirm('确定要删除这个层次关系吗？')) {
        nodeStore.removeHierarchy(parentId, childId)
      }
    }
    
    // 退出层次结构管理界面的方法
    const exitHierarchyManager = () => {
      if (closeHierarchyManager) {
        closeHierarchyManager()
      }
    }
    
    return {
      // 状态
      hierarchyForm,
      
      // 数据
      nodes,
      hierarchies,
      hierarchyTree,
      
      // 方法
      getNodeById,
      getNodeName,
      getNodeTypeName,
      getNodeColorClass,
      addHierarchy,
      removeHierarchy,
      exitHierarchyManager
    }
  }
}
</script>

<style scoped>
.hierarchy-tree ul {
  list-style-type: none;
}

.hierarchy-tree li {
  position: relative;
  padding-left: 1.5rem;
}

.hierarchy-tree li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 1rem;
  border-left: 2px solid #d1d5db;
  border-bottom: 2px solid #d1d5db;
}

.hierarchy-tree li:last-child::before {
  border-left: 2px solid transparent;
}
</style>
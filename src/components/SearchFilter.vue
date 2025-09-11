<template>
  <div class="search-filter p-2 sm:p-4 bg-white border-b border-gray-200">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
      <!-- 搜索框 -->
      <div class="sm:col-span-2 md:col-span-3 lg:col-span-2">
        <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1">搜索</label>
        <div class="relative">
          <input
            v-model="localSearchQuery"
            type="text"
            placeholder="搜索节点名称、描述、职位或联系方式..."
            class="w-full pl-7 sm:pl-10 pr-3 sm:pr-4 py-1 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @input="handleSearch"
          />
          <div class="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
            <i class="fas fa-search text-gray-400 text-xs sm:text-sm"></i>
          </div>
        </div>
      </div>
      
      <!-- 节点类型过滤 -->
      <div>
        <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1">节点类型</label>
        <select
          v-model="localSelectedNodeType"
          class="w-full px-2 sm:px-3 py-1 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          @change="handleNodeTypeChange"
        >
          <option value="">所有类型</option>
          <option 
            v-for="nodeType in nodeTypes" 
            :key="nodeType.id" 
            :value="nodeType.id"
          >
            {{ nodeType.name }}
          </option>
        </select>
      </div>
      
      <!-- 关系类型过滤 -->
      <div>
        <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1">关系类型</label>
        <select
          v-model="localSelectedLinkType"
          class="w-full px-2 sm:px-3 py-1 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          @change="handleLinkTypeChange"
        >
          <option value="">所有类型</option>
          <option 
            v-for="linkType in linkTypes" 
            :key="linkType.id" 
            :value="linkType.id"
          >
            {{ linkType.name }}
          </option>
        </select>
      </div>
      
      <!-- 标签过滤 -->
      <div>
        <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1">标签</label>
        <select
          v-model="localSelectedTag"
          class="w-full px-2 sm:px-3 py-1 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          @change="handleTagChange"
        >
          <option value="">所有标签</option>
          <option 
            v-for="tag in tags" 
            :key="tag.id" 
            :value="tag.id"
          >
            {{ tag.name }}
          </option>
        </select>
      </div>
    </div>
    
    <!-- 活动过滤器显示 -->
    <div v-if="hasActiveFilters" class="mt-2 sm:mt-4 flex flex-wrap items-center gap-1 sm:gap-2">
      <span class="text-xs sm:text-sm text-gray-600">活动过滤器:</span>
      
      <span 
        v-if="searchQuery" 
        class="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
      >
        搜索: "{{ searchQuery }}"
        <button 
          @click="clearSearch" 
          class="ml-1 flex-shrink-0 h-3 w-3 sm:h-4 sm:w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
        >
          <i class="fas fa-times text-xs"></i>
        </button>
      </span>
      
      <span 
        v-if="selectedNodeType" 
        class="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
      >
        节点类型: {{ getNodeTypeName(selectedNodeType) }}
        <button 
          @click="clearNodeType" 
          class="ml-1 flex-shrink-0 h-3 w-3 sm:h-4 sm:w-4 rounded-full inline-flex items-center justify-center text-green-400 hover:bg-green-200 hover:text-green-500 focus:outline-none"
        >
          <i class="fas fa-times text-xs"></i>
        </button>
      </span>
      
      <span 
        v-if="selectedLinkType" 
        class="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
      >
        关系类型: {{ getLinkTypeName(selectedLinkType) }}
        <button 
          @click="clearLinkType" 
          class="ml-1 flex-shrink-0 h-3 w-3 sm:h-4 sm:w-4 rounded-full inline-flex items-center justify-center text-purple-400 hover:bg-purple-200 hover:text-purple-500 focus:outline-none"
        >
          <i class="fas fa-times text-xs"></i>
        </button>
      </span>
      
      <span 
        v-if="selectedTag" 
        class="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
      >
        标签: {{ getTagName(selectedTag) }}
        <button 
          @click="clearTag" 
          class="ml-1 flex-shrink-0 h-3 w-3 sm:h-4 sm:w-4 rounded-full inline-flex items-center justify-center text-yellow-400 hover:bg-yellow-200 hover:text-yellow-500 focus:outline-none"
        >
          <i class="fas fa-times text-xs"></i>
        </button>
      </span>
      
      <button 
        @click="clearAllFilters" 
        class="text-xs sm:text-sm text-red-600 hover:text-red-800 font-medium"
      >
        清除所有过滤器
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useNodeStore } from '../stores/nodes'
import { useTypeStore } from '../stores/types'

export default {
  name: 'SearchFilter',
  emits: ['search', 'filter-change'],
  setup(props, { emit }) {
    const nodeStore = useNodeStore()
    const typeStore = useTypeStore()
    
    // 本地状态用于防抖
    const localSearchQuery = ref(nodeStore.searchQuery)
    const localSelectedNodeType = ref(nodeStore.selectedNodeType)
    const localSelectedLinkType = ref(nodeStore.selectedLinkType)
    const localSelectedTag = ref(nodeStore.selectedTag)
    
    // 计算属性
    const nodeTypes = computed(() => typeStore.nodeTypes)
    const linkTypes = computed(() => typeStore.linkTypes)
    const tags = computed(() => nodeStore.tags)
    const searchQuery = computed(() => nodeStore.searchQuery)
    const selectedNodeType = computed(() => nodeStore.selectedNodeType)
    const selectedLinkType = computed(() => nodeStore.selectedLinkType)
    const selectedTag = computed(() => nodeStore.selectedTag)
    
    const hasActiveFilters = computed(() => {
      return searchQuery.value || 
             selectedNodeType.value || 
             selectedLinkType.value || 
             selectedTag.value
    })
    
    // 同步存储状态到本地状态
    watch(searchQuery, (newVal) => {
      localSearchQuery.value = newVal
    })
    
    watch(selectedNodeType, (newVal) => {
      localSelectedNodeType.value = newVal
    })
    
    watch(selectedLinkType, (newVal) => {
      localSelectedLinkType.value = newVal
    })
    
    watch(selectedTag, (newVal) => {
      localSelectedTag.value = newVal
    })
    
    // 处理搜索
    const handleSearch = () => {
      // 防抖处理
      clearTimeout(searchTimeout)
      searchTimeout = setTimeout(() => {
        nodeStore.setSearchQuery(localSearchQuery.value)
        emit('search', localSearchQuery.value)
        emit('filter-change')
      }, 300)
    }
    
    let searchTimeout
    
    // 处理节点类型变化
    const handleNodeTypeChange = () => {
      nodeStore.setSelectedNodeType(localSelectedNodeType.value)
      emit('filter-change')
    }
    
    // 处理关系类型变化
    const handleLinkTypeChange = () => {
      nodeStore.setSelectedLinkType(localSelectedLinkType.value)
      emit('filter-change')
    }
    
    // 处理标签变化
    const handleTagChange = () => {
      nodeStore.setSelectedTag(localSelectedTag.value)
      emit('filter-change')
    }
    
    // 清除过滤器
    const clearSearch = () => {
      localSearchQuery.value = ''
      nodeStore.setSearchQuery('')
      emit('search', '')
      emit('filter-change')
    }
    
    const clearNodeType = () => {
      localSelectedNodeType.value = ''
      nodeStore.setSelectedNodeType('')
      emit('filter-change')
    }
    
    const clearLinkType = () => {
      localSelectedLinkType.value = ''
      nodeStore.setSelectedLinkType('')
      emit('filter-change')
    }
    
    const clearTag = () => {
      localSelectedTag.value = ''
      nodeStore.setSelectedTag('')
      emit('filter-change')
    }
    
    const clearAllFilters = () => {
      localSearchQuery.value = ''
      localSelectedNodeType.value = ''
      localSelectedLinkType.value = ''
      localSelectedTag.value = ''
      
      nodeStore.clearFilters()
      emit('search', '')
      emit('filter-change')
    }
    
    // 获取名称方法
    const getNodeTypeName = (typeId) => {
      const type = typeStore.nodeTypes.find(t => t.id === typeId)
      return type ? type.name : typeId
    }
    
    const getLinkTypeName = (typeId) => {
      const type = typeStore.linkTypes.find(t => t.id === typeId)
      return type ? type.name : typeId
    }
    
    const getTagName = (tagId) => {
      const tag = nodeStore.tags.find(t => t.id === tagId)
      return tag ? tag.name : tagId
    }
    
    return {
      // 状态
      localSearchQuery,
      localSelectedNodeType,
      localSelectedLinkType,
      localSelectedTag,
      
      // 数据
      nodeTypes,
      linkTypes,
      tags,
      searchQuery,
      selectedNodeType,
      selectedLinkType,
      selectedTag,
      hasActiveFilters,
      
      // 方法
      handleSearch,
      handleNodeTypeChange,
      handleLinkTypeChange,
      handleTagChange,
      clearSearch,
      clearNodeType,
      clearLinkType,
      clearTag,
      clearAllFilters,
      getNodeTypeName,
      getLinkTypeName,
      getTagName
    }
  }
}
</script>
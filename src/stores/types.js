import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTypeStore = defineStore('types', () => {
  // 节点类型
  const nodeTypes = ref([
    { 
      id: 'person', 
      name: '联系人', 
      description: '个人联系人',
      color: '#60a5fa',
      shape: 'circle'
    },
    { 
      id: 'company', 
      name: '公司', 
      description: '企业组织',
      color: '#34d399',
      shape: 'box'
    },
    { 
      id: 'organization', 
      name: '组织', 
      description: '社会组织或团体',
      color: '#fbbf24',
      shape: 'ellipse'
    },
    { 
      id: 'tag', 
      name: '标签', 
      description: '用于分类标记的标签',
      color: '#f472b6',
      shape: 'diamond'
    }
  ])

  // 关系类型
  const linkTypes = ref([
    { 
      id: 'connection', 
      name: '连接', 
      description: '基本连接关系',
      color: '#94a3b8'
    },
    { 
      id: 'employment', 
      name: '雇佣', 
      description: '雇佣关系',
      color: '#60a5fa'
    },
    { 
      id: 'membership', 
      name: '成员', 
      description: '成员关系',
      color: '#34d399'
    },
    { 
      id: 'partnership', 
      name: '合作', 
      description: '合作关系',
      color: '#fbbf24'
    },
    { 
      id: 'tagged', 
      name: '标记', 
      description: '标签标记关系',
      color: '#f472b6'
    }
  ])

  // 模态框状态
  const isNodeTypeModalOpen = ref(false)
  const isLinkTypeModalOpen = ref(false)
  const editingNodeType = ref(null)
  const editingLinkType = ref(null)

  // 节点类型操作方法
  const addNodeType = (typeData) => {
    const newType = {
      id: generateId(),
      ...typeData
    }
    nodeTypes.value.push(newType)
  }

  const updateNodeType = (id, typeData) => {
    const index = nodeTypes.value.findIndex(type => type.id === id)
    if (index !== -1) {
      nodeTypes.value[index] = { ...nodeTypes.value[index], ...typeData }
    }
  }

  const deleteNodeType = (id) => {
    // 允许删除所有类型，包括系统默认类型
    nodeTypes.value = nodeTypes.value.filter(type => type.id !== id)
  }

  // 关系类型操作方法
  const addLinkType = (typeData) => {
    const newType = {
      id: generateId(),
      ...typeData
    }
    linkTypes.value.push(newType)
  }

  const updateLinkType = (id, typeData) => {
    const index = linkTypes.value.findIndex(type => type.id === id)
    if (index !== -1) {
      linkTypes.value[index] = { ...linkTypes.value[index], ...typeData }
    }
  }

  const deleteLinkType = (id) => {
    // 允许删除所有类型，包括系统默认类型
    linkTypes.value = linkTypes.value.filter(type => type.id !== id)
  }

  // 模态框操作方法
  const openNodeTypeModal = (type = null) => {
    editingNodeType.value = type
    isNodeTypeModalOpen.value = true
  }

  const closeNodeTypeModal = () => {
    isNodeTypeModalOpen.value = false
    editingNodeType.value = null
  }

  const openLinkTypeModal = (type = null) => {
    editingLinkType.value = type
    isLinkTypeModalOpen.value = true
  }

  const closeLinkTypeModal = () => {
    isLinkTypeModalOpen.value = false
    editingLinkType.value = null
  }

  // 工具方法
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  const getNodeTypeById = (id) => {
    return nodeTypes.value.find(type => type.id === id)
  }

  const getLinkTypeById = (id) => {
    return linkTypes.value.find(type => type.id === id)
  }

  return {
    // 状态
    nodeTypes,
    linkTypes,
    isNodeTypeModalOpen,
    isLinkTypeModalOpen,
    editingNodeType,
    editingLinkType,

    // 节点类型方法
    addNodeType,
    updateNodeType,
    deleteNodeType,
    openNodeTypeModal,
    closeNodeTypeModal,
    getNodeTypeById,

    // 关系类型方法
    addLinkType,
    updateLinkType,
    deleteLinkType,
    openLinkTypeModal,
    closeLinkTypeModal,
    getLinkTypeById
  }
})
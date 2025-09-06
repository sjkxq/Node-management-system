import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNodeStore = defineStore('nodes', () => {
  // 节点数据
  const nodes = ref([
    { 
      id: '1', 
      name: '张三', 
      type: 'person',
      description: '项目经理',
      position: '项目经理',
      contact: 'zhangsan@example.com'
    },
    { 
      id: '2', 
      name: 'ABC公司', 
      type: 'company',
      description: '一家科技公司',
    },
    { 
      id: '3', 
      name: '李四', 
      type: 'person',
      description: '前端开发工程师',
      position: '前端开发工程师',
      contact: 'lisi@example.com'
    },
    { 
      id: '4', 
      name: '王五', 
      type: 'person',
      description: '后端开发工程师',
      position: '后端开发工程师',
      contact: 'wangwu@example.com'
    },
    { 
      id: '5', 
      name: '开发部', 
      type: 'organization',
      description: '负责软件开发的部门'
    }
  ])

  // 关系数据
  const links = ref([
    { 
      id: '1', 
      source: '1', 
      target: '2', 
      type: 'employment',
      description: '张三在ABC公司工作'
    },
    { 
      id: '2', 
      source: '3', 
      target: '2', 
      type: 'employment',
      description: '李四在ABC公司工作'
    },
    { 
      id: '3', 
      source: '4', 
      target: '2', 
      type: 'employment',
      description: '王五在ABC公司工作'
    },
    { 
      id: '4', 
      source: '1', 
      target: '3', 
      type: 'partnership',
      description: '张三和李四是合作伙伴'
    },
    { 
      id: '5', 
      source: '5', 
      target: '2', 
      type: 'membership',
      description: '开发部属于ABC公司'
    },
    { 
      id: '6', 
      source: '3', 
      target: '5', 
      type: 'membership',
      description: '李四是开发部成员'
    },
    { 
      id: '7', 
      source: '4', 
      target: '5', 
      type: 'membership',
      description: '王五是开发部成员'
    }
  ])

  // 标签数据
  const tags = ref([
    { id: 'tag1', name: '重要联系人', color: '#ef4444' },
    { id: 'tag2', name: '客户', color: '#3b82f6' },
    { id: 'tag3', name: '供应商', color: '#10b981' }
  ])

  // 节点标签关联
  const nodeTags = ref([
    { nodeId: '1', tagId: 'tag1' },
    { nodeId: '2', tagId: 'tag2' }
  ])

  // 层次结构数据（父节点 -> 子节点）
  const hierarchies = ref([
    { parentId: '2', childId: '5' }, // ABC公司 -> 开发部
    { parentId: '5', childId: '3' }, // 开发部 -> 李四
    { parentId: '5', childId: '4' }  // 开发部 -> 王五
  ])

  // 搜索和过滤状态
  const searchQuery = ref('')
  const selectedNodeType = ref('')
  const selectedLinkType = ref('')
  const selectedTag = ref('')

  // 模态框状态
  const isNodeModalOpen = ref(false)
  const isLinkModalOpen = ref(false)
  const editingNode = ref(null)
  const editingLink = ref(null)

  // 节点操作方法
  const addNode = (nodeData) => {
    const newNode = {
      id: Date.now().toString(),
      ...nodeData
    }
    nodes.value.push(newNode)
  }

  const updateNode = (id, nodeData) => {
    const index = nodes.value.findIndex(node => node.id === id)
    if (index !== -1) {
      nodes.value[index] = { ...nodes.value[index], ...nodeData }
    }
  }

  const deleteNode = (id) => {
    // 删除节点相关的所有关系
    links.value = links.value.filter(link => 
      link.source !== id && link.target !== id
    )
    
    // 删除节点相关的标签关联
    nodeTags.value = nodeTags.value.filter(nt => nt.nodeId !== id)
    
    // 删除节点相关的层次结构
    hierarchies.value = hierarchies.value.filter(
      h => h.parentId !== id && h.childId !== id
    )
    
    // 删除节点本身
    nodes.value = nodes.value.filter(node => node.id !== id)
  }

  const getNodeById = (id) => {
    return nodes.value.find(node => node.id === id)
  }

  // 关系操作方法
  const addLink = (linkData) => {
    // 检查是否已存在相同的关系
    const exists = links.value.some(link => 
      link.source === linkData.source && 
      link.target === linkData.target &&
      link.type === linkData.type
    )
    
    if (!exists) {
      const newLink = {
        id: Date.now().toString(),
        ...linkData
      }
      links.value.push(newLink)
    }
  }

  const updateLink = (id, linkData) => {
    const index = links.value.findIndex(link => link.id === id)
    if (index !== -1) {
      links.value[index] = { ...links.value[index], ...linkData }
    }
  }

  const deleteLink = (id) => {
    links.value = links.value.filter(link => link.id !== id)
  }

  // 标签操作方法
  const addTag = (tagData) => {
    const newTag = {
      id: 'tag' + Date.now().toString(),
      ...tagData
    }
    tags.value.push(newTag)
  }

  const updateTag = (id, tagData) => {
    const index = tags.value.findIndex(tag => tag.id === id)
    if (index !== -1) {
      tags.value[index] = { ...tags.value[index], ...tagData }
    }
  }

  const deleteTag = (id) => {
    // 删除标签关联
    nodeTags.value = nodeTags.value.filter(nt => nt.tagId !== id)
    
    // 删除标签本身
    tags.value = tags.value.filter(tag => tag.id !== id)
  }

  // 节点标签关联操作方法
  const addNodeTag = (nodeId, tagId) => {
    // 检查是否已存在关联
    const exists = nodeTags.value.some(nt => 
      nt.nodeId === nodeId && nt.tagId === tagId
    )
    
    if (!exists) {
      nodeTags.value.push({ nodeId, tagId })
    }
  }

  const removeNodeTag = (nodeId, tagId) => {
    nodeTags.value = nodeTags.value.filter(nt => 
      !(nt.nodeId === nodeId && nt.tagId === tagId)
    )
  }

  // 层次结构操作方法
  const addHierarchy = (parentId, childId) => {
    // 检查是否已存在层次关系
    const exists = hierarchies.value.some(h => 
      h.parentId === parentId && h.childId === childId
    )
    
    if (!exists) {
      hierarchies.value.push({ parentId, childId })
    }
  }

  const removeHierarchy = (parentId, childId) => {
    hierarchies.value = hierarchies.value.filter(h => 
      !(h.parentId === parentId && h.childId === childId)
    )
  }

  // 获取节点的标签
  const getTagsForNode = (nodeId) => {
    return nodeTags.value
      .filter(nt => nt.nodeId === nodeId)
      .map(nt => tags.value.find(tag => tag.id === nt.tagId))
      .filter(tag => tag !== undefined)
  }

  // 获取节点的子节点
  const getChildrenForNode = (nodeId) => {
    return hierarchies.value
      .filter(h => h.parentId === nodeId)
      .map(h => nodes.value.find(node => node.id === h.childId))
      .filter(node => node !== undefined)
  }

  // 获取节点的父节点
  const getParentForNode = (nodeId) => {
    const hierarchy = hierarchies.value.find(h => h.childId === nodeId)
    return hierarchy ? nodes.value.find(node => node.id === hierarchy.parentId) : null
  }

  // 获取节点的所有关系
  const getLinksForNode = (nodeId) => {
    return links.value.filter(link => 
      link.source === nodeId || link.target === nodeId
    )
  }

  // 搜索和过滤方法
  const setSearchQuery = (query) => {
    searchQuery.value = query
  }

  const setSelectedNodeType = (type) => {
    selectedNodeType.value = type
  }

  const setSelectedLinkType = (type) => {
    selectedLinkType.value = type
  }

  const setSelectedTag = (tagId) => {
    selectedTag.value = tagId
  }

  const clearFilters = () => {
    searchQuery.value = ''
    selectedNodeType.value = ''
    selectedLinkType.value = ''
    selectedTag.value = ''
  }

  // 计算属性：过滤后的节点
  const filteredNodes = computed(() => {
    let result = nodes.value
    
    // 按搜索查询过滤
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(node => 
        node.name.toLowerCase().includes(query) ||
        (node.description && node.description.toLowerCase().includes(query)) ||
        (node.position && node.position.toLowerCase().includes(query)) ||
        (node.contact && node.contact.toLowerCase().includes(query))
      )
    }
    
    // 按节点类型过滤
    if (selectedNodeType.value) {
      result = result.filter(node => node.type === selectedNodeType.value)
    }
    
    // 按标签过滤
    if (selectedTag.value) {
      result = result.filter(node => 
        nodeTags.value.some(nt => 
          nt.nodeId === node.id && nt.tagId === selectedTag.value
        )
      )
    }
    
    return result
  })

  // 计算属性：过滤后的关系
  const filteredLinks = computed(() => {
    let result = links.value
    
    // 按关系类型过滤
    if (selectedLinkType.value) {
      result = result.filter(link => link.type === selectedLinkType.value)
    }
    
    // 只显示与过滤后节点相关的关系
    const filteredNodeIds = new Set(filteredNodes.value.map(node => node.id))
    result = result.filter(link => 
      filteredNodeIds.has(link.source) && filteredNodeIds.has(link.target)
    )
    
    return result
  })

  // 模态框操作方法
  const openNodeModal = (node = null) => {
    editingNode.value = node
    isNodeModalOpen.value = true
  }

  const closeNodeModal = () => {
    isNodeModalOpen.value = false
    editingNode.value = null
  }

  const openLinkModal = (link = null) => {
    editingLink.value = link
    isLinkModalOpen.value = true
  }

  const closeLinkModal = () => {
    isLinkModalOpen.value = false
    editingLink.value = null
  }

  return {
    // 状态
    nodes,
    links,
    tags,
    nodeTags,
    hierarchies,
    searchQuery,
    selectedNodeType,
    selectedLinkType,
    selectedTag,
    isNodeModalOpen,
    isLinkModalOpen,
    editingNode,
    editingLink,

    // 节点方法
    addNode,
    updateNode,
    deleteNode,
    getNodeById,

    // 关系方法
    addLink,
    updateLink,
    deleteLink,
    getLinksForNode,

    // 标签方法
    addTag,
    updateTag,
    deleteTag,
    getTagsForNode,

    // 节点标签关联方法
    addNodeTag,
    removeNodeTag,

    // 层次结构方法
    addHierarchy,
    removeHierarchy,
    getChildrenForNode,
    getParentForNode,

    // 搜索和过滤方法
    setSearchQuery,
    setSelectedNodeType,
    setSelectedLinkType,
    setSelectedTag,
    clearFilters,
    filteredNodes,
    filteredLinks,

    // 模态框方法
    openNodeModal,
    closeNodeModal,
    openLinkModal,
    closeLinkModal
  }
})
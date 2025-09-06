import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNodeStore = defineStore('nodes', () => {
  // 节点数据
  const nodes = ref([
    {
      id: '1',
      name: '张三',
      type: 'person',
      description: '前端开发工程师',
      position: '高级工程师',
      contact: 'zhangsan@example.com',
      x: 200,
      y: 150
    },
    {
      id: '2',
      name: 'ABC公司',
      type: 'company',
      description: '互联网科技公司',
      x: 400,
      y: 150
    },
    {
      id: '3',
      name: '开发者社区',
      type: 'organization',
      description: '技术交流组织',
      x: 300,
      y: 300
    }
  ])

  // 关系数据
  const links = ref([
    {
      id: '1',
      source: '1',
      target: '2',
      type: 'employment',
      description: '就职于'
    },
    {
      id: '2',
      source: '1',
      target: '3',
      type: 'membership',
      description: '是成员'
    }
  ])

  // 模态框状态
  const isNodeModalOpen = ref(false)
  const isLinkModalOpen = ref(false)
  const editingNode = ref(null)
  const editingLink = ref(null)

  // 计算属性
  const nodeCount = computed(() => nodes.value.length)
  const linkCount = computed(() => links.value.length)

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
    // 删除节点
    nodes.value = nodes.value.filter(node => node.id !== id)
    // 删除与该节点相关的所有关系
    links.value = links.value.filter(link => 
      link.source !== id && link.target !== id
    )
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

  // 获取节点
  const getNodeById = (id) => {
    return nodes.value.find(node => node.id === id)
  }

  // 获取节点的所有关系
  const getLinksForNode = (nodeId) => {
    return links.value.filter(link => 
      link.source === nodeId || link.target === nodeId
    )
  }

  return {
    // 状态
    nodes,
    links,
    isNodeModalOpen,
    isLinkModalOpen,
    editingNode,
    editingLink,
    nodeCount,
    linkCount,

    // 方法
    addNode,
    updateNode,
    deleteNode,
    addLink,
    updateLink,
    deleteLink,
    openNodeModal,
    closeNodeModal,
    openLinkModal,
    closeLinkModal,
    getNodeById,
    getLinksForNode
  }
})
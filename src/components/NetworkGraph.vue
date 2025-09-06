<template>
  <div ref="graphContainer" class="w-full h-full relative">
    <div 
      ref="graphElement" 
      class="absolute inset-0"
    >
    </div>
    
    <div class="absolute top-4 right-4 bg-white rounded-lg shadow-md p-3">
      <div class="flex space-x-2">
        <button 
          @click="zoomIn" 
          class="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-md flex items-center justify-center"
        >
          <i class="fas fa-plus"></i>
        </button>
        <button 
          @click="zoomOut" 
          class="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-md flex items-center justify-center"
        >
          <i class="fas fa-minus"></i>
        </button>
        <button 
          @click="resetView" 
          class="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-md flex items-center justify-center"
        >
          <i class="fas fa-expand"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useNodeStore } from '../stores/nodes'
import { DataSet, Network } from 'vis-network/standalone/esm/vis-network.min.js'

export default {
  name: 'NetworkGraph',
  emits: ['node-selected', 'link-selected'],
  setup(props, { emit }) {
    const graphContainer = ref(null)
    const graphElement = ref(null)
    const nodeStore = useNodeStore()
    let network = null
    
    // 初始化图谱
    const initGraph = () => {
      if (!graphElement.value) return
      
      // 创建节点数据集
      const nodes = new DataSet(getVisNodes())
      
      // 创建边数据集
      const edges = new DataSet(getVisEdges())
      
      // 网络数据
      const data = {
        nodes: nodes,
        edges: edges
      }
      
      // 网络选项
      const options = {
        nodes: {
          shape: 'dot',
          size: 20,
          font: {
            size: 14,
            face: 'Arial',
            color: '#333333'
          },
          borderWidth: 2,
          shadow: true
        },
        edges: {
          width: 2,
          smooth: {
            type: 'continuous'
          },
          color: {
            color: '#94a3b8',
            highlight: '#f472b6'
          },
          arrows: {
            to: {
              enabled: true,
              scaleFactor: 0.5
            }
          },
          font: {
            size: 12,
            face: 'Arial'
          }
        },
        physics: {
          enabled: true,
          stabilization: {
            iterations: 100
          },
          barnesHut: {
            gravitationalConstant: -2000,
            springConstant: 0.01,
            springLength: 150
          }
        },
        interaction: {
          hover: true,
          tooltipDelay: 200,
          navigationButtons: false,
          keyboard: false
        },
        layout: {
          improvedLayout: true,
          hierarchical: false
        }
      }
      
      // 创建网络
      network = new Network(graphElement.value, data, options)
      
      // 添加事件监听器
      network.on('click', handleClick)
      network.on('doubleClick', handleDoubleClick)
      network.on('stabilizationIterationsDone', handleStabilization)
      
      // 监听节点和边的变化
      watch(() => nodeStore.nodes, updateNodes, { deep: true })
      watch(() => nodeStore.links, updateEdges, { deep: true })
    }
    
    // 获取Vis.js节点数据
    const getVisNodes = () => {
      return nodeStore.nodes.map(node => {
        const colorMap = {
          person: { background: '#60a5fa', border: '#3b82f6' },
          company: { background: '#34d399', border: '#10b981' },
          organization: { background: '#fbbf24', border: '#f59e0b' },
          tag: { background: '#f472b6', border: '#ec4899' }
        }
        
        return {
          id: node.id,
          label: node.name,
          color: colorMap[node.type] || { background: '#cbd5e1', border: '#94a3b8' },
          shape: getNodeShape(node.type),
          title: getNodeTooltip(node),
          size: getNodeSize(node)
        }
      })
    }
    
    // 获取Vis.js边数据
    const getVisEdges = () => {
      return nodeStore.links.map(link => {
        const typeMap = {
          connection: '连接',
          employment: '雇佣',
          membership: '成员',
          partnership: '合作',
          tagged: '标记'
        }
        
        return {
          id: link.id,
          from: link.source,
          to: link.target,
          label: typeMap[link.type] || link.type,
          title: link.description || typeMap[link.type] || link.type
        }
      })
    }
    
    // 更新节点
    const updateNodes = () => {
      if (!network) return
      network.body.data.nodes.clear()
      network.body.data.nodes.add(getVisNodes())
    }
    
    // 更新边
    const updateEdges = () => {
      if (!network) return
      network.body.data.edges.clear()
      network.body.data.edges.add(getVisEdges())
    }
    
    // 获取节点形状
    const getNodeShape = (type) => {
      const shapeMap = {
        person: 'circle',
        company: 'box',
        organization: 'ellipse',
        tag: 'diamond'
      }
      return shapeMap[type] || 'circle'
    }
    
    // 获取节点大小
    const getNodeSize = (node) => {
      // 根据连接数调整节点大小
      const connections = nodeStore.getLinksForNode(node.id)
      return 20 + Math.min(connections.length * 2, 10)
    }
    
    // 获取节点提示信息
    const getNodeTooltip = (node) => {
      let tooltip = `<b>${node.name}</b><br/>类型: ${getNodeTypeName(node.type)}`
      
      if (node.description) {
        tooltip += `<br/>描述: ${node.description}`
      }
      
      if (node.type === 'person' && node.position) {
        tooltip += `<br/>职位: ${node.position}`
      }
      
      if (node.type === 'person' && node.contact) {
        tooltip += `<br/>联系方式: ${node.contact}`
      }
      
      const connections = nodeStore.getLinksForNode(node.id)
      tooltip += `<br/>关系数: ${connections.length}`
      
      return tooltip
    }
    
    // 获取节点类型名称
    const getNodeTypeName = (type) => {
      const typeNames = {
        person: '联系人',
        company: '公司',
        organization: '组织',
        tag: '标签'
      }
      return typeNames[type] || '未知类型'
    }
    
    // 处理点击事件
    const handleClick = (params) => {
      if (params.nodes.length > 0) {
        // 点击节点
        const nodeId = params.nodes[0]
        const node = nodeStore.getNodeById(nodeId)
        if (node) {
          emit('node-selected', node)
        }
      } else if (params.edges.length > 0) {
        // 点击边
        const edgeId = params.edges[0]
        const edge = nodeStore.links.find(link => link.id === edgeId)
        if (edge) {
          emit('link-selected', edge)
        }
      } else {
        // 点击空白区域
        emit('node-selected', null)
      }
    }
    
    // 处理双击事件
    const handleDoubleClick = (params) => {
      if (params.nodes.length > 0) {
        // 双击节点
        const nodeId = params.nodes[0]
        const node = nodeStore.getNodeById(nodeId)
        if (node) {
          nodeStore.openNodeModal(node)
        }
      } else if (params.edges.length > 0) {
        // 双击边
        const edgeId = params.edges[0]
        const edge = nodeStore.links.find(link => link.id === edgeId)
        if (edge) {
          nodeStore.openLinkModal(edge)
        }
      }
    }
    
    // 处理网络稳定化
    const handleStabilization = () => {
      // 网络稳定化完成后可以执行一些操作
    }
    
    // 高亮显示节点及其关系
    const highlightNode = (nodeId) => {
      if (!network) return
      
      // 获取与该节点相关的所有节点和边
      const connectedNodes = new Set([nodeId])
      const connectedEdges = []
      
      nodeStore.links.forEach(link => {
        if (link.source === nodeId || link.target === nodeId) {
          connectedNodes.add(link.source)
          connectedNodes.add(link.target)
          connectedEdges.push(link.id)
        }
      })
      
      // 更新节点颜色
      const allNodes = network.body.data.nodes.get()
      allNodes.forEach(node => {
        if (connectedNodes.has(node.id)) {
          node.color = {
            ...node.color,
            border: '#f472b6'
          }
        } else {
          // 淡化未连接节点
          node.color = {
            ...node.color,
            opacity: 0.5
          }
        }
      })
      
      // 更新边颜色
      const allEdges = network.body.data.edges.get()
      allEdges.forEach(edge => {
        if (connectedEdges.includes(edge.id)) {
          edge.color = {
            ...edge.color,
            color: '#f472b6',
            highlight: '#f472b6'
          }
        } else {
          // 淡化未连接边
          edge.color = {
            ...edge.color,
            opacity: 0.3
          }
        }
      })
      
      // 更新网络数据
      network.body.data.nodes.update(allNodes)
      network.body.data.edges.update(allEdges)
    }
    
    // 重置高亮显示
    const resetHighlight = () => {
      if (!network) return
      
      // 恢复所有节点和边的原始颜色
      const allNodes = network.body.data.nodes.get()
      const originalNodes = getVisNodes()
      network.body.data.nodes.update(originalNodes)
      
      const originalEdges = getVisEdges()
      network.body.data.edges.update(originalEdges)
    }
    
    // 编辑关系
    const editLink = (link) => {
      nodeStore.openLinkModal(link)
    }
    
    // 缩放功能
    const zoomIn = () => {
      if (!network) return
      const scale = network.getScale() * 1.2
      network.moveTo({ scale: scale })
    }
    
    const zoomOut = () => {
      if (!network) return
      const scale = network.getScale() / 1.2
      network.moveTo({ scale: scale })
    }
    
    // 重置视图
    const resetView = () => {
      if (!network) return
      network.fit({
        animation: {
          duration: 1000,
          easingFunction: 'easeInOutQuad'
        }
      })
    }
    
    // 组件挂载时初始化
    onMounted(() => {
      nextTick(() => {
        initGraph()
      })
    })
    
    // 组件卸载时清理
    onUnmounted(() => {
      if (network) {
        network.destroy()
      }
    })
    
    return {
      graphContainer,
      graphElement,
      zoomIn,
      zoomOut,
      resetView,
      highlightNode,
      resetHighlight,
      editLink
    }
  }
}
</script>

<style scoped>
.w-full.h-full {
  width: 100%;
  height: 100%;
}
</style>
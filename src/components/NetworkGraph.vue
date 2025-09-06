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
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import { useNodeStore } from '../stores/nodes'
import { useTypeStore } from '../stores/types'
import { DataSet, Network } from 'vis-network/standalone/esm/vis-network.min.js'

export default {
  name: 'NetworkGraph',
  emits: ['node-selected', 'link-selected'],
  setup(props, { emit }) {
    const graphContainer = ref(null)
    const graphElement = ref(null)
    const nodeStore = useNodeStore()
    const typeStore = useTypeStore()
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
      
      // 监听过滤后的节点、边和类型的变化
      watch(() => nodeStore.filteredNodes, updateNodes, { deep: true })
      watch(() => nodeStore.filteredLinks, updateEdges, { deep: true })
      watch(() => nodeStore.nodeTags, updateNodes, { deep: true })
      watch(() => nodeStore.tags, updateNodes, { deep: true })
      watch(() => typeStore.nodeTypes, updateNodes, { deep: true })
      watch(() => typeStore.linkTypes, updateEdges, { deep: true })
    }
    
    // 获取Vis.js节点数据
    const getVisNodes = () => {
      return nodeStore.filteredNodes.map(node => {
        const nodeType = typeStore.getNodeTypeById(node.type) || 
          typeStore.nodeTypes.find(t => t.id === 'person') || 
          { color: '#cbd5e1', shape: 'circle' }
        
        // 获取节点的标签
        const nodeTags = nodeStore.getTagsForNode(node.id)
        
        // 构建标签显示文本
        let tagText = ''
        if (nodeTags.length > 0) {
          tagText = '\n[' + nodeTags.map(tag => tag.name).join(', ') + ']'
        }
        
        return {
          id: node.id,
          label: node.name + tagText,
          color: {
            background: nodeType.color,
            border: darkenColor(nodeType.color, 20)
          },
          shape: nodeType.shape,
          title: getNodeTooltip(node, nodeType, nodeTags),
          size: getNodeSize(node)
        }
      })
    }
    
    // 获取Vis.js边数据
    const getVisEdges = () => {
      return nodeStore.filteredLinks.map(link => {
        const linkType = typeStore.getLinkTypeById(link.type) || { name: link.type, color: '#94a3b8' }
        
        return {
          id: link.id,
          from: link.source,
          to: link.target,
          label: linkType.name,
          title: link.description || linkType.name,
          color: {
            color: linkType.color,
            highlight: '#f472b6'
          }
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
    
    // 获取节点大小
    const getNodeSize = (node) => {
      // 根据连接数调整节点大小
      const connections = nodeStore.getLinksForNode(node.id)
      return 20 + Math.min(connections.length * 2, 10)
    }
    
    // 获取节点提示信息
    const getNodeTooltip = (node, nodeType, nodeTags) => {
      let tooltip = `<b>${node.name}</b><br/>类型: ${nodeType.name}`
      
      if (node.description) {
        tooltip += `<br/>描述: ${node.description}`
      }
      
      if (node.type === 'person' && node.position) {
        tooltip += `<br/>职位: ${node.position}`
      }
      
      if (node.type === 'person' && node.contact) {
        tooltip += `<br/>联系方式: ${node.contact}`
      }
      
      // 添加标签信息
      if (nodeTags.length > 0) {
        tooltip += `<br/>标签: ${nodeTags.map(tag => `<span style="color:${tag.color}">${tag.name}</span>`).join(', ')}`
      }
      
      const connections = nodeStore.getLinksForNode(node.id)
      tooltip += `<br/>关系数: ${connections.length}`
      
      return tooltip
    }
    
    // 加深颜色
    const darkenColor = (color, percent) => {
      let R = parseInt(color.substring(1, 3), 16)
      let G = parseInt(color.substring(3, 5), 16)
      let B = parseInt(color.substring(5, 7), 16)
      
      R = Math.floor(R * (100 - percent) / 100)
      G = Math.floor(G * (100 - percent) / 100)
      B = Math.floor(B * (100 - percent) / 100)
      
      R = (R < 255) ? R : 255
      G = (G < 255) ? G : 255
      B = (B < 255) ? B : 255
      
      const RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16))
      const GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16))
      const BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16))
      
      return "#" + RR + GG + BB
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
      
      nodeStore.filteredLinks.forEach(link => {
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
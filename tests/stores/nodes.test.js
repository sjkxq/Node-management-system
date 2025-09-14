import { createPinia, setActivePinia } from 'pinia'
import { useNodeStore } from '../../src/stores/nodes'
import { beforeEach, describe, it, expect } from 'vitest'

describe('Node Store', () => {
  let store
  
  beforeEach(() => {
    // 创建新的pinia实例并激活
    setActivePinia(createPinia())
    store = useNodeStore()
  })

  it('should initialize with default nodes and links', () => {
    // 检查节点是否正确初始化
    expect(store.nodes).toBeDefined()
    expect(Array.isArray(store.nodes)).toBe(true)
    
    // 检查链接是否正确初始化
    expect(store.links).toBeDefined()
    expect(Array.isArray(store.links)).toBe(true)
  })

  it('should have node management functions', () => {
    // 检查是否包含添加节点的方法
    expect(typeof store.addNode).toBe('function')
    
    // 检查是否包含添加链接的方法
    expect(typeof store.addLink).toBe('function')
    
    // 检查是否包含删除节点的方法
    expect(typeof store.deleteNode).toBe('function')
  })
})
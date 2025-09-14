import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import HighlightSettings from '../../src/components/HighlightSettings.vue'
import { useHighlightStore } from '../../src/stores/highlight'

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn()
}

describe('HighlightSettings', () => {
  let wrapper
  let store

  beforeEach(() => {
    // 创建新的pinia实例并激活
    setActivePinia(createPinia())
    store = useHighlightStore()
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage
    })
    
    // Mock window.alert
    window.alert = vi.fn()
    
    wrapper = mount(HighlightSettings, {
      global: {
        mocks: {
          $t: (msg) => msg
        }
      }
    })
  })

  it('应该渲染高亮设置组件', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('h2').text()).toBe('高亮颜色设置')
  })

  it('应该能够更新节点边框颜色', async () => {
    const newColor = '#ff0000'
    const input = wrapper.findAll('input[type="text"]')[0]
    await input.setValue(newColor)
    
    expect(wrapper.vm.form.nodeBorder).toBe(newColor)
  })

  it('应该能够保存设置', async () => {
    const setHighlightColorsSpy = vi.spyOn(store, 'setHighlightColors')
    const saveButton = wrapper.find('button.px-4.py-2.bg-blue-600')
    await saveButton.trigger('click')
    
    expect(setHighlightColorsSpy).toHaveBeenCalled()
    expect(window.alert).toHaveBeenCalledWith('高亮颜色设置已保存！')
  })
})
import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// 配置Vue Test Utils
config.global.mocks = {
  $t: (msg) => msg // mock i18n $t function
}

// Mock window.ResizeObserver
window.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock IntersectionObserver
window.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// 添加其他全局mock
global.TextEncoder = require('util').TextEncoder
global.TextDecoder = require('util').TextDecoder
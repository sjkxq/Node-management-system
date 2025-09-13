# 节点管理系统

一个基于Vue 3的节点管理系统，用于可视化和管理节点网络结构。

## 技术栈

- Vue 3.4.0
- Pinia 2.1.7 (状态管理)
- vis-network 9.1.2 (网络可视化)
- Tailwind CSS 3.4.0 (样式)
- Vite 5.0.0 (构建工具)

## 安装

```bash
pnpm install
```

## 开发

```bash
# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 构建单文件版本
pnpm build:single

# 预览生产构建
pnpm serve
```

## 测试

本项目使用 Vitest 作为测试框架，Vue Test Utils 用于组件测试。

### 测试命令

```bash
# 运行测试
pnpm test

# 运行测试并查看UI界面
pnpm test:ui

# 运行测试并生成覆盖率报告
pnpm coverage

# 运行测试一次（适用于CI环境）
pnpm test:run
```

### 测试结构

- 单元测试文件以 `.test.js` 结尾
- 测试文件与被测试的源文件放在同一目录下
- `tests/setup.js` 包含测试环境的全局设置

### 测试类型

1. **单元测试** - 测试 Pinia stores 和工具函数
2. **组件测试** - 测试 Vue 组件的行为和渲染

### 测试示例

```javascript
import { createPinia, setActivePinia } from 'pinia'
import { useNodeStore } from './nodes'
import { beforeEach, describe, it, expect } from 'vitest'

describe('Node Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with default nodes and links', () => {
    const store = useNodeStore()
    expect(store.nodes).toHaveLength(5)
  })
})
```
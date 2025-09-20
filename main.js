import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './src/index.css'
import { useThemeStore } from './src/stores/theme'
import { useHighlightStore } from './src/stores/highlight'

// 创建应用实例
const app = createApp(App)

// 使用Pinia状态管理
const pinia = createPinia()
app.use(pinia)

// 初始化主题
const themeStore = useThemeStore()
themeStore.initTheme()

// 初始化高亮颜色
const highlightStore = useHighlightStore()
highlightStore.initHighlightColors()

// 挂载应用
app.mount('#app')
// 类型存储模块
export default {
  // 类型存储的初始状态
  state: () => ({
    // 这里可以定义类型相关的状态
    types: [],
  }),
  
  // 获取类型数据的getter
  getters: {
    getTypes: (state) => state.types,
  },
  
  // 修改状态的mutation
  mutations: {
    SET_TYPES(state, types) {
      state.types = types;
    },
  },
  
  // 异步操作的action
  actions: {
    fetchTypes({ commit }) {
      // 这里可以调用API获取类型数据
      // 假设我们有一个API服务来获取类型数据
      // apiService.fetchTypes().then(types => commit('SET_TYPES', types));
    },
  },
};
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './src/index.css'
import { useThemeStore } from './src/stores/theme'
import { useHighlightStore } from './src/stores/highlight'

// 创建应用实例
const app = createApp(App)

// 使用Pinia状态管理
const pinia = createPinia()
app.use(pinia)

// 初始化主题
const themeStore = useThemeStore()
themeStore.initTheme()

// 初始化高亮颜色
const highlightStore = useHighlightStore()
highlightStore.initHighlightColors()

// 挂载应用
app.mount('#app')
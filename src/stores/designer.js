import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDesignerStore = defineStore('designer', () => {
  // 表单组件列表
  const components = ref([])
  
  // 当前选中的组件ID
  const selectedComponentId = ref(null)
  
  // 表单配置
  const formConfig = ref({
    labelWidth: '100px',
    model: 'conditionParam',
    layout: {
      columns: 3,
      gap: '20px'
    }
  })
  
  // 计算属性：获取选中的组件
  const selectedComponent = computed(() => {
    return components.value.find(comp => comp.id === selectedComponentId.value)
  })
  
  // 添加组件
  function addComponent(componentData) {
    const newComponent = {
      id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...componentData,
      gridPosition: {
        row: Math.floor(components.value.length / formConfig.value.layout.columns) + 1,
        col: (components.value.length % formConfig.value.layout.columns) + 1
      }
    }
    components.value.push(newComponent)
    return newComponent
  }
  
  // 删除组件
  function removeComponent(componentId) {
    const index = components.value.findIndex(comp => comp.id === componentId)
    if (index > -1) {
      components.value.splice(index, 1)
      if (selectedComponentId.value === componentId) {
        selectedComponentId.value = null
      }
    }
  }
  
  // 更新组件属性
  function updateComponent(componentId, updates) {
    const component = components.value.find(comp => comp.id === componentId)
    if (component) {
      Object.assign(component, updates)
    }
  }
  
  // 选中组件
  function selectComponent(componentId) {
    selectedComponentId.value = componentId
  }
  
  // 清空选择
  function clearSelection() {
    selectedComponentId.value = null
  }
  
  // 重置设计器
  function reset() {
    components.value = []
    selectedComponentId.value = null
    formConfig.value = {
      labelWidth: '100px',
      model: 'conditionParam',
      layout: {
        columns: 3,
        gap: '20px'
      }
    }
  }
  
  return {
    components,
    selectedComponentId,
    formConfig,
    selectedComponent,
    addComponent,
    removeComponent,
    updateComponent,
    selectComponent,
    clearSelection,
    reset
  }
})

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  findNextAvailablePosition,
  isValidGridPosition,
  convertPositionToGrid,
  isGridPositionOccupied
} from '@/utils/gridUtils'

export const useDesignerStore = defineStore('designer', () => {
  // 表单组件列表
  const components = ref([])

  // 当前选中的组件ID
  const selectedComponentId = ref(null)

  // 多选组件ID列表
  const selectedComponentIds = ref([])

  // 表单配置
  const formConfig = ref({
    labelWidth: '100px',
    model: 'conditionParam',
    layout: {
      type: 'grid',
      columns: 3,
      rows: 'auto',
      columnGap: '20px',
      rowGap: '20px',
      minRowHeight: '60px',
      showGridLines: true
    }
  })

  // 画布配置
  const canvasConfig = ref({
    showGrid: true,
    snapToGrid: true,
    gridSize: 10,
    zoomLevel: 1,
    width: 1200,
    height: 800
  })

  // 历史记录管理
  const history = ref([])
  const historyIndex = ref(-1)
  const maxHistorySize = 50
  
  // 计算属性：获取选中的组件
  const selectedComponent = computed(() => {
    return components.value.find(comp => comp.id === selectedComponentId.value)
  })

  // 计算属性：是否可以撤销
  const canUndo = computed(() => historyIndex.value > 0)

  // 计算属性：是否可以重做
  const canRedo = computed(() => historyIndex.value < history.value.length - 1)

  // 保存历史状态
  function saveHistory() {
    const currentState = {
      components: JSON.parse(JSON.stringify(components.value)),
      formConfig: JSON.parse(JSON.stringify(formConfig.value)),
      canvasConfig: JSON.parse(JSON.stringify(canvasConfig.value)),
      timestamp: Date.now()
    }

    // 如果当前不在历史记录的末尾，删除后面的记录
    if (historyIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, historyIndex.value + 1)
    }

    // 添加新的历史记录
    history.value.push(currentState)

    // 限制历史记录数量
    if (history.value.length > maxHistorySize) {
      history.value.shift()
    } else {
      historyIndex.value++
    }
  }
  
  // 添加组件
  function addComponent(componentData) {
    saveHistory() // 保存历史状态

    // 查找下一个可用的Grid位置
    const gridPosition = findNextAvailablePosition(
      formConfig.value.layout,
      components.value,
      1,
      1
    )

    const newComponent = {
      id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...componentData,
      // 使用Grid位置作为主要定位方式
      gridPosition: {
        column: gridPosition.column,
        row: gridPosition.row,
        columnSpan: 1,
        rowSpan: 1
      }
    }
    components.value.push(newComponent)
    return newComponent
  }
  
  // 删除组件
  function removeComponent(componentId) {
    saveHistory() // 保存历史状态

    const index = components.value.findIndex(comp => comp.id === componentId)
    if (index > -1) {
      components.value.splice(index, 1)
      if (selectedComponentId.value === componentId) {
        selectedComponentId.value = null
      }
      // 从多选列表中移除
      const multiIndex = selectedComponentIds.value.indexOf(componentId)
      if (multiIndex > -1) {
        selectedComponentIds.value.splice(multiIndex, 1)
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
    selectedComponentIds.value = componentId ? [componentId] : []
  }

  // 多选组件
  function toggleComponentSelection(componentId) {
    const index = selectedComponentIds.value.indexOf(componentId)
    if (index > -1) {
      selectedComponentIds.value.splice(index, 1)
    } else {
      selectedComponentIds.value.push(componentId)
    }

    // 更新单选状态
    if (selectedComponentIds.value.length === 1) {
      selectedComponentId.value = selectedComponentIds.value[0]
    } else {
      selectedComponentId.value = null
    }
  }

  // 清空选择
  function clearSelection() {
    selectedComponentId.value = null
    selectedComponentIds.value = []
  }
  
  // 撤销操作
  function undo() {
    if (canUndo.value) {
      historyIndex.value--
      const state = history.value[historyIndex.value]
      components.value = JSON.parse(JSON.stringify(state.components))
      formConfig.value = JSON.parse(JSON.stringify(state.formConfig))
      canvasConfig.value = JSON.parse(JSON.stringify(state.canvasConfig))
      clearSelection()
    }
  }

  // 重做操作
  function redo() {
    if (canRedo.value) {
      historyIndex.value++
      const state = history.value[historyIndex.value]
      components.value = JSON.parse(JSON.stringify(state.components))
      formConfig.value = JSON.parse(JSON.stringify(state.formConfig))
      canvasConfig.value = JSON.parse(JSON.stringify(state.canvasConfig))
      clearSelection()
    }
  }

  // 更新画布配置
  function updateCanvasConfig(updates) {
    Object.assign(canvasConfig.value, updates)
  }

  // 复制组件
  function copyComponent(componentId) {
    const component = components.value.find(comp => comp.id === componentId)
    if (component) {
      return JSON.parse(JSON.stringify(component))
    }
    return null
  }

  // 粘贴组件
  function pasteComponent(componentData) {
    if (componentData) {
      saveHistory()
      const newComponent = {
        ...componentData,
        id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        position: {
          ...componentData.position,
          x: componentData.position.x + 20,
          y: componentData.position.y + 20,
          zIndex: components.value.length + 1
        }
      }
      components.value.push(newComponent)
      selectComponent(newComponent.id)
      return newComponent
    }
    return null
  }

  // 更新Grid布局配置
  function updateGridLayout(layoutConfig) {
    saveHistory()
    formConfig.value.layout = {
      ...formConfig.value.layout,
      ...layoutConfig
    }
  }

  // 更新组件Grid位置
  function updateComponentGridPosition(componentId, gridPosition) {
    const component = components.value.find(comp => comp.id === componentId)
    if (component) {
      // 验证Grid位置是否有效
      if (isValidGridPosition(
        gridPosition.column,
        gridPosition.row,
        gridPosition.columnSpan || 1,
        gridPosition.rowSpan || 1,
        formConfig.value.layout
      )) {
        // 检查是否与其他组件冲突
        if (!isGridPositionOccupied(
          gridPosition.column,
          gridPosition.row,
          gridPosition.columnSpan || 1,
          gridPosition.rowSpan || 1,
          components.value,
          componentId
        )) {
          component.gridPosition = {
            ...component.gridPosition,
            ...gridPosition
          }
        }
      }
    }
  }

  // 自动排列所有组件到Grid
  function autoArrangeComponents() {
    saveHistory()
    components.value.forEach((component, index) => {
      const gridPosition = findNextAvailablePosition(
        formConfig.value.layout,
        components.value.slice(0, index),
        component.gridPosition?.columnSpan || 1,
        component.gridPosition?.rowSpan || 1
      )
      component.gridPosition = {
        column: gridPosition.column,
        row: gridPosition.row,
        columnSpan: component.gridPosition?.columnSpan || 1,
        rowSpan: component.gridPosition?.rowSpan || 1
      }
    })
  }

  // 重置设计器
  function reset() {
    saveHistory()
    components.value = []
    selectedComponentId.value = null
    selectedComponentIds.value = []
    formConfig.value = {
      labelWidth: '100px',
      model: 'conditionParam',
      layout: {
        type: 'grid',
        columns: 3,
        rows: 'auto',
        columnGap: '20px',
        rowGap: '20px',
        minRowHeight: '60px',
        showGridLines: true
      }
    }
    canvasConfig.value = {
      showGrid: true,
      snapToGrid: true,
      gridSize: 10,
      zoomLevel: 1,
      width: 1200,
      height: 800
    }
  }
  
  // 初始化历史记录
  function initHistory() {
    const initialState = {
      components: [],
      formConfig: JSON.parse(JSON.stringify(formConfig.value)),
      canvasConfig: JSON.parse(JSON.stringify(canvasConfig.value)),
      timestamp: Date.now()
    }
    history.value = [initialState]
    historyIndex.value = 0
  }

  // 初始化
  initHistory()

  return {
    components,
    selectedComponentId,
    selectedComponentIds,
    formConfig,
    canvasConfig,
    selectedComponent,
    canUndo,
    canRedo,
    addComponent,
    removeComponent,
    updateComponent,

    selectComponent,
    toggleComponentSelection,
    clearSelection,
    undo,
    redo,
    updateCanvasConfig,
    copyComponent,
    pasteComponent,
    reset,
    saveHistory,
    // Grid相关方法
    updateGridLayout,
    updateComponentGridPosition,
    autoArrangeComponents
  }
})

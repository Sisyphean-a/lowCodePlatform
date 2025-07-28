<template>
  <div class="grid-layout-framework">
    <!-- Grid容器 -->
    <div
      ref="gridContainer"
      class="grid-container"
      :style="gridContainerStyles"
      @drop="handleDrop"
      @dragover="handleDragOver"
      @dragenter="handleDragEnter"
      @dragleave="handleDragLeave"
    >
      <!-- Grid网格线 -->
      <div
        v-if="gridConfig.showGridLines"
        class="grid-lines"
        :style="gridLinesStyles"
      ></div>

      <!-- 拖拽悬停指示器 -->
      <div
        v-if="dragHoverCell"
        class="drag-hover-indicator"
        :style="getDragHoverStyles()"
      ></div>

      <!-- 组件渲染 -->
      <div
        v-for="component in components"
        :key="component.id"
        class="grid-item"
        :class="{ 
          'selected': selectedComponentIds.includes(component.id),
          'multi-selected': selectedComponentIds.length > 1 && selectedComponentIds.includes(component.id)
        }"
        :style="getGridItemStyles(component)"
        @mousedown="handleComponentMouseDown($event, component.id)"
        @click="handleComponentClick($event, component.id)"
      >
        <!-- 组件内容 -->
        <ComponentRenderer :component="component" />
        
        <!-- 选中状态的调整手柄 -->
        <div
          v-if="selectedComponentIds.includes(component.id)"
          class="resize-handles"
        >
          <div
            v-for="direction in resizeDirections"
            :key="direction"
            :class="`resize-handle resize-${direction}`"
            @mousedown="handleResizeStart($event, component.id, direction)"
          ></div>
        </div>
      </div>

      <!-- 空状态提示 -->
      <div v-if="components.length === 0" class="empty-state">
        <v-icon size="64" color="grey-lighten-1">mdi-grid</v-icon>
        <p class="text-grey-lighten-1 mt-4">从左侧拖拽组件到网格中开始设计</p>
        <p class="text-grey-lighten-2 mt-2">组件将自动对齐到网格单元格</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useDesignerStore } from '@/stores/designer'
import { useComponentsStore } from '@/stores/components'
import ComponentRenderer from '@/modules/DragArea/ComponentRenderer.vue'
import {
  getGridContainerStyles,
  getGridItemStyles as getGridItemStylesUtil,
  getGridLinesStyles,
  pixelToGridPosition,
  gridToPixelPosition,
  isGridPositionOccupied,
  findNextAvailablePosition
} from '@/utils/gridUtils'

const designerStore = useDesignerStore()
const componentsStore = useComponentsStore()

// 响应式数据
const gridContainer = ref(null)
const dragHoverCell = ref(null)
const isDragging = ref(false)
const isResizing = ref(false)
const draggedComponentId = ref(null)
const resizeDirection = ref('')

// 计算属性
const components = computed(() => designerStore.components)
const selectedComponentIds = computed(() => designerStore.selectedComponentIds)
const gridConfig = computed(() => designerStore.formConfig.layout)

// Grid容器样式
const gridContainerStyles = computed(() => {
  return getGridContainerStyles(gridConfig.value)
})

// Grid网格线样式
const gridLinesStyles = computed(() => {
  return getGridLinesStyles(gridConfig.value)
})

// 调整手柄方向
const resizeDirections = ['se'] // 只支持右下角调整

// 获取组件Grid样式
const getGridItemStyles = (component) => {
  if (!component.gridPosition) return {}
  
  const baseStyles = getGridItemStylesUtil(component.gridPosition)
  
  return {
    ...baseStyles,
    position: 'relative',
    minHeight: '40px',
    border: selectedComponentIds.value.includes(component.id) ? '2px solid #1976D2' : '1px solid transparent',
    borderRadius: '4px',
    cursor: 'pointer'
  }
}

// 获取拖拽悬停样式
const getDragHoverStyles = () => {
  if (!dragHoverCell.value || !gridContainer.value) return {}
  
  const { column, row } = dragHoverCell.value
  const pixelPos = gridToPixelPosition(column, row, gridConfig.value, gridContainer.value)
  
  return {
    position: 'absolute',
    left: pixelPos.x + 'px',
    top: pixelPos.y + 'px',
    width: pixelPos.width + 'px',
    height: pixelPos.height + 'px',
    backgroundColor: 'rgba(25, 118, 210, 0.2)',
    border: '2px dashed #1976D2',
    borderRadius: '4px',
    pointerEvents: 'none',
    zIndex: 1000
  }
}

// 拖拽处理
const handleDragOver = (event) => {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'copy'
  
  // 计算悬停的Grid单元格
  if (gridContainer.value) {
    const rect = gridContainer.value.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    dragHoverCell.value = pixelToGridPosition(x, y, gridConfig.value, gridContainer.value)
  }
}

const handleDragEnter = (event) => {
  event.preventDefault()
}

const handleDragLeave = (event) => {
  if (!event.currentTarget.contains(event.relatedTarget)) {
    dragHoverCell.value = null
  }
}

const handleDrop = (event) => {
  event.preventDefault()
  dragHoverCell.value = null

  try {
    const data = JSON.parse(event.dataTransfer.getData('application/json'))

    if (data.type === 'component' && gridContainer.value) {
      const rect = gridContainer.value.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      
      const gridPos = pixelToGridPosition(x, y, gridConfig.value, gridContainer.value)
      
      // 检查位置是否被占用
      if (!isGridPositionOccupied(gridPos.column, gridPos.row, 1, 1, components.value)) {
        const componentInstance = componentsStore.createComponentInstance(data.componentType)
        
        // 设置Grid位置
        componentInstance.gridPosition = {
          column: gridPos.column,
          row: gridPos.row,
          columnSpan: 1,
          rowSpan: 1
        }

        const newComponent = designerStore.addComponent(componentInstance)
        designerStore.selectComponent(newComponent.id)
      } else {
        // 如果位置被占用，找下一个可用位置
        const availablePos = findNextAvailablePosition(gridConfig.value, components.value, 1, 1)
        const componentInstance = componentsStore.createComponentInstance(data.componentType)
        
        componentInstance.gridPosition = {
          column: availablePos.column,
          row: availablePos.row,
          columnSpan: 1,
          rowSpan: 1
        }

        const newComponent = designerStore.addComponent(componentInstance)
        designerStore.selectComponent(newComponent.id)
      }
    }
  } catch (error) {
    console.error('处理拖拽数据失败:', error)
  }
}

// 组件交互处理
const handleComponentMouseDown = (event, componentId) => {
  if (event.button !== 0) return // 只处理左键
  
  event.preventDefault()
  event.stopPropagation()

  if (!selectedComponentIds.value.includes(componentId)) {
    if (event.ctrlKey || event.metaKey) {
      designerStore.toggleComponentSelection(componentId)
    } else {
      designerStore.selectComponent(componentId)
    }
  }

  // 开始拖拽
  isDragging.value = true
  draggedComponentId.value = componentId

  document.addEventListener('mousemove', handleComponentDrag)
  document.addEventListener('mouseup', handleComponentDragEnd)
}

const handleComponentClick = (event, componentId) => {
  event.stopPropagation()
}

// 组件拖拽
const handleComponentDrag = (event) => {
  if (!isDragging.value || !draggedComponentId.value || !gridContainer.value) return

  const rect = gridContainer.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  const newGridPos = pixelToGridPosition(x, y, gridConfig.value, gridContainer.value)
  
  // 检查新位置是否可用
  if (!isGridPositionOccupied(
    newGridPos.column, 
    newGridPos.row, 
    1, 
    1, 
    components.value, 
    draggedComponentId.value
  )) {
    designerStore.updateComponentGridPosition(draggedComponentId.value, newGridPos)
  }
}

const handleComponentDragEnd = () => {
  isDragging.value = false
  draggedComponentId.value = null

  document.removeEventListener('mousemove', handleComponentDrag)
  document.removeEventListener('mouseup', handleComponentDragEnd)
}

// 调整大小处理
const handleResizeStart = (event, componentId, direction) => {
  event.preventDefault()
  event.stopPropagation()

  isResizing.value = true
  draggedComponentId.value = componentId
  resizeDirection.value = direction

  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', handleResizeEnd)
}

const handleResize = (event) => {
  // 调整大小逻辑（暂时简化，只支持基本的跨度调整）
  // 可以根据需要扩展更复杂的调整逻辑
}

const handleResizeEnd = () => {
  isResizing.value = false
  draggedComponentId.value = null
  resizeDirection.value = ''

  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', handleResizeEnd)
}

// 生命周期
onMounted(() => {
  // 初始化时自动排列组件
  nextTick(() => {
    if (components.value.length > 0) {
      designerStore.autoArrangeComponents()
    }
  })
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleComponentDrag)
  document.removeEventListener('mouseup', handleComponentDragEnd)
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', handleResizeEnd)
})
</script>

<style scoped>
.grid-layout-framework {
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 20px;
  background-color: #fafafa;
}

.grid-container {
  position: relative;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  min-height: 400px;
}

.grid-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  opacity: 0.5;
}

.grid-item {
  transition: all 0.2s ease;
  background-color: #f8f9fa;
  border-radius: 4px;
  overflow: hidden;
}

.grid-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.grid-item.selected {
  box-shadow: 0 0 0 2px #1976D2;
}

.grid-item.multi-selected {
  box-shadow: 0 0 0 2px #FF9800;
}

.resize-handles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.resize-handle {
  position: absolute;
  background-color: #1976D2;
  border: 1px solid white;
  border-radius: 2px;
  pointer-events: all;
  z-index: 1001;
}

.resize-se {
  width: 8px;
  height: 8px;
  bottom: -4px;
  right: -4px;
  cursor: se-resize;
}

.empty-state {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
  color: #9e9e9e;
}

.drag-hover-indicator {
  transition: all 0.1s ease;
}
</style>

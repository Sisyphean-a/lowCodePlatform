<template>
  <div class="drag-area">
    <div class="canvas-wrapper" ref="canvasWrapper">
      <!-- Grid布局框架 -->
      <GridLayoutFramework />

      <!-- 保留原有的自由定位画布（可选切换） -->
      <div v-if="false" class="legacy-canvas">
        <!-- 画布背景网格 -->
        <div
          class="canvas-background"
          :class="{ 'show-grid': canvasConfig.showGrid }"
          :style="canvasBackgroundStyle"
        ></div>

        <!-- 主画布区域 -->
        <div
          class="design-canvas"
          :class="{ 'drag-over': isDragOver }"
          :style="canvasStyle"
          @drop="handleDrop"
          @dragover="handleDragOver"
          @dragenter="handleDragEnter"
          @dragleave="handleDragLeave"
          @click="handleCanvasClick"
          ref="canvas"
        >
          <!-- 空状态提示 -->
          <div v-if="components.length === 0" class="empty-state">
            <v-icon size="64" color="grey-lighten-1">mdi-drag</v-icon>
            <p class="text-grey-lighten-1 mt-4">从左侧拖拽组件到这里开始设计</p>
            <p class="text-grey-lighten-2 mt-2">支持自由拖拽定位和调整大小</p>
          </div>

        <!-- 组件渲染区域 -->
        <div v-else class="components-container">
          <div
            v-for="component in sortedComponents"
            :key="component.id"
            class="draggable-component"
            :class="{
              'selected': selectedComponentId === component.id,
              'multi-selected': selectedComponentIds.includes(component.id) && selectedComponentIds.length > 1
            }"
            :style="getComponentStyle(component)"
            @mousedown="handleComponentMouseDown($event, component.id)"
            @click.stop="selectComponent(component.id)"
          >
            <!-- 组件内容 -->
            <div class="component-content">
              <ComponentRenderer :component="component" />
            </div>

            <!-- 选中状态的操作手柄 -->
            <div v-if="selectedComponentId === component.id" class="component-handles">
              <!-- 调整大小手柄 -->
              <div
                class="resize-handle resize-handle-nw"
                @mousedown.stop="handleResizeStart($event, component.id, 'nw')"
              ></div>
              <div
                class="resize-handle resize-handle-ne"
                @mousedown.stop="handleResizeStart($event, component.id, 'ne')"
              ></div>
              <div
                class="resize-handle resize-handle-sw"
                @mousedown.stop="handleResizeStart($event, component.id, 'sw')"
              ></div>
              <div
                class="resize-handle resize-handle-se"
                @mousedown.stop="handleResizeStart($event, component.id, 'se')"
              ></div>

              <!-- 操作按钮 -->
              <div class="component-actions">
                <v-btn
                  icon
                  size="x-small"
                  color="primary"
                  variant="elevated"
                  @click.stop="copyComponent(component.id)"
                >
                  <v-icon size="12">mdi-content-copy</v-icon>
                </v-btn>
                <v-btn
                  icon
                  size="x-small"
                  color="error"
                  variant="elevated"
                  @click.stop="removeComponent(component.id)"
                >
                  <v-icon size="12">mdi-delete</v-icon>
                </v-btn>
              </div>
            </div>
          </div>
        </div>

          <!-- 选择框 -->
          <div
            v-if="selectionBox.visible"
            class="selection-box"
            :style="selectionBoxStyle"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useDesignerStore } from '@/stores/designer'
import { useComponentsStore } from '@/stores/components'
import ComponentRenderer from './ComponentRenderer.vue'
import { GridLayoutFramework } from '@/modules/GridLayout'

const designerStore = useDesignerStore()
const componentsStore = useComponentsStore()

// 模板引用
const canvas = ref(null)
const canvasWrapper = ref(null)

// 拖拽状态
const isDragOver = ref(false)
const isDragging = ref(false)
const isResizing = ref(false)
const dragStartPos = ref({ x: 0, y: 0 })
const dragStartComponentPos = ref({ x: 0, y: 0 })
const resizeStartPos = ref({ x: 0, y: 0 })
const resizeStartSize = ref({ width: 0, height: 0 })
const resizeDirection = ref('')
const draggedComponentId = ref(null)

// 选择框状态
const selectionBox = ref({
  visible: false,
  startX: 0,
  startY: 0,
  endX: 0,
  endY: 0
})

// 复制的组件数据
const copiedComponent = ref(null)

// 计算属性
const components = computed(() => designerStore.components)
const selectedComponentId = computed(() => designerStore.selectedComponentId)
const selectedComponentIds = computed(() => designerStore.selectedComponentIds)
const canvasConfig = computed(() => designerStore.canvasConfig)

// 按z-index排序的组件
const sortedComponents = computed(() => {
  return [...components.value].sort((a, b) => (a.position?.zIndex || 0) - (b.position?.zIndex || 0))
})

// 画布样式
const canvasStyle = computed(() => ({
  width: canvasConfig.value.width + 'px',
  height: canvasConfig.value.height + 'px',
  transform: `scale(${canvasConfig.value.zoomLevel})`,
  transformOrigin: 'top left'
}))

// 画布背景样式
const canvasBackgroundStyle = computed(() => ({
  backgroundSize: `${canvasConfig.value.gridSize}px ${canvasConfig.value.gridSize}px`,
  transform: `scale(${canvasConfig.value.zoomLevel})`,
  transformOrigin: 'top left',
  width: canvasConfig.value.width + 'px',
  height: canvasConfig.value.height + 'px'
}))

// 选择框样式
const selectionBoxStyle = computed(() => ({
  left: Math.min(selectionBox.value.startX, selectionBox.value.endX) + 'px',
  top: Math.min(selectionBox.value.startY, selectionBox.value.endY) + 'px',
  width: Math.abs(selectionBox.value.endX - selectionBox.value.startX) + 'px',
  height: Math.abs(selectionBox.value.endY - selectionBox.value.startY) + 'px'
}))

// 获取组件样式
const getComponentStyle = (component) => {
  const pos = component.position || { x: 0, y: 0, width: 200, height: 40, zIndex: 1 }
  return {
    position: 'absolute',
    left: pos.x + 'px',
    top: pos.y + 'px',
    width: pos.width + 'px',
    height: pos.height + 'px',
    zIndex: pos.zIndex || 1
  }
}

// 获取鼠标在画布中的位置
const getCanvasPosition = (event) => {
  const rect = canvas.value.getBoundingClientRect()
  const zoom = canvasConfig.value.zoomLevel
  return {
    x: (event.clientX - rect.left) / zoom,
    y: (event.clientY - rect.top) / zoom
  }
}

// 网格吸附
const snapToGrid = (value) => {
  if (!canvasConfig.value.snapToGrid) return value
  const gridSize = canvasConfig.value.gridSize
  return Math.round(value / gridSize) * gridSize
}

// 拖拽处理
const handleDragOver = (event) => {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'copy'
}

const handleDragEnter = (event) => {
  event.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = (event) => {
  if (!event.currentTarget.contains(event.relatedTarget)) {
    isDragOver.value = false
  }
}

const handleDrop = (event) => {
  event.preventDefault()
  isDragOver.value = false

  try {
    const data = JSON.parse(event.dataTransfer.getData('application/json'))

    if (data.type === 'component') {
      const canvasPos = getCanvasPosition(event)
      const componentInstance = componentsStore.createComponentInstance(data.componentType)

      // 设置组件位置
      componentInstance.position = {
        x: snapToGrid(canvasPos.x - 100), // 居中放置
        y: snapToGrid(canvasPos.y - 20),
        width: 200,
        height: 40,
        zIndex: components.value.length + 1
      }

      const newComponent = designerStore.addComponent(componentInstance)
      designerStore.selectComponent(newComponent.id)
    }
  } catch (error) {
    console.error('处理拖拽数据失败:', error)
  }
}

// 画布点击处理
const handleCanvasClick = (event) => {
  if (event.target === canvas.value) {
    designerStore.clearSelection()
  }
}

// 组件鼠标按下处理
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
  dragStartPos.value = getCanvasPosition(event)

  const component = components.value.find(c => c.id === componentId)
  if (component && component.position) {
    dragStartComponentPos.value = { x: component.position.x, y: component.position.y }
  }

  document.addEventListener('mousemove', handleComponentDrag)
  document.addEventListener('mouseup', handleComponentDragEnd)
}

// 组件拖拽处理
const handleComponentDrag = (event) => {
  if (!isDragging.value || !draggedComponentId.value) return

  const currentPos = getCanvasPosition(event)
  const deltaX = currentPos.x - dragStartPos.value.x
  const deltaY = currentPos.y - dragStartPos.value.y

  const newX = snapToGrid(dragStartComponentPos.value.x + deltaX)
  const newY = snapToGrid(dragStartComponentPos.value.y + deltaY)

  // 更新组件位置
  designerStore.updateComponentPosition(draggedComponentId.value, { x: newX, y: newY })
}

// 组件拖拽结束
const handleComponentDragEnd = () => {
  isDragging.value = false
  draggedComponentId.value = null

  document.removeEventListener('mousemove', handleComponentDrag)
  document.removeEventListener('mouseup', handleComponentDragEnd)
}

// 调整大小开始
const handleResizeStart = (event, componentId, direction) => {
  event.preventDefault()
  event.stopPropagation()

  isResizing.value = true
  draggedComponentId.value = componentId
  resizeDirection.value = direction
  resizeStartPos.value = getCanvasPosition(event)

  const component = components.value.find(c => c.id === componentId)
  if (component && component.position) {
    resizeStartSize.value = {
      width: component.position.width,
      height: component.position.height,
      x: component.position.x,
      y: component.position.y
    }
  }

  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', handleResizeEnd)
}

// 调整大小处理
const handleResize = (event) => {
  if (!isResizing.value || !draggedComponentId.value) return

  const currentPos = getCanvasPosition(event)
  const deltaX = currentPos.x - resizeStartPos.value.x
  const deltaY = currentPos.y - resizeStartPos.value.y

  const component = components.value.find(c => c.id === draggedComponentId.value)
  if (!component) return

  let newWidth = resizeStartSize.value.width
  let newHeight = resizeStartSize.value.height
  let newX = resizeStartSize.value.x
  let newY = resizeStartSize.value.y

  // 根据调整方向计算新尺寸
  switch (resizeDirection.value) {
    case 'se': // 右下角
      newWidth = Math.max(50, resizeStartSize.value.width + deltaX)
      newHeight = Math.max(20, resizeStartSize.value.height + deltaY)
      break
    case 'sw': // 左下角
      newWidth = Math.max(50, resizeStartSize.value.width - deltaX)
      newHeight = Math.max(20, resizeStartSize.value.height + deltaY)
      newX = resizeStartSize.value.x + deltaX
      break
    case 'ne': // 右上角
      newWidth = Math.max(50, resizeStartSize.value.width + deltaX)
      newHeight = Math.max(20, resizeStartSize.value.height - deltaY)
      newY = resizeStartSize.value.y + deltaY
      break
    case 'nw': // 左上角
      newWidth = Math.max(50, resizeStartSize.value.width - deltaX)
      newHeight = Math.max(20, resizeStartSize.value.height - deltaY)
      newX = resizeStartSize.value.x + deltaX
      newY = resizeStartSize.value.y + deltaY
      break
  }

  // 应用网格吸附
  newWidth = snapToGrid(newWidth)
  newHeight = snapToGrid(newHeight)
  newX = snapToGrid(newX)
  newY = snapToGrid(newY)

  designerStore.updateComponentPosition(draggedComponentId.value, {
    x: newX,
    y: newY,
    width: newWidth,
    height: newHeight
  })
}

// 调整大小结束
const handleResizeEnd = () => {
  isResizing.value = false
  draggedComponentId.value = null
  resizeDirection.value = ''

  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', handleResizeEnd)
}

// 组件操作
const selectComponent = (componentId) => {
  designerStore.selectComponent(componentId)
}

const removeComponent = (componentId) => {
  designerStore.removeComponent(componentId)
}

const copyComponent = (componentId) => {
  copiedComponent.value = designerStore.copyComponent(componentId)
}

// 清理事件监听器
onUnmounted(() => {
  document.removeEventListener('mousemove', handleComponentDrag)
  document.removeEventListener('mouseup', handleComponentDragEnd)
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', handleResizeEnd)
})
</script>

<style scoped>
.drag-area {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.canvas-wrapper {
  height: 100%;
  width: 100%;
  overflow: auto;
  position: relative;
  background-color: #f8f9fa;
}

.canvas-background {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 0;
}

.canvas-background.show-grid {
  background-image:
    linear-gradient(to right, #e0e0e0 1px, transparent 1px),
    linear-gradient(to bottom, #e0e0e0 1px, transparent 1px);
}

.design-canvas {
  position: relative;
  background-color: white;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 20px;
  min-height: 600px;
  cursor: default;
  user-select: none;
}

.design-canvas.drag-over {
  border-color: #1976D2;
  background-color: rgba(25, 118, 210, 0.05);
}

.empty-state {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
}

.components-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.draggable-component {
  border: 2px solid transparent;
  border-radius: 4px;
  transition: all 0.2s ease;
  cursor: move;
  background-color: rgba(255, 255, 255, 0.9);
}

.draggable-component:hover {
  border-color: #e3f2fd;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.15);
}

.draggable-component.selected {
  border-color: #1976D2;
  box-shadow: 0 0 0 1px #1976D2, 0 4px 12px rgba(25, 118, 210, 0.25);
}

.draggable-component.multi-selected {
  border-color: #ff9800;
  box-shadow: 0 0 0 1px #ff9800, 0 4px 12px rgba(255, 152, 0, 0.25);
}

.component-content {
  width: 100%;
  height: 100%;
  padding: 8px;
  overflow: hidden;
}

.component-handles {
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
  border: 2px solid white;
  border-radius: 50%;
  width: 8px;
  height: 8px;
  pointer-events: all;
  z-index: 10;
}

.resize-handle-nw {
  top: -4px;
  left: -4px;
  cursor: nw-resize;
}

.resize-handle-ne {
  top: -4px;
  right: -4px;
  cursor: ne-resize;
}

.resize-handle-sw {
  bottom: -4px;
  left: -4px;
  cursor: sw-resize;
}

.resize-handle-se {
  bottom: -4px;
  right: -4px;
  cursor: se-resize;
}

.component-actions {
  position: absolute;
  top: -16px;
  right: -16px;
  display: flex;
  gap: 4px;
  pointer-events: all;
  z-index: 11;
}

.selection-box {
  position: absolute;
  border: 1px dashed #1976D2;
  background-color: rgba(25, 118, 210, 0.1);
  pointer-events: none;
  z-index: 100;
}

/* 滚动条样式 */
.canvas-wrapper::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

.canvas-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 6px;
}

.canvas-wrapper::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 6px;
}

.canvas-wrapper::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.canvas-wrapper::-webkit-scrollbar-corner {
  background: #f1f1f1;
}
</style>

<template>
  <v-card flat class="toolbar-card">
    <v-card-text class="pa-2">
      <div class="toolbar-content">
        <!-- 左侧：基础操作 -->
        <div class="toolbar-section">
          <v-btn-group variant="outlined" size="small">
            <v-btn @click="undo" :disabled="!canUndo">
              <v-icon>mdi-undo</v-icon>
              <v-tooltip activator="parent" location="bottom">撤销 (Ctrl+Z)</v-tooltip>
            </v-btn>
            <v-btn @click="redo" :disabled="!canRedo">
              <v-icon>mdi-redo</v-icon>
              <v-tooltip activator="parent" location="bottom">重做 (Ctrl+Y)</v-tooltip>
            </v-btn>
          </v-btn-group>
          
          <v-divider vertical class="mx-2"></v-divider>
          
          <v-btn-group variant="outlined" size="small">
            <v-btn @click="copy" :disabled="!hasSelection">
              <v-icon>mdi-content-copy</v-icon>
              <v-tooltip activator="parent" location="bottom">复制 (Ctrl+C)</v-tooltip>
            </v-btn>
            <v-btn @click="paste" :disabled="!canPaste">
              <v-icon>mdi-content-paste</v-icon>
              <v-tooltip activator="parent" location="bottom">粘贴 (Ctrl+V)</v-tooltip>
            </v-btn>
            <v-btn @click="deleteSelected" :disabled="!hasSelection" color="error">
              <v-icon>mdi-delete</v-icon>
              <v-tooltip activator="parent" location="bottom">删除 (Delete)</v-tooltip>
            </v-btn>
          </v-btn-group>
        </div>
        
        <!-- 中间：对齐工具 -->
        <div class="toolbar-section">
          <v-btn-group variant="outlined" size="small" :disabled="!hasMultipleSelection">
            <v-btn @click="alignLeft">
              <v-icon>mdi-format-align-left</v-icon>
              <v-tooltip activator="parent" location="bottom">左对齐</v-tooltip>
            </v-btn>
            <v-btn @click="alignCenter">
              <v-icon>mdi-format-align-center</v-icon>
              <v-tooltip activator="parent" location="bottom">水平居中</v-tooltip>
            </v-btn>
            <v-btn @click="alignRight">
              <v-icon>mdi-format-align-right</v-icon>
              <v-tooltip activator="parent" location="bottom">右对齐</v-tooltip>
            </v-btn>
          </v-btn-group>
          
          <v-btn-group variant="outlined" size="small" class="ml-2" :disabled="!hasMultipleSelection">
            <v-btn @click="alignTop">
              <v-icon>mdi-format-align-top</v-icon>
              <v-tooltip activator="parent" location="bottom">顶部对齐</v-tooltip>
            </v-btn>
            <v-btn @click="alignMiddle">
              <v-icon>mdi-format-align-middle</v-icon>
              <v-tooltip activator="parent" location="bottom">垂直居中</v-tooltip>
            </v-btn>
            <v-btn @click="alignBottom">
              <v-icon>mdi-format-align-bottom</v-icon>
              <v-tooltip activator="parent" location="bottom">底部对齐</v-tooltip>
            </v-btn>
          </v-btn-group>
          
          <v-divider vertical class="mx-2"></v-divider>
          
          <v-btn-group variant="outlined" size="small" :disabled="!hasMultipleSelection">
            <v-btn @click="distributeHorizontally">
              <v-icon>mdi-distribute-horizontal-left</v-icon>
              <v-tooltip activator="parent" location="bottom">水平分布</v-tooltip>
            </v-btn>
            <v-btn @click="distributeVertically">
              <v-icon>mdi-distribute-vertical-top</v-icon>
              <v-tooltip activator="parent" location="bottom">垂直分布</v-tooltip>
            </v-btn>
          </v-btn-group>
        </div>
        
        <!-- 右侧：层级和其他操作 -->
        <div class="toolbar-section">
          <v-btn-group variant="outlined" size="small" :disabled="!hasSelection">
            <v-btn @click="bringToFront">
              <v-icon>mdi-bring-to-front</v-icon>
              <v-tooltip activator="parent" location="bottom">置于顶层</v-tooltip>
            </v-btn>
            <v-btn @click="sendToBack">
              <v-icon>mdi-send-to-back</v-icon>
              <v-tooltip activator="parent" location="bottom">置于底层</v-tooltip>
            </v-btn>
            <v-btn @click="bringForward">
              <v-icon>mdi-chevron-up</v-icon>
              <v-tooltip activator="parent" location="bottom">上移一层</v-tooltip>
            </v-btn>
            <v-btn @click="sendBackward">
              <v-icon>mdi-chevron-down</v-icon>
              <v-tooltip activator="parent" location="bottom">下移一层</v-tooltip>
            </v-btn>
          </v-btn-group>
          
          <v-divider vertical class="mx-2"></v-divider>
          
          <v-btn-group variant="outlined" size="small">
            <v-btn @click="toggleGrid">
              <v-icon>{{ showGrid ? 'mdi-grid' : 'mdi-grid-off' }}</v-icon>
              <v-tooltip activator="parent" location="bottom">{{ showGrid ? '隐藏' : '显示' }}网格</v-tooltip>
            </v-btn>
            <v-btn @click="toggleSnap">
              <v-icon>{{ snapToGrid ? 'mdi-magnet-on' : 'mdi-magnet' }}</v-icon>
              <v-tooltip activator="parent" location="bottom">{{ snapToGrid ? '关闭' : '开启' }}吸附</v-tooltip>
            </v-btn>
          </v-btn-group>
        </div>
        
        <!-- 最右侧：缩放控制 -->
        <div class="toolbar-section">
          <v-btn-group variant="outlined" size="small">
            <v-btn @click="zoomOut" :disabled="zoomLevel <= 0.25">
              <v-icon>mdi-minus</v-icon>
              <v-tooltip activator="parent" location="bottom">缩小</v-tooltip>
            </v-btn>
            <v-btn @click="resetZoom">
              <span class="zoom-text">{{ Math.round(zoomLevel * 100) }}%</span>
              <v-tooltip activator="parent" location="bottom">重置缩放</v-tooltip>
            </v-btn>
            <v-btn @click="zoomIn" :disabled="zoomLevel >= 3">
              <v-icon>mdi-plus</v-icon>
              <v-tooltip activator="parent" location="bottom">放大</v-tooltip>
            </v-btn>
          </v-btn-group>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'
import { useDesignerStore } from '@/stores/designer'

const designerStore = useDesignerStore()

// 计算属性
const canUndo = computed(() => designerStore.canUndo)
const canRedo = computed(() => designerStore.canRedo)
const hasSelection = computed(() => designerStore.selectedComponentId !== null)
const hasMultipleSelection = computed(() => designerStore.selectedComponentIds.length > 1)
const canPaste = computed(() => {
  // 这里可以检查剪贴板是否有内容
  return true
})
const showGrid = computed(() => designerStore.canvasConfig.showGrid)
const snapToGrid = computed(() => designerStore.canvasConfig.snapToGrid)
const zoomLevel = computed(() => designerStore.canvasConfig.zoomLevel)

// 基础操作
const undo = () => {
  designerStore.undo()
}

const redo = () => {
  designerStore.redo()
}

const copy = () => {
  if (designerStore.selectedComponentId) {
    // 这里可以实现复制到剪贴板的逻辑
    const componentData = designerStore.copyComponent(designerStore.selectedComponentId)
    // 可以存储到全局状态或localStorage
    localStorage.setItem('copiedComponent', JSON.stringify(componentData))
  }
}

const paste = () => {
  try {
    const copiedData = localStorage.getItem('copiedComponent')
    if (copiedData) {
      const componentData = JSON.parse(copiedData)
      designerStore.pasteComponent(componentData)
    }
  } catch (error) {
    console.error('粘贴失败:', error)
  }
}

const deleteSelected = () => {
  if (designerStore.selectedComponentId) {
    designerStore.removeComponent(designerStore.selectedComponentId)
  }
}

// 对齐操作
const alignLeft = () => {
  const selectedComponents = getSelectedComponents()
  if (selectedComponents.length < 2) return
  
  const leftMost = Math.min(...selectedComponents.map(c => c.position.x))
  selectedComponents.forEach(component => {
    designerStore.updateComponentPosition(component.id, { x: leftMost })
  })
}

const alignCenter = () => {
  const selectedComponents = getSelectedComponents()
  if (selectedComponents.length < 2) return
  
  const centerX = selectedComponents.reduce((sum, c) => sum + c.position.x + c.position.width / 2, 0) / selectedComponents.length
  selectedComponents.forEach(component => {
    designerStore.updateComponentPosition(component.id, { x: centerX - component.position.width / 2 })
  })
}

const alignRight = () => {
  const selectedComponents = getSelectedComponents()
  if (selectedComponents.length < 2) return
  
  const rightMost = Math.max(...selectedComponents.map(c => c.position.x + c.position.width))
  selectedComponents.forEach(component => {
    designerStore.updateComponentPosition(component.id, { x: rightMost - component.position.width })
  })
}

const alignTop = () => {
  const selectedComponents = getSelectedComponents()
  if (selectedComponents.length < 2) return
  
  const topMost = Math.min(...selectedComponents.map(c => c.position.y))
  selectedComponents.forEach(component => {
    designerStore.updateComponentPosition(component.id, { y: topMost })
  })
}

const alignMiddle = () => {
  const selectedComponents = getSelectedComponents()
  if (selectedComponents.length < 2) return
  
  const centerY = selectedComponents.reduce((sum, c) => sum + c.position.y + c.position.height / 2, 0) / selectedComponents.length
  selectedComponents.forEach(component => {
    designerStore.updateComponentPosition(component.id, { y: centerY - component.position.height / 2 })
  })
}

const alignBottom = () => {
  const selectedComponents = getSelectedComponents()
  if (selectedComponents.length < 2) return
  
  const bottomMost = Math.max(...selectedComponents.map(c => c.position.y + c.position.height))
  selectedComponents.forEach(component => {
    designerStore.updateComponentPosition(component.id, { y: bottomMost - component.position.height })
  })
}

// 分布操作
const distributeHorizontally = () => {
  const selectedComponents = getSelectedComponents()
  if (selectedComponents.length < 3) return
  
  selectedComponents.sort((a, b) => a.position.x - b.position.x)
  const totalWidth = selectedComponents[selectedComponents.length - 1].position.x - selectedComponents[0].position.x
  const gap = totalWidth / (selectedComponents.length - 1)
  
  selectedComponents.forEach((component, index) => {
    if (index > 0 && index < selectedComponents.length - 1) {
      designerStore.updateComponentPosition(component.id, { x: selectedComponents[0].position.x + gap * index })
    }
  })
}

const distributeVertically = () => {
  const selectedComponents = getSelectedComponents()
  if (selectedComponents.length < 3) return
  
  selectedComponents.sort((a, b) => a.position.y - b.position.y)
  const totalHeight = selectedComponents[selectedComponents.length - 1].position.y - selectedComponents[0].position.y
  const gap = totalHeight / (selectedComponents.length - 1)
  
  selectedComponents.forEach((component, index) => {
    if (index > 0 && index < selectedComponents.length - 1) {
      designerStore.updateComponentPosition(component.id, { y: selectedComponents[0].position.y + gap * index })
    }
  })
}

// 层级操作
const bringToFront = () => {
  if (designerStore.selectedComponentId) {
    const maxZ = Math.max(...designerStore.components.map(c => c.position?.zIndex || 1))
    designerStore.updateComponentPosition(designerStore.selectedComponentId, { zIndex: maxZ + 1 })
  }
}

const sendToBack = () => {
  if (designerStore.selectedComponentId) {
    designerStore.updateComponentPosition(designerStore.selectedComponentId, { zIndex: 1 })
    // 重新调整其他组件的z-index
    designerStore.components.forEach((comp, index) => {
      if (comp.id !== designerStore.selectedComponentId) {
        designerStore.updateComponentPosition(comp.id, { zIndex: index + 2 })
      }
    })
  }
}

const bringForward = () => {
  if (designerStore.selectedComponentId) {
    const component = designerStore.components.find(c => c.id === designerStore.selectedComponentId)
    if (component) {
      const currentZ = component.position?.zIndex || 1
      designerStore.updateComponentPosition(designerStore.selectedComponentId, { zIndex: currentZ + 1 })
    }
  }
}

const sendBackward = () => {
  if (designerStore.selectedComponentId) {
    const component = designerStore.components.find(c => c.id === designerStore.selectedComponentId)
    if (component) {
      const currentZ = component.position?.zIndex || 1
      if (currentZ > 1) {
        designerStore.updateComponentPosition(designerStore.selectedComponentId, { zIndex: currentZ - 1 })
      }
    }
  }
}

// 画布操作
const toggleGrid = () => {
  designerStore.updateCanvasConfig({ showGrid: !showGrid.value })
}

const toggleSnap = () => {
  designerStore.updateCanvasConfig({ snapToGrid: !snapToGrid.value })
}

const zoomIn = () => {
  const newZoom = Math.min(3, zoomLevel.value + 0.1)
  designerStore.updateCanvasConfig({ zoomLevel: newZoom })
}

const zoomOut = () => {
  const newZoom = Math.max(0.25, zoomLevel.value - 0.1)
  designerStore.updateCanvasConfig({ zoomLevel: newZoom })
}

const resetZoom = () => {
  designerStore.updateCanvasConfig({ zoomLevel: 1 })
}

// 辅助函数
const getSelectedComponents = () => {
  return designerStore.components.filter(c => 
    designerStore.selectedComponentIds.includes(c.id)
  )
}
</script>

<style scoped>
.toolbar-card {
  border-bottom: 1px solid #e0e0e0;
  background-color: #fafafa;
}

.toolbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.toolbar-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.zoom-text {
  font-size: 12px;
  font-weight: 500;
  min-width: 40px;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .toolbar-content {
    gap: 8px;
  }
  
  .toolbar-section {
    gap: 4px;
  }
}

@media (max-width: 768px) {
  .toolbar-content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .toolbar-section {
    justify-content: center;
  }
}
</style>

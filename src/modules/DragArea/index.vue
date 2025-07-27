<template>
  <div class="drag-area">
    <v-card flat height="100%">
      <v-card-title class="text-h6 pa-3">
        <v-icon class="me-2">mdi-view-grid</v-icon>
        设计区域
        <v-spacer></v-spacer>
        <v-chip size="small" color="primary" variant="outlined">
          {{ components.length }} 个组件
        </v-chip>
      </v-card-title>
      
      <v-divider></v-divider>
      
      <v-card-text class="pa-4" style="height: calc(100% - 73px);">
        <div
          class="design-canvas"
          :class="{ 'drag-over': isDragOver }"
          @drop="handleDrop"
          @dragover="handleDragOver"
          @dragenter="handleDragEnter"
          @dragleave="handleDragLeave"
        >
          <div v-if="components.length === 0" class="empty-state">
            <v-icon size="64" color="grey-lighten-1">mdi-drag</v-icon>
            <p class="text-grey-lighten-1 mt-4">从左侧拖拽组件到这里开始设计</p>
          </div>
          
          <div v-else class="form-preview">
            <div class="form-grid" :style="gridStyle">
              <div
                v-for="(component, index) in components"
                :key="component.id"
                class="form-item"
                :class="{ 'selected': selectedComponentId === component.id }"
                @click="selectComponent(component.id)"
              >
                <div class="form-item-content">
                  <ComponentRenderer :component="component" />
                </div>
                
                <!-- 组件操作按钮 -->
                <div class="component-actions" v-show="selectedComponentId === component.id">
                  <v-btn
                    icon
                    size="x-small"
                    color="error"
                    @click.stop="removeComponent(component.id)"
                  >
                    <v-icon size="16">mdi-delete</v-icon>
                  </v-btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDesignerStore } from '@/stores/designer'
import { useComponentsStore } from '@/stores/components'
import ComponentRenderer from './ComponentRenderer.vue'

const designerStore = useDesignerStore()
const componentsStore = useComponentsStore()
const isDragOver = ref(false)

// 计算属性
const components = computed(() => designerStore.components)
const selectedComponentId = computed(() => designerStore.selectedComponentId)
const formConfig = computed(() => designerStore.formConfig)

// Grid样式
const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${formConfig.value.layout.columns}, minmax(0, 1fr))`,
  gap: formConfig.value.layout.gap,
  padding: '20px',
}))

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
  // 只有当离开整个拖拽区域时才取消高亮
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
      // 创建组件实例
      const componentInstance = componentsStore.createComponentInstance(data.componentType)
      
      // 添加到设计器
      const newComponent = designerStore.addComponent(componentInstance)
      
      // 自动选中新添加的组件
      designerStore.selectComponent(newComponent.id)
    }
  } catch (error) {
    console.error('处理拖拽数据失败:', error)
  }
}

// 组件操作
const selectComponent = (componentId) => {
  designerStore.selectComponent(componentId)
}

const removeComponent = (componentId) => {
  designerStore.removeComponent(componentId)
}
</script>

<style scoped>
.drag-area {
  height: 100%;
}

.design-canvas {
  height: 100%;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  overflow: auto;
}

.design-canvas.drag-over {
  border-color: #1976D2;
  background-color: rgba(25, 118, 210, 0.05);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}

.form-preview {
  height: 100%;
  min-height: 200px;
}

.form-grid {
  min-height: 100%;
}

.form-item {
  position: relative;
  min-height: 60px;
  border: 2px solid transparent;
  border-radius: 4px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.form-item:hover {
  border-color: #e3f2fd;
  background-color: rgba(25, 118, 210, 0.02);
}

.form-item.selected {
  border-color: #1976D2;
  background-color: rgba(25, 118, 210, 0.05);
}

.form-item-content {
  padding: 8px;
}

.component-actions {
  position: absolute;
  top: -12px;
  right: -12px;
  z-index: 10;
}

/* 滚动条样式 */
.design-canvas::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.design-canvas::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.design-canvas::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.design-canvas::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>

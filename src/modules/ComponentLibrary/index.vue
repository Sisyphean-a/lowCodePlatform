<template>
  <div class="component-library">
    <v-card flat>
      <v-card-title class="text-h6 pa-3">
        <v-icon class="me-2">mdi-widgets</v-icon>
        组件库
      </v-card-title>
      
      <v-divider></v-divider>
      
      <v-card-text class="pa-2">
        <div class="component-category">
          <div class="category-header px-2 py-2">
            <span class="text-subtitle-2 text-primary font-weight-bold">表单组件</span>
          </div>
          
          <div class="component-list">
            <div
              v-for="component in formComponents"
              :key="component.type"
              class="component-item"
              draggable="true"
              @dragstart="handleDragStart($event, component)"
              @dragend="handleDragEnd"
            >
              <v-card
                class="component-card"
                :class="{ 'dragging': isDragging && draggedComponent?.type === component.type }"
                elevation="1"
                hover
              >
                <v-card-text class="pa-3 text-center">
                  <v-icon 
                    :icon="component.icon" 
                    size="24" 
                    class="mb-2"
                    color="primary"
                  ></v-icon>
                  <div class="component-name">{{ component.name }}</div>
                </v-card-text>
              </v-card>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useComponentsStore } from '@/stores/components'

const componentsStore = useComponentsStore()
const isDragging = ref(false)
const draggedComponent = ref(null)

// 获取表单组件
const formComponents = computed(() => {
  return componentsStore.getComponentsByCategory('form')
})

// 处理拖拽开始
const handleDragStart = (event, component) => {
  isDragging.value = true
  draggedComponent.value = component
  
  // 设置拖拽数据
  event.dataTransfer.setData('application/json', JSON.stringify({
    type: 'component',
    componentType: component.type,
    componentData: component
  }))
  
  // 设置拖拽效果
  event.dataTransfer.effectAllowed = 'copy'
  
  // 添加拖拽样式
  event.target.style.opacity = '0.5'
}

// 处理拖拽结束
const handleDragEnd = (event) => {
  isDragging.value = false
  draggedComponent.value = null
  
  // 恢复样式
  event.target.style.opacity = '1'
}
</script>

<style scoped>
.component-library {
  height: 100%;
  overflow-y: auto;
}

.component-category {
  margin-bottom: 16px;
}

.component-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.component-item {
  cursor: grab;
  user-select: none;
}

.component-item:active {
  cursor: grabbing;
}

.component-card {
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.component-card:hover {
  border-color: #1976D2;
  transform: translateY(-2px);
}

.component-card.dragging {
  opacity: 0.5;
  transform: rotate(5deg);
}

.component-name {
  font-size: 12px;
  font-weight: 500;
  color: #424242;
  line-height: 1.2;
}

.category-header {
  font-weight: 600;
  color: #1976D2;
  font-size: 14px;
}

/* 滚动条样式 */
.component-library::-webkit-scrollbar {
  width: 6px;
}

.component-library::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.component-library::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.component-library::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>

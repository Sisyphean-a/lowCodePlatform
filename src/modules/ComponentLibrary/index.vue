<template>
  <div class="component-library">
    <v-card flat>
      <v-card-title class="text-h6 pa-3">
        <v-icon class="me-2">mdi-widgets</v-icon>
        组件库
      </v-card-title>
      
      <v-divider></v-divider>
      
      <v-card-text class="pa-2">
        <!-- 搜索框 -->
        <v-text-field
          v-model="searchQuery"
          placeholder="搜索组件..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          clearable
          class="mb-3"
        ></v-text-field>

        <!-- 分类标签 -->
        <v-chip-group
          v-model="selectedCategory"
          selected-class="text-primary"
          class="mb-3"
        >
          <v-chip value="all" size="small">全部</v-chip>
          <v-chip value="layout" size="small">布局</v-chip>
          <v-chip value="form" size="small">表单</v-chip>
          <v-chip value="display" size="small">展示</v-chip>
          <v-chip value="interaction" size="small">交互</v-chip>
        </v-chip-group>

        <!-- 组件分类列表 -->
        <div v-for="category in visibleCategories" :key="category.name" class="component-category mb-4">
          <div class="category-header px-2 py-2">
            <span class="text-subtitle-2 text-primary font-weight-bold">
              <v-icon :icon="category.icon" size="16" class="me-1"></v-icon>
              {{ category.name }}
            </span>
            <v-chip size="x-small" variant="outlined" class="ml-2">
              {{ category.components.length }}
            </v-chip>
          </div>

          <div class="component-list">
            <div
              v-for="component in category.components"
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

        <!-- 空状态 -->
        <div v-if="visibleCategories.length === 0" class="empty-state text-center py-8">
          <v-icon size="48" color="grey-lighten-2">mdi-package-variant</v-icon>
          <p class="text-grey-lighten-1 mt-2">没有找到匹配的组件</p>
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
const searchQuery = ref('')
const selectedCategory = ref('all')

// 分类配置
const categoryConfig = {
  layout: { name: '布局组件', icon: 'mdi-view-dashboard' },
  form: { name: '表单组件', icon: 'mdi-form-select' },
  display: { name: '展示组件', icon: 'mdi-eye' },
  interaction: { name: '交互组件', icon: 'mdi-cursor-pointer' }
}

// 获取所有组件并按分类分组
const allComponents = computed(() => {
  return componentsStore.availableComponents
})

// 过滤后的组件
const filteredComponents = computed(() => {
  let components = allComponents.value

  // 按搜索关键词过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    components = components.filter(comp =>
      comp.name.toLowerCase().includes(query) ||
      comp.type.toLowerCase().includes(query)
    )
  }

  // 按分类过滤
  if (selectedCategory.value !== 'all') {
    components = components.filter(comp => comp.category === selectedCategory.value)
  }

  return components
})

// 可见的分类列表
const visibleCategories = computed(() => {
  const categories = {}

  filteredComponents.value.forEach(component => {
    const category = component.category
    if (!categories[category]) {
      categories[category] = {
        name: categoryConfig[category]?.name || category,
        icon: categoryConfig[category]?.icon || 'mdi-package',
        components: []
      }
    }
    categories[category].components.push(component)
  })

  // 按预定义顺序排序
  const orderedCategories = ['layout', 'form', 'display', 'interaction']
  return orderedCategories
    .filter(cat => categories[cat])
    .map(cat => categories[cat])
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

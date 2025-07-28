<template>
  <div class="component-tree">
    <v-card flat>
      <v-card-title class="text-h6 pa-3">
        <v-icon class="me-2">mdi-file-tree</v-icon>
        组件树
        <v-spacer></v-spacer>
        <v-chip size="small" color="primary" variant="outlined">
          {{ components.length }}
        </v-chip>
      </v-card-title>
      
      <v-divider></v-divider>
      
      <v-card-text class="pa-2">
        <!-- 工具栏 -->
        <div class="tree-toolbar mb-2">
          <v-btn-group size="small" variant="outlined" density="compact">
            <v-btn @click="expandAll">
              <v-icon size="16">mdi-unfold-more-horizontal</v-icon>
              <v-tooltip activator="parent" location="bottom">展开全部</v-tooltip>
            </v-btn>
            <v-btn @click="collapseAll">
              <v-icon size="16">mdi-unfold-less-horizontal</v-icon>
              <v-tooltip activator="parent" location="bottom">折叠全部</v-tooltip>
            </v-btn>
          </v-btn-group>
        </div>
        
        <!-- 组件树列表 -->
        <div class="tree-container">
          <div v-if="components.length === 0" class="empty-state text-center py-8">
            <v-icon size="48" color="grey-lighten-2">mdi-file-tree-outline</v-icon>
            <p class="text-grey-lighten-1 mt-2">暂无组件</p>
          </div>
          
          <div v-else class="tree-list">
            <div
              v-for="component in sortedComponents"
              :key="component.id"
              class="tree-item"
              :class="{ 
                'selected': selectedComponentId === component.id,
                'hidden': component.hidden
              }"
              @click="selectComponent(component.id)"
              @contextmenu.prevent="showContextMenu($event, component)"
            >
              <div class="tree-item-content">
                <!-- 组件图标和名称 -->
                <div class="item-info">
                  <v-icon 
                    :icon="getComponentIcon(component)" 
                    size="16" 
                    class="me-2"
                    :color="component.hidden ? 'grey-lighten-1' : 'primary'"
                  ></v-icon>
                  
                  <span 
                    v-if="!component.editing"
                    class="item-name"
                    :class="{ 'text-grey-lighten-1': component.hidden }"
                    @dblclick="startRename(component.id)"
                  >
                    {{ getComponentDisplayName(component) }}
                  </span>
                  
                  <v-text-field
                    v-else
                    v-model="editingName"
                    variant="outlined"
                    density="compact"
                    hide-details
                    class="item-name-input"
                    @blur="finishRename(component.id)"
                    @keyup.enter="finishRename(component.id)"
                    @keyup.esc="cancelRename(component.id)"
                    ref="nameInput"
                  ></v-text-field>
                </div>
                
                <!-- 操作按钮 -->
                <div class="item-actions" v-show="selectedComponentId === component.id">
                  <v-btn
                    icon
                    size="x-small"
                    variant="text"
                    @click.stop="toggleVisibility(component.id)"
                  >
                    <v-icon size="14">
                      {{ component.hidden ? 'mdi-eye-off' : 'mdi-eye' }}
                    </v-icon>
                    <v-tooltip activator="parent" location="bottom">
                      {{ component.hidden ? '显示' : '隐藏' }}
                    </v-tooltip>
                  </v-btn>
                  
                  <v-btn
                    icon
                    size="x-small"
                    variant="text"
                    @click.stop="duplicateComponent(component.id)"
                  >
                    <v-icon size="14">mdi-content-copy</v-icon>
                    <v-tooltip activator="parent" location="bottom">复制</v-tooltip>
                  </v-btn>
                  
                  <v-btn
                    icon
                    size="x-small"
                    variant="text"
                    color="error"
                    @click.stop="deleteComponent(component.id)"
                  >
                    <v-icon size="14">mdi-delete</v-icon>
                    <v-tooltip activator="parent" location="bottom">删除</v-tooltip>
                  </v-btn>
                </div>
              </div>
              
              <!-- 层级指示器 -->
              <div class="z-index-indicator">
                <v-chip size="x-small" variant="outlined" color="grey">
                  Z{{ component.position?.zIndex || 1 }}
                </v-chip>
              </div>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
    
    <!-- 右键菜单 -->
    <v-menu
      v-model="contextMenu.show"
      :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
      absolute
      offset-y
    >
      <v-list density="compact">
        <v-list-item @click="startRename(contextMenu.component?.id)">
          <v-list-item-title>
            <v-icon size="16" class="me-2">mdi-pencil</v-icon>
            重命名
          </v-list-item-title>
        </v-list-item>
        
        <v-list-item @click="duplicateComponent(contextMenu.component?.id)">
          <v-list-item-title>
            <v-icon size="16" class="me-2">mdi-content-copy</v-icon>
            复制
          </v-list-item-title>
        </v-list-item>
        
        <v-list-item @click="toggleVisibility(contextMenu.component?.id)">
          <v-list-item-title>
            <v-icon size="16" class="me-2">
              {{ contextMenu.component?.hidden ? 'mdi-eye' : 'mdi-eye-off' }}
            </v-icon>
            {{ contextMenu.component?.hidden ? '显示' : '隐藏' }}
          </v-list-item-title>
        </v-list-item>
        
        <v-divider></v-divider>
        
        <v-list-item @click="moveToTop(contextMenu.component?.id)">
          <v-list-item-title>
            <v-icon size="16" class="me-2">mdi-arrow-up-bold</v-icon>
            置顶
          </v-list-item-title>
        </v-list-item>
        
        <v-list-item @click="moveToBottom(contextMenu.component?.id)">
          <v-list-item-title>
            <v-icon size="16" class="me-2">mdi-arrow-down-bold</v-icon>
            置底
          </v-list-item-title>
        </v-list-item>
        
        <v-divider></v-divider>
        
        <v-list-item @click="deleteComponent(contextMenu.component?.id)" class="text-error">
          <v-list-item-title>
            <v-icon size="16" class="me-2">mdi-delete</v-icon>
            删除
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useDesignerStore } from '@/stores/designer'
import { useComponentsStore } from '@/stores/components'

const designerStore = useDesignerStore()
const componentsStore = useComponentsStore()

// 响应式数据
const editingName = ref('')
const nameInput = ref(null)
const contextMenu = ref({
  show: false,
  x: 0,
  y: 0,
  component: null
})

// 计算属性
const components = computed(() => designerStore.components)
const selectedComponentId = computed(() => designerStore.selectedComponentId)

// 按z-index排序的组件（从高到低）
const sortedComponents = computed(() => {
  return [...components.value].sort((a, b) => {
    const aZ = a.position?.zIndex || 1
    const bZ = b.position?.zIndex || 1
    return bZ - aZ
  })
})

// 获取组件图标
const getComponentIcon = (component) => {
  const componentDef = componentsStore.getComponentByType(component.type)
  return componentDef?.icon || 'mdi-puzzle'
}

// 获取组件显示名称
const getComponentDisplayName = (component) => {
  return component.displayName || component.label || component.type
}

// 选择组件
const selectComponent = (componentId) => {
  designerStore.selectComponent(componentId)
}

// 开始重命名
const startRename = async (componentId) => {
  const component = components.value.find(c => c.id === componentId)
  if (!component) return
  
  editingName.value = getComponentDisplayName(component)
  designerStore.updateComponent(componentId, { editing: true })
  
  await nextTick()
  if (nameInput.value) {
    nameInput.value.focus()
    nameInput.value.select()
  }
}

// 完成重命名
const finishRename = (componentId) => {
  if (editingName.value.trim()) {
    designerStore.updateComponent(componentId, { 
      displayName: editingName.value.trim(),
      editing: false 
    })
  } else {
    cancelRename(componentId)
  }
}

// 取消重命名
const cancelRename = (componentId) => {
  designerStore.updateComponent(componentId, { editing: false })
  editingName.value = ''
}

// 切换可见性
const toggleVisibility = (componentId) => {
  const component = components.value.find(c => c.id === componentId)
  if (component) {
    designerStore.updateComponent(componentId, { hidden: !component.hidden })
  }
}

// 复制组件
const duplicateComponent = (componentId) => {
  const componentData = designerStore.copyComponent(componentId)
  if (componentData) {
    designerStore.pasteComponent(componentData)
  }
}

// 删除组件
const deleteComponent = (componentId) => {
  designerStore.removeComponent(componentId)
}

// 移动到顶层
const moveToTop = (componentId) => {
  const maxZ = Math.max(...components.value.map(c => c.position?.zIndex || 1))
  designerStore.updateComponentPosition(componentId, { zIndex: maxZ + 1 })
}

// 移动到底层
const moveToBottom = (componentId) => {
  designerStore.updateComponentPosition(componentId, { zIndex: 1 })
  // 重新调整其他组件的z-index
  components.value.forEach((comp, index) => {
    if (comp.id !== componentId) {
      designerStore.updateComponentPosition(comp.id, { zIndex: index + 2 })
    }
  })
}

// 展开全部
const expandAll = () => {
  // 预留功能，当有嵌套组件时使用
}

// 折叠全部
const collapseAll = () => {
  // 预留功能，当有嵌套组件时使用
}

// 显示右键菜单
const showContextMenu = (event, component) => {
  contextMenu.value = {
    show: true,
    x: event.clientX,
    y: event.clientY,
    component
  }
}
</script>

<style scoped>
.component-tree {
  height: 100%;
  overflow: hidden;
}

.tree-container {
  height: calc(100vh - 200px);
  overflow-y: auto;
}

.tree-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tree-item {
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  position: relative;
}

.tree-item:hover {
  background-color: rgba(25, 118, 210, 0.05);
  border-color: rgba(25, 118, 210, 0.2);
}

.tree-item.selected {
  background-color: rgba(25, 118, 210, 0.1);
  border-color: #1976D2;
}

.tree-item.hidden {
  opacity: 0.6;
}

.tree-item-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.item-info {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-name-input {
  max-width: 120px;
}

.item-actions {
  display: flex;
  gap: 2px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.tree-item:hover .item-actions,
.tree-item.selected .item-actions {
  opacity: 1;
}

.z-index-indicator {
  position: absolute;
  top: 2px;
  right: 2px;
  font-size: 10px;
}

.empty-state {
  color: #9e9e9e;
}

/* 滚动条样式 */
.tree-container::-webkit-scrollbar {
  width: 6px;
}

.tree-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.tree-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.tree-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>

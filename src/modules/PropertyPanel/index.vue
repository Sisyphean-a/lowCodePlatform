<template>
  <div class="property-panel">
    <v-card flat height="100%">
      <v-card-title class="text-h6 pa-3">
        <v-icon class="me-2">mdi-cog</v-icon>
        属性配置
      </v-card-title>
      
      <v-divider></v-divider>
      
      <v-card-text class="pa-0" style="height: calc(100% - 73px); overflow-y: auto;">
        <div v-if="!selectedComponent" class="empty-state pa-4">
          <v-icon size="48" color="grey-lighten-2">mdi-cursor-default-click</v-icon>
          <p class="text-grey-lighten-1 mt-3 text-center">
            请选择一个组件来配置属性
          </p>
        </div>
        
        <div v-else class="property-form pa-3">
          <!-- 组件信息 -->
          <div class="component-info mb-4">
            <v-chip color="primary" size="small" class="mb-2">
              {{ getComponentName(selectedComponent.type) }}
            </v-chip>
            <v-text-field
              label="组件ID"
              :model-value="selectedComponent.id"
              readonly
              variant="outlined"
              density="compact"
              hide-details
              class="mb-3"
            />
          </div>
          
          <v-divider class="mb-4"></v-divider>
          
          <!-- 动态属性配置 -->
          <div class="property-fields">
            <div
              v-for="field in configSchema"
              :key="field.key"
              class="property-field mb-3"
            >
              <!-- 文本输入 -->
              <v-text-field
                v-if="field.type === 'input'"
                :label="field.label"
                :model-value="getPropertyValue(field.key)"
                @update:model-value="updateProperty(field.key, $event)"
                variant="outlined"
                density="compact"
                hide-details
                :required="field.required"
              />
              
              <!-- 开关 -->
              <div v-else-if="field.type === 'switch'" class="switch-field">
                <v-switch
                  :label="field.label"
                  :model-value="getPropertyValue(field.key)"
                  @update:model-value="updateProperty(field.key, $event)"
                  color="primary"
                  hide-details
                  inset
                />
              </div>
              
              <!-- 选择器 -->
              <v-select
                v-else-if="field.type === 'select'"
                :label="field.label"
                :model-value="getPropertyValue(field.key)"
                @update:model-value="updateProperty(field.key, $event)"
                :items="field.options"
                item-title="label"
                item-value="value"
                variant="outlined"
                density="compact"
                hide-details
              />
              
              <!-- 选项配置 -->
              <div v-else-if="field.type === 'options'" class="options-field">
                <div class="field-label mb-2">{{ field.label }}</div>
                <OptionsEditor
                  :model-value="getPropertyValue(field.key)"
                  @update:model-value="updateProperty(field.key, $event)"
                />
              </div>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDesignerStore } from '@/stores/designer'
import { useComponentsStore } from '@/stores/components'
import OptionsEditor from './OptionsEditor.vue'

const designerStore = useDesignerStore()
const componentsStore = useComponentsStore()

// 计算属性
const selectedComponent = computed(() => designerStore.selectedComponent)

// 获取组件配置架构
const configSchema = computed(() => {
  if (!selectedComponent.value) return []
  
  const componentDef = componentsStore.getComponentByType(selectedComponent.value.type)
  return componentDef?.configSchema || []
})

// 获取组件名称
const getComponentName = (type) => {
  const componentDef = componentsStore.getComponentByType(type)
  return componentDef?.name || type
}

// 获取属性值
const getPropertyValue = (key) => {
  if (!selectedComponent.value) return ''
  
  if (key === 'label') {
    return selectedComponent.value.label
  }
  
  return selectedComponent.value.props?.[key] ?? ''
}

// 更新属性
const updateProperty = (key, value) => {
  if (!selectedComponent.value) return
  
  const updates = {}
  
  if (key === 'label') {
    updates.label = value
  } else {
    updates.props = {
      ...selectedComponent.value.props,
      [key]: value
    }
  }
  
  designerStore.updateComponent(selectedComponent.value.id, updates)
}
</script>

<style scoped>
.property-panel {
  height: 100%;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  text-align: center;
}

.component-info {
  background-color: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
}

.property-fields {
  max-width: 100%;
}

.property-field {
  width: 100%;
}

.switch-field {
  padding: 8px 0;
}

.options-field {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 12px;
  background-color: #fafafa;
}

.field-label {
  font-size: 14px;
  font-weight: 500;
  color: #424242;
}

/* 滚动条样式 */
.property-panel :deep(.v-card-text)::-webkit-scrollbar {
  width: 6px;
}

.property-panel :deep(.v-card-text)::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.property-panel :deep(.v-card-text)::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.property-panel :deep(.v-card-text)::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>

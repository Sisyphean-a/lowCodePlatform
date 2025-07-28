<template>
  <div class="property-panel">
    <v-card flat height="100%">
      <v-card-title class="text-h6 pa-3">
        <v-icon class="me-2">mdi-cog</v-icon>
        面板
      </v-card-title>

      <v-divider></v-divider>

      <!-- 标签页 -->
      <v-tabs v-model="activeTab" density="compact" color="primary">
        <v-tab value="properties">
          <v-icon size="16" class="me-1">mdi-tune</v-icon>
          属性
        </v-tab>
        <v-tab value="tree">
          <v-icon size="16" class="me-1">mdi-file-tree</v-icon>
          结构
        </v-tab>
        <v-tab value="styles">
          <v-icon size="16" class="me-1">mdi-palette</v-icon>
          样式
        </v-tab>
      </v-tabs>

      <v-divider></v-divider>

      <!-- 标签页内容 -->
      <v-card-text class="pa-0" style="height: calc(100% - 120px); overflow: hidden;">
        <v-tabs-window v-model="activeTab" style="height: 100%;">
          <!-- 属性面板 -->
          <v-tabs-window-item value="properties" style="height: 100%; overflow-y: auto;">
            <div class="pa-3">
              <div v-if="!selectedComponent" class="empty-state pa-4">
                <v-icon size="48" color="grey-lighten-2">mdi-cursor-default-click</v-icon>
                <p class="text-grey-lighten-1 mt-3 text-center">
                  请选择一个组件来配置属性
                </p>
              </div>

              <div v-else class="property-form">
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
            </div>
          </v-tabs-window-item>

          <!-- 组件树 -->
          <v-tabs-window-item value="tree" style="height: 100%;">
            <ComponentTree />
          </v-tabs-window-item>

          <!-- 样式面板 -->
          <v-tabs-window-item value="styles" style="height: 100%; overflow-y: auto;">
            <div class="pa-3">
              <div v-if="!selectedComponent" class="empty-state">
                <v-icon size="48" color="grey-lighten-2">mdi-palette</v-icon>
                <p class="text-grey-lighten-1 mt-3 text-center">
                  请选择一个组件来编辑样式
                </p>
              </div>

              <div v-else class="style-properties">
                <!-- 位置和尺寸 -->
                <div class="property-section mb-4">
                  <h4 class="text-subtitle-1 mb-3">
                    <v-icon class="me-2" size="20">mdi-resize</v-icon>
                    位置尺寸
                  </h4>

                  <v-row dense>
                    <v-col cols="6">
                      <v-text-field
                        label="X坐标"
                        :model-value="selectedComponent.position?.x || 0"
                        @update:model-value="updatePosition('x', Number($event))"
                        variant="outlined"
                        density="compact"
                        hide-details
                        type="number"
                        suffix="px"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        label="Y坐标"
                        :model-value="selectedComponent.position?.y || 0"
                        @update:model-value="updatePosition('y', Number($event))"
                        variant="outlined"
                        density="compact"
                        hide-details
                        type="number"
                        suffix="px"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row dense class="mt-2">
                    <v-col cols="6">
                      <v-text-field
                        label="宽度"
                        :model-value="selectedComponent.position?.width || 200"
                        @update:model-value="updatePosition('width', Number($event))"
                        variant="outlined"
                        density="compact"
                        hide-details
                        type="number"
                        suffix="px"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        label="高度"
                        :model-value="selectedComponent.position?.height || 40"
                        @update:model-value="updatePosition('height', Number($event))"
                        variant="outlined"
                        density="compact"
                        hide-details
                        type="number"
                        suffix="px"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-text-field
                    label="层级"
                    :model-value="selectedComponent.position?.zIndex || 1"
                    @update:model-value="updatePosition('zIndex', Number($event))"
                    variant="outlined"
                    density="compact"
                    hide-details
                    type="number"
                    class="mt-2"
                  ></v-text-field>
                </div>

                <!-- 外观样式 -->
                <div class="property-section mb-4">
                  <h4 class="text-subtitle-1 mb-3">
                    <v-icon class="me-2" size="20">mdi-palette</v-icon>
                    外观样式
                  </h4>

                  <v-text-field
                    label="背景色"
                    :model-value="getStyleValue('backgroundColor')"
                    @update:model-value="updateStyle('backgroundColor', $event)"
                    variant="outlined"
                    density="compact"
                    hide-details
                    type="color"
                    class="mb-3"
                  ></v-text-field>

                  <v-text-field
                    label="边框颜色"
                    :model-value="getStyleValue('borderColor')"
                    @update:model-value="updateStyle('borderColor', $event)"
                    variant="outlined"
                    density="compact"
                    hide-details
                    type="color"
                    class="mb-3"
                  ></v-text-field>

                  <v-text-field
                    label="边框宽度"
                    :model-value="getStyleValue('borderWidth')"
                    @update:model-value="updateStyle('borderWidth', $event)"
                    variant="outlined"
                    density="compact"
                    hide-details
                    suffix="px"
                    type="number"
                    class="mb-3"
                  ></v-text-field>

                  <v-text-field
                    label="圆角"
                    :model-value="getStyleValue('borderRadius')"
                    @update:model-value="updateStyle('borderRadius', $event)"
                    variant="outlined"
                    density="compact"
                    hide-details
                    suffix="px"
                    type="number"
                  ></v-text-field>
                </div>

                <!-- 间距设置 -->
                <div class="property-section mb-4">
                  <h4 class="text-subtitle-1 mb-3">
                    <v-icon class="me-2" size="20">mdi-border-all</v-icon>
                    间距设置
                  </h4>

                  <v-row dense>
                    <v-col cols="6">
                      <v-text-field
                        label="内边距"
                        :model-value="getStyleValue('padding')"
                        @update:model-value="updateStyle('padding', $event)"
                        variant="outlined"
                        density="compact"
                        hide-details
                        placeholder="8px"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        label="外边距"
                        :model-value="getStyleValue('margin')"
                        @update:model-value="updateStyle('margin', $event)"
                        variant="outlined"
                        density="compact"
                        hide-details
                        placeholder="0px"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </div>

                <!-- 阴影效果 -->
                <div class="property-section">
                  <h4 class="text-subtitle-1 mb-3">
                    <v-icon class="me-2" size="20">mdi-blur</v-icon>
                    阴影效果
                  </h4>

                  <v-text-field
                    label="阴影"
                    :model-value="getStyleValue('boxShadow')"
                    @update:model-value="updateStyle('boxShadow', $event)"
                    variant="outlined"
                    density="compact"
                    hide-details
                    placeholder="0 2px 4px rgba(0,0,0,0.1)"
                    class="mb-3"
                  ></v-text-field>

                  <div class="mb-2">
                    <label class="text-caption">透明度</label>
                  </div>
                  <v-slider
                    :model-value="Number(getStyleValue('opacity') || 1)"
                    @update:model-value="updateStyle('opacity', $event)"
                    min="0"
                    max="1"
                    step="0.1"
                    thumb-label
                    hide-details
                  ></v-slider>
                </div>
              </div>
            </div>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDesignerStore } from '@/stores/designer'
import { useComponentsStore } from '@/stores/components'
import OptionsEditor from './OptionsEditor.vue'
import ComponentTree from '@/modules/ComponentTree/index.vue'

const designerStore = useDesignerStore()
const componentsStore = useComponentsStore()

// 响应式数据
const activeTab = ref('properties')

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

  if (key === 'label' || key === 'displayName') {
    updates[key] = value
  } else {
    updates.props = {
      ...selectedComponent.value.props,
      [key]: value
    }
  }

  designerStore.updateComponent(selectedComponent.value.id, updates)
}

// 更新位置
const updatePosition = (key, value) => {
  if (!selectedComponent.value) return

  designerStore.updateComponentPosition(selectedComponent.value.id, {
    [key]: value
  })
}

// 获取样式值
const getStyleValue = (key) => {
  if (!selectedComponent.value) return ''
  return selectedComponent.value.styles?.[key] || ''
}

// 更新样式
const updateStyle = (key, value) => {
  if (!selectedComponent.value) return

  const updates = {
    styles: {
      ...selectedComponent.value.styles,
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

<template>
  <div class="component-renderer" :style="componentStyles">
    <!-- 布局组件 -->
    <template v-if="isLayoutComponent">
      <!-- 容器 -->
      <div v-if="component.type === 'container'" class="container-component">
        <div class="container-content">
          <v-icon class="me-2">mdi-view-dashboard-outline</v-icon>
          容器组件
        </div>
      </div>

      <!-- 卡片 -->
      <v-card v-else-if="component.type === 'card'" :elevation="component.props.elevation" :variant="component.props.outlined ? 'outlined' : 'elevated'">
        <v-card-title>{{ component.props.title }}</v-card-title>
        <v-card-text>卡片内容区域</v-card-text>
      </v-card>

      <!-- 分割线 -->
      <v-divider v-else-if="component.type === 'divider'" :thickness="component.props.thickness" :color="component.props.color"></v-divider>
    </template>

    <!-- 表单组件 -->
    <template v-else-if="isFormComponent">
      <div class="form-item-wrapper">
        <label v-if="component.label" class="form-label">{{ component.label }}</label>
        <div class="form-control">
          <!-- 输入框 -->
          <v-text-field
            v-if="component.type === 'el-input'"
            :placeholder="component.props.placeholder"
            :disabled="component.props.disabled"
            :clearable="component.props.clearable"
            variant="outlined"
            density="compact"
            hide-details
            readonly
          />

          <!-- 文本域 -->
          <v-textarea
            v-else-if="component.type === 'el-textarea'"
            :placeholder="component.props.placeholder"
            :rows="component.props.rows"
            :disabled="component.props.disabled"
            variant="outlined"
            density="compact"
            hide-details
            readonly
          />

          <!-- 选择器 -->
          <v-select
            v-else-if="component.type === 'el-select'"
            :placeholder="component.props.placeholder"
            :items="selectOptions"
            :disabled="component.props.disabled"
            :clearable="component.props.clearable"
            :multiple="component.props.multiple"
            variant="outlined"
            density="compact"
            hide-details
            readonly
          />

          <!-- 单选框组 -->
          <v-radio-group
            v-else-if="component.type === 'el-radio-group'"
            :disabled="component.props.disabled"
            inline
            hide-details
          >
            <v-radio
              v-for="option in radioOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </v-radio-group>

          <!-- 复选框组 -->
          <div v-else-if="component.type === 'el-checkbox-group'" class="checkbox-group">
            <v-checkbox
              v-for="option in checkboxOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
              :disabled="component.props.disabled"
              hide-details
              density="compact"
            />
          </div>

          <!-- 开关 -->
          <v-switch
            v-else-if="component.type === 'el-switch'"
            :label="component.props.activeText"
            :disabled="component.props.disabled"
            color="primary"
            hide-details
            inset
          />

          <!-- 滑块 -->
          <v-slider
            v-else-if="component.type === 'el-slider'"
            :min="component.props.min"
            :max="component.props.max"
            :step="component.props.step"
            :disabled="component.props.disabled"
            hide-details
            thumb-label
          />

          <!-- 日期选择器 -->
          <v-text-field
            v-else-if="component.type === 'el-date-picker'"
            :placeholder="component.props.placeholder"
            :disabled="component.props.disabled"
            variant="outlined"
            density="compact"
            hide-details
            readonly
            append-inner-icon="mdi-calendar"
          />
        </div>
      </div>
    </template>

    <!-- 展示组件 -->
    <template v-else-if="isDisplayComponent">
      <!-- 文本 -->
      <div v-if="component.type === 'text'" class="text-component" :style="textStyles">
        {{ component.props.content }}
      </div>

      <!-- 标题 -->
      <component
        v-else-if="component.type === 'title'"
        :is="component.props.level"
        class="title-component"
        :style="titleStyles"
      >
        {{ component.props.content }}
      </component>

      <!-- 图片 -->
      <v-img
        v-else-if="component.type === 'image'"
        :src="component.props.src"
        :alt="component.props.alt"
        :width="component.props.width"
        :height="component.props.height"
        cover
      />

      <!-- 表格 -->
      <v-table v-else-if="component.type === 'table'" density="compact">
        <thead>
          <tr>
            <th v-for="column in tableColumns" :key="column.prop">
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in tableData" :key="index">
            <td v-for="column in tableColumns" :key="column.prop">
              {{ row[column.prop] }}
            </td>
          </tr>
        </tbody>
      </v-table>
    </template>

    <!-- 交互组件 -->
    <template v-else-if="isInteractionComponent">
      <!-- 按钮 -->
      <v-btn
        v-if="component.type === 'button'"
        :color="component.props.type"
        :size="component.props.size"
        :disabled="component.props.disabled"
        variant="elevated"
      >
        {{ component.props.text }}
      </v-btn>

      <!-- 链接 -->
      <a
        v-else-if="component.type === 'link'"
        :href="component.props.href"
        :target="component.props.target"
        :style="{ color: component.props.color }"
        class="link-component"
      >
        {{ component.props.text }}
      </a>
    </template>

    <!-- 未知组件类型 -->
    <div v-else class="unknown-component">
      <v-icon>mdi-help-circle</v-icon>
      <span>未知组件: {{ component.type }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useComponentsStore } from '@/stores/components'

const props = defineProps({
  component: {
    type: Object,
    required: true
  }
})

const componentsStore = useComponentsStore()

// 组件分类判断
const componentDef = computed(() => {
  return componentsStore.getComponentByType(props.component.type)
})

const isLayoutComponent = computed(() => componentDef.value?.category === 'layout')
const isFormComponent = computed(() => componentDef.value?.category === 'form')
const isDisplayComponent = computed(() => componentDef.value?.category === 'display')
const isInteractionComponent = computed(() => componentDef.value?.category === 'interaction')

// 组件样式
const componentStyles = computed(() => {
  const styles = props.component.styles || {}
  return {
    backgroundColor: styles.backgroundColor,
    borderColor: styles.borderColor,
    borderWidth: styles.borderWidth ? `${styles.borderWidth}px` : undefined,
    borderRadius: styles.borderRadius ? `${styles.borderRadius}px` : undefined,
    padding: styles.padding,
    margin: styles.margin,
    boxShadow: styles.boxShadow,
    opacity: styles.opacity
  }
})

// 文本样式
const textStyles = computed(() => ({
  fontSize: props.component.props.fontSize,
  color: props.component.props.color,
  fontWeight: props.component.props.fontWeight
}))

// 标题样式
const titleStyles = computed(() => ({
  color: props.component.props.color,
  textAlign: props.component.props.textAlign
}))

// 处理选择器选项
const selectOptions = computed(() => {
  if (props.component.type === 'el-select' && props.component.props.options) {
    return props.component.props.options.map(option => ({
      title: option.label,
      value: option.value
    }))
  }
  return []
})

// 处理单选框选项
const radioOptions = computed(() => {
  if (props.component.type === 'el-radio-group' && props.component.props.options) {
    return props.component.props.options
  }
  return []
})

// 处理复选框选项
const checkboxOptions = computed(() => {
  if (props.component.type === 'el-checkbox-group' && props.component.props.options) {
    return props.component.props.options
  }
  return []
})

// 处理表格数据
const tableColumns = computed(() => {
  if (props.component.type === 'table' && props.component.props.columns) {
    return props.component.props.columns
  }
  return []
})

const tableData = computed(() => {
  if (props.component.type === 'table' && props.component.props.data) {
    return props.component.props.data
  }
  return []
})
</script>

<style scoped>
.component-renderer {
  width: 100%;
  height: 100%;
}

/* 布局组件样式 */
.container-component {
  width: 100%;
  height: 100%;
  border: 2px dashed #e0e0e0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.02);
}

.container-content {
  display: flex;
  align-items: center;
  color: #666;
  font-size: 14px;
}

/* 表单组件样式 */
.form-item-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-height: 40px;
  width: 100%;
}

.form-label {
  flex-shrink: 0;
  width: 80px;
  padding-top: 8px;
  font-size: 14px;
  color: #606266;
  text-align: right;
  line-height: 1.5;
}

.form-control {
  flex: 1;
  min-width: 0;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* 展示组件样式 */
.text-component {
  width: 100%;
  word-wrap: break-word;
  line-height: 1.5;
}

.title-component {
  width: 100%;
  margin: 0;
  line-height: 1.2;
}

.link-component {
  text-decoration: none;
  cursor: pointer;
}

.link-component:hover {
  text-decoration: underline;
}

/* 通用样式 */
.unknown-component {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  color: #909399;
  font-size: 14px;
  width: 100%;
  justify-content: center;
}

/* 覆盖 Vuetify 样式以匹配 Element UI 风格 */
:deep(.v-field) {
  font-size: 14px;
}

:deep(.v-field__input) {
  min-height: 32px;
  padding-top: 6px;
  padding-bottom: 6px;
}

:deep(.v-field--variant-outlined .v-field__outline) {
  --v-field-border-width: 1px;
}

:deep(.v-field--variant-outlined.v-field--focused .v-field__outline) {
  --v-field-border-width: 1px;
}

/* 只读状态样式 */
:deep(.v-field--disabled) {
  opacity: 1;
}

:deep(.v-field--disabled .v-field__input) {
  color: #606266;
}

:deep(.v-field--disabled .v-field__outline) {
  color: #dcdfe6;
}
</style>

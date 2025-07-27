<template>
  <div class="component-renderer">
    <!-- 模拟 el-form-item 的样式 -->
    <div class="form-item-wrapper">
      <label class="form-label">{{ component.label }}</label>
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
        
        <!-- 未知组件类型 -->
        <div v-else class="unknown-component">
          <v-icon>mdi-help-circle</v-icon>
          <span>未知组件: {{ component.type }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  component: {
    type: Object,
    required: true
  }
})

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
</script>

<style scoped>
.component-renderer {
  width: 100%;
}

.form-item-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-height: 40px;
}

.form-label {
  flex-shrink: 0;
  width: 100px;
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

.unknown-component {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  color: #909399;
  font-size: 14px;
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

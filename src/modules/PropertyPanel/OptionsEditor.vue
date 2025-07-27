<template>
  <div class="options-editor">
    <div class="options-list">
      <div
        v-for="(option, index) in localOptions"
        :key="index"
        class="option-item mb-2"
      >
        <v-row no-gutters align="center">
          <v-col cols="5">
            <v-text-field
              v-model="option.label"
              label="显示文本"
              variant="outlined"
              density="compact"
              hide-details
              @input="updateOptions"
            />
          </v-col>
          <v-col cols="5" class="ml-2">
            <v-text-field
              v-model="option.value"
              label="值"
              variant="outlined"
              density="compact"
              hide-details
              @input="updateOptions"
            />
          </v-col>
          <v-col cols="1" class="ml-2">
            <v-btn
              icon
              size="small"
              color="error"
              variant="text"
              @click="removeOption(index)"
            >
              <v-icon size="16">mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </div>
    
    <v-btn
      color="primary"
      variant="outlined"
      size="small"
      prepend-icon="mdi-plus"
      @click="addOption"
      class="mt-2"
      block
    >
      添加选项
    </v-btn>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

// 本地选项数据
const localOptions = ref([...props.modelValue])

// 监听外部数据变化
watch(() => props.modelValue, (newValue) => {
  localOptions.value = [...newValue]
}, { deep: true })

// 添加选项
const addOption = () => {
  localOptions.value.push({
    label: `选项${localOptions.value.length + 1}`,
    value: `${localOptions.value.length + 1}`
  })
  updateOptions()
}

// 删除选项
const removeOption = (index) => {
  localOptions.value.splice(index, 1)
  updateOptions()
}

// 更新选项
const updateOptions = () => {
  emit('update:modelValue', [...localOptions.value])
}
</script>

<style scoped>
.options-editor {
  width: 100%;
}

.option-item {
  background-color: white;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.options-list {
  max-height: 200px;
  overflow-y: auto;
}

/* 滚动条样式 */
.options-list::-webkit-scrollbar {
  width: 4px;
}

.options-list::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.options-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}
</style>

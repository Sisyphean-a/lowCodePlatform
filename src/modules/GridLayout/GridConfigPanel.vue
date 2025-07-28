<template>
  <div class="grid-config-panel">
    <v-card>
      <v-card-title class="text-h6 py-3">
        <v-icon class="me-2">mdi-grid</v-icon>
        Grid布局配置
      </v-card-title>
      
      <v-card-text>
        <!-- 快速预设 -->
        <div class="mb-4">
          <v-label class="text-subtitle-2 mb-2">快速预设</v-label>
          <v-btn-toggle
            v-model="selectedPreset"
            variant="outlined"
            density="compact"
            class="grid-presets"
            @update:model-value="applyPreset"
          >
            <v-btn value="2col" size="small">2列</v-btn>
            <v-btn value="3col" size="small">3列</v-btn>
            <v-btn value="4col" size="small">4列</v-btn>
            <v-btn value="6col" size="small">6列</v-btn>
          </v-btn-toggle>
        </div>

        <v-divider class="my-4"></v-divider>

        <!-- 列数配置 -->
        <div class="mb-4">
          <v-label class="text-subtitle-2 mb-2">列数</v-label>
          <v-slider
            v-model="localConfig.columns"
            :min="1"
            :max="12"
            :step="1"
            show-ticks="always"
            tick-size="4"
            class="mb-2"
            @update:model-value="updateConfig"
          >
            <template v-slot:append>
              <v-text-field
                v-model.number="localConfig.columns"
                type="number"
                :min="1"
                :max="12"
                density="compact"
                style="width: 60px"
                variant="outlined"
                hide-details
                @update:model-value="updateConfig"
              ></v-text-field>
            </template>
          </v-slider>
        </div>

        <!-- 行数配置 -->
        <div class="mb-4">
          <v-label class="text-subtitle-2 mb-2">行数</v-label>
          <v-radio-group
            v-model="localConfig.rows"
            inline
            density="compact"
            @update:model-value="updateConfig"
          >
            <v-radio label="自动" value="auto"></v-radio>
            <v-radio label="固定" value="fixed"></v-radio>
          </v-radio-group>
          
          <v-text-field
            v-if="localConfig.rows === 'fixed'"
            v-model.number="localConfig.fixedRows"
            type="number"
            :min="1"
            :max="20"
            label="行数"
            density="compact"
            variant="outlined"
            hide-details
            class="mt-2"
            @update:model-value="updateConfig"
          ></v-text-field>
        </div>

        <v-divider class="my-4"></v-divider>

        <!-- 间距配置 -->
        <div class="mb-4">
          <v-label class="text-subtitle-2 mb-2">列间距</v-label>
          <v-slider
            v-model="columnGapValue"
            :min="0"
            :max="50"
            :step="5"
            show-ticks="always"
            tick-size="4"
            class="mb-2"
            @update:model-value="updateColumnGap"
          >
            <template v-slot:append>
              <v-text-field
                v-model.number="columnGapValue"
                type="number"
                :min="0"
                :max="50"
                density="compact"
                style="width: 60px"
                variant="outlined"
                hide-details
                suffix="px"
                @update:model-value="updateColumnGap"
              ></v-text-field>
            </template>
          </v-slider>
        </div>

        <div class="mb-4">
          <v-label class="text-subtitle-2 mb-2">行间距</v-label>
          <v-slider
            v-model="rowGapValue"
            :min="0"
            :max="50"
            :step="5"
            show-ticks="always"
            tick-size="4"
            class="mb-2"
            @update:model-value="updateRowGap"
          >
            <template v-slot:append>
              <v-text-field
                v-model.number="rowGapValue"
                type="number"
                :min="0"
                :max="50"
                density="compact"
                style="width: 60px"
                variant="outlined"
                hide-details
                suffix="px"
                @update:model-value="updateRowGap"
              ></v-text-field>
            </template>
          </v-slider>
        </div>

        <!-- 最小行高 -->
        <div class="mb-4">
          <v-label class="text-subtitle-2 mb-2">最小行高</v-label>
          <v-slider
            v-model="minRowHeightValue"
            :min="40"
            :max="200"
            :step="10"
            show-ticks="always"
            tick-size="4"
            class="mb-2"
            @update:model-value="updateMinRowHeight"
          >
            <template v-slot:append>
              <v-text-field
                v-model.number="minRowHeightValue"
                type="number"
                :min="40"
                :max="200"
                density="compact"
                style="width: 70px"
                variant="outlined"
                hide-details
                suffix="px"
                @update:model-value="updateMinRowHeight"
              ></v-text-field>
            </template>
          </v-slider>
        </div>

        <v-divider class="my-4"></v-divider>

        <!-- 显示选项 -->
        <div class="mb-4">
          <v-label class="text-subtitle-2 mb-2">显示选项</v-label>
          <v-switch
            v-model="localConfig.showGridLines"
            label="显示网格线"
            color="primary"
            density="compact"
            hide-details
            @update:model-value="updateConfig"
          ></v-switch>
        </div>

        <!-- 操作按钮 -->
        <div class="d-flex gap-2 mt-4">
          <v-btn
            color="primary"
            variant="outlined"
            size="small"
            @click="autoArrange"
          >
            <v-icon start>mdi-auto-fix</v-icon>
            自动排列
          </v-btn>
          
          <v-btn
            color="secondary"
            variant="outlined"
            size="small"
            @click="resetToDefault"
          >
            <v-icon start>mdi-restore</v-icon>
            重置
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useDesignerStore } from '@/stores/designer'

const designerStore = useDesignerStore()

// 响应式数据
const selectedPreset = ref('3col')
const localConfig = ref({
  columns: 3,
  rows: 'auto',
  fixedRows: 5,
  showGridLines: true
})

// 计算属性
const gridConfig = computed(() => designerStore.formConfig.layout)

// 间距值（转换为数字）
const columnGapValue = ref(20)
const rowGapValue = ref(20)
const minRowHeightValue = ref(60)

// 预设配置
const presets = {
  '2col': { columns: 2, columnGap: '24px', rowGap: '24px' },
  '3col': { columns: 3, columnGap: '20px', rowGap: '20px' },
  '4col': { columns: 4, columnGap: '16px', rowGap: '16px' },
  '6col': { columns: 6, columnGap: '12px', rowGap: '12px' }
}

// 方法
const updateConfig = () => {
  const newConfig = {
    ...localConfig.value,
    columnGap: columnGapValue.value + 'px',
    rowGap: rowGapValue.value + 'px',
    minRowHeight: minRowHeightValue.value + 'px'
  }
  
  if (localConfig.value.rows === 'fixed') {
    newConfig.rows = localConfig.value.fixedRows
  } else {
    newConfig.rows = 'auto'
  }
  
  designerStore.updateGridLayout(newConfig)
}

const updateColumnGap = () => {
  localConfig.value.columnGap = columnGapValue.value + 'px'
  updateConfig()
}

const updateRowGap = () => {
  localConfig.value.rowGap = rowGapValue.value + 'px'
  updateConfig()
}

const updateMinRowHeight = () => {
  localConfig.value.minRowHeight = minRowHeightValue.value + 'px'
  updateConfig()
}

const applyPreset = (presetKey) => {
  if (!presetKey || !presets[presetKey]) return
  
  const preset = presets[presetKey]
  localConfig.value.columns = preset.columns
  columnGapValue.value = parseInt(preset.columnGap)
  rowGapValue.value = parseInt(preset.rowGap)
  
  updateConfig()
}

const autoArrange = () => {
  designerStore.autoArrangeComponents()
}

const resetToDefault = () => {
  localConfig.value = {
    columns: 3,
    rows: 'auto',
    fixedRows: 5,
    showGridLines: true
  }
  columnGapValue.value = 20
  rowGapValue.value = 20
  minRowHeightValue.value = 60
  selectedPreset.value = '3col'
  
  updateConfig()
}

// 初始化本地配置
const initLocalConfig = () => {
  const config = gridConfig.value
  localConfig.value = {
    columns: config.columns || 3,
    rows: typeof config.rows === 'number' ? 'fixed' : 'auto',
    fixedRows: typeof config.rows === 'number' ? config.rows : 5,
    showGridLines: config.showGridLines !== false
  }
  
  columnGapValue.value = parseInt(config.columnGap) || 20
  rowGapValue.value = parseInt(config.rowGap) || 20
  minRowHeightValue.value = parseInt(config.minRowHeight) || 60
  
  // 设置对应的预设
  const currentColumns = localConfig.value.columns
  const presetKey = Object.keys(presets).find(key => presets[key].columns === currentColumns)
  if (presetKey) {
    selectedPreset.value = presetKey
  }
}

// 监听Grid配置变化
watch(gridConfig, initLocalConfig, { deep: true })

// 生命周期
onMounted(() => {
  initLocalConfig()
})
</script>

<style scoped>
.grid-config-panel {
  height: 100%;
}

.grid-presets {
  width: 100%;
}

.grid-presets .v-btn {
  flex: 1;
}

:deep(.v-slider-thumb__label) {
  font-size: 12px;
}

:deep(.v-text-field .v-field__input) {
  text-align: center;
}
</style>

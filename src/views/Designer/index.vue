<template>
  <v-app>
    <v-app-bar color="primary" dark>
      <v-app-bar-title>低代码表单设计器</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn variant="text" @click="previewCode">
        <v-icon>mdi-eye</v-icon>
        预览代码
      </v-btn>
      <v-btn variant="text" @click="exportCode">
        <v-icon>mdi-download</v-icon>
        导出代码
      </v-btn>
      <v-btn variant="text" @click="resetDesigner">
        <v-icon>mdi-refresh</v-icon>
        重置
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid class="pa-0" style="height: calc(100vh - 64px);">
        <v-row no-gutters style="height: 100%;">
          <!-- 左侧组件库 -->
          <v-col cols="2" class="border-e">
            <ComponentLibrary />
          </v-col>

          <!-- 中间设计区域 -->
          <v-col cols="8">
            <DragArea />
          </v-col>

          <!-- 右侧属性面板 -->
          <v-col cols="2" class="border-s">
            <PropertyPanel />
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- 代码预览对话框 -->
    <v-dialog v-model="showCodeDialog" max-width="800px">
      <v-card>
        <v-card-title>
          <span class="text-h5">生成的代码</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="copyCode">
            <v-icon>mdi-content-copy</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <pre class="code-preview"><code>{{ generatedCode }}</code></pre>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="showCodeDialog = false">
            关闭
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDesignerStore } from '@/stores/designer'
import ComponentLibrary from '@/modules/ComponentLibrary/index.vue'
import DragArea from '@/modules/DragArea/index.vue'
import PropertyPanel from '@/modules/PropertyPanel/index.vue'
import { generateVueCode } from '@/modules/CodeGenerator'

const designerStore = useDesignerStore()
const showCodeDialog = ref(false)
const generatedCode = ref('')

// 预览代码
const previewCode = () => {
  generatedCode.value = generateVueCode(designerStore.components, designerStore.formConfig)
  showCodeDialog.value = true
}

// 导出代码
const exportCode = () => {
  const code = generateVueCode(designerStore.components, designerStore.formConfig)
  const blob = new Blob([code], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'generated-form.vue'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 复制代码
const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(generatedCode.value)
    // 这里可以添加成功提示
  } catch (err) {
    console.error('复制失败:', err)
  }
}

// 重置设计器
const resetDesigner = () => {
  if (confirm('确定要重置设计器吗？这将清除所有组件。')) {
    designerStore.reset()
  }
}
</script>

<style scoped>
.border-e {
  border-right: 1px solid #e0e0e0;
}

.border-s {
  border-left: 1px solid #e0e0e0;
}

.code-preview {
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
  max-height: 400px;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.4;
}
</style>

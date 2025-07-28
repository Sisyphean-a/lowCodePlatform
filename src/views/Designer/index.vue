<template>
  <v-app>
    <v-app-bar color="primary" dark elevation="2">
      <v-app-bar-title>
        <v-icon class="me-2">mdi-view-dashboard</v-icon>
        低代码平台设计器
      </v-app-bar-title>
      <v-spacer></v-spacer>

      <!-- 工具栏按钮组 -->
      <v-btn-group variant="text" color="white">
        <v-btn @click="undoAction" :disabled="!canUndo">
          <v-icon>mdi-undo</v-icon>
          <v-tooltip activator="parent" location="bottom">撤销</v-tooltip>
        </v-btn>
        <v-btn @click="redoAction" :disabled="!canRedo">
          <v-icon>mdi-redo</v-icon>
          <v-tooltip activator="parent" location="bottom">重做</v-tooltip>
        </v-btn>
      </v-btn-group>

      <v-divider vertical class="mx-2"></v-divider>

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
      <div class="designer-layout" style="height: calc(100vh - 64px);">
        <!-- 左侧组件库面板 -->
        <div class="left-panel" :style="{ width: leftPanelWidth + 'px' }">
          <ComponentLibrary />
        </div>

        <!-- 左侧分割线 -->
        <ResizableSplitter
          direction="vertical"
          :min-size="200"
          :max-size="400"
          @resize="handleLeftPanelResize"
        />

        <!-- 中间主要内容区域 -->
        <div class="main-content">
          <!-- 顶部工具栏 -->
          <div class="toolbar">
            <DesignerToolbar />
          </div>

          <!-- 设计画布 -->
          <div class="canvas-container">
            <DragArea />
          </div>
        </div>

        <!-- 右侧分割线 -->
        <ResizableSplitter
          direction="vertical"
          :min-size="280"
          :max-size="500"
          @resize="handleRightPanelResize"
        />

        <!-- 右侧属性面板 -->
        <div class="right-panel" :style="{ width: rightPanelWidth + 'px' }">
          <PropertyPanel />
        </div>
      </div>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useDesignerStore } from '@/stores/designer'
import ComponentLibrary from '@/modules/ComponentLibrary/index.vue'
import DragArea from '@/modules/DragArea/index.vue'
import PropertyPanel from '@/modules/PropertyPanel/index.vue'
import ResizableSplitter from '@/components/common/ResizableSplitter.vue'
import DesignerToolbar from '@/components/common/DesignerToolbar.vue'
import { generateVueCode } from '@/modules/CodeGenerator'

const designerStore = useDesignerStore()
const showCodeDialog = ref(false)
const generatedCode = ref('')

// 面板宽度管理
const leftPanelWidth = ref(280)
const rightPanelWidth = ref(320)

// 计算属性
const components = computed(() => designerStore.components)
const canUndo = computed(() => designerStore.canUndo)
const canRedo = computed(() => designerStore.canRedo)

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

// 面板大小调整
const handleLeftPanelResize = (newWidth) => {
  leftPanelWidth.value = newWidth
}

const handleRightPanelResize = (newWidth) => {
  rightPanelWidth.value = newWidth
}

// 工具栏操作
const undoAction = () => {
  designerStore.undo()
}

const redoAction = () => {
  designerStore.redo()
}



// 键盘快捷键处理
const handleKeyDown = (event) => {
  // 防止在输入框中触发快捷键
  if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
    return
  }

  const { ctrlKey, metaKey, key } = event
  const isCtrl = ctrlKey || metaKey

  if (isCtrl) {
    switch (key.toLowerCase()) {
      case 'z':
        event.preventDefault()
        if (event.shiftKey) {
          designerStore.redo()
        } else {
          designerStore.undo()
        }
        break
      case 'y':
        event.preventDefault()
        designerStore.redo()
        break
      case 'c':
        event.preventDefault()
        if (designerStore.selectedComponentId) {
          const componentData = designerStore.copyComponent(designerStore.selectedComponentId)
          localStorage.setItem('copiedComponent', JSON.stringify(componentData))
        }
        break
      case 'v':
        event.preventDefault()
        try {
          const copiedData = localStorage.getItem('copiedComponent')
          if (copiedData) {
            const componentData = JSON.parse(copiedData)
            designerStore.pasteComponent(componentData)
          }
        } catch (error) {
          console.error('粘贴失败:', error)
        }
        break
      case 'a':
        event.preventDefault()
        // 全选所有组件
        designerStore.selectedComponentIds = designerStore.components.map(c => c.id)
        break
    }
  } else {
    switch (key) {
      case 'Delete':
      case 'Backspace':
        event.preventDefault()
        if (designerStore.selectedComponentId) {
          designerStore.removeComponent(designerStore.selectedComponentId)
        }
        break
      case 'Escape':
        event.preventDefault()
        designerStore.clearSelection()
        break
    }
  }
}

// 重置设计器
const resetDesigner = () => {
  if (confirm('确定要重置设计器吗？这将清除所有组件。')) {
    designerStore.reset()
  }
}

// 生命周期
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.designer-layout {
  display: flex;
  height: 100%;
  overflow: hidden;
}

.left-panel {
  flex-shrink: 0;
  background-color: #fafafa;
  border-right: 1px solid #e0e0e0;
  overflow: hidden;
}

.right-panel {
  flex-shrink: 0;
  background-color: #fafafa;
  border-left: 1px solid #e0e0e0;
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #ffffff;
}

.toolbar {
  flex-shrink: 0;
  border-bottom: 1px solid #e0e0e0;
  background-color: #fafafa;
}

.canvas-container {
  flex: 1;
  overflow: hidden;
  position: relative;
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

/* 响应式设计 */
@media (max-width: 1200px) {
  .left-panel {
    width: 240px !important;
  }

  .right-panel {
    width: 280px !important;
  }
}

@media (max-width: 768px) {
  .designer-layout {
    flex-direction: column;
  }

  .left-panel,
  .right-panel {
    width: 100% !important;
    height: 200px;
  }

  .main-content {
    flex: 1;
    min-height: 0;
  }
}
</style>

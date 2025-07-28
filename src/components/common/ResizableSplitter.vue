<template>
  <div 
    class="resizable-splitter"
    :class="{ 'horizontal': direction === 'horizontal', 'vertical': direction === 'vertical' }"
    @mousedown="startResize"
    @touchstart="startResize"
  >
    <div class="splitter-line">
      <div class="splitter-handle">
        <v-icon size="16" color="grey-lighten-1">
          {{ direction === 'horizontal' ? 'mdi-drag-horizontal' : 'mdi-drag-vertical' }}
        </v-icon>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  direction: {
    type: String,
    default: 'vertical', // 'horizontal' | 'vertical'
    validator: (value) => ['horizontal', 'vertical'].includes(value)
  },
  minSize: {
    type: Number,
    default: 200
  },
  maxSize: {
    type: Number,
    default: 600
  }
})

const emit = defineEmits(['resize'])

const isResizing = ref(false)
const startPosition = ref(0)
const startSize = ref(0)

const startResize = (event) => {
  isResizing.value = true
  startPosition.value = props.direction === 'horizontal' ? event.clientY : event.clientX
  
  // 获取当前面板大小
  const panel = event.target.closest('.resizable-splitter').previousElementSibling
  if (panel) {
    startSize.value = props.direction === 'horizontal' ? panel.offsetHeight : panel.offsetWidth
  }
  
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
  document.addEventListener('touchmove', handleResize)
  document.addEventListener('touchend', stopResize)
  
  // 防止文本选择
  document.body.style.userSelect = 'none'
  document.body.style.cursor = props.direction === 'horizontal' ? 'row-resize' : 'col-resize'
  
  event.preventDefault()
}

const handleResize = (event) => {
  if (!isResizing.value) return
  
  const currentPosition = props.direction === 'horizontal' ? event.clientY : event.clientX
  const delta = currentPosition - startPosition.value
  const newSize = Math.max(props.minSize, Math.min(props.maxSize, startSize.value + delta))
  
  emit('resize', newSize)
}

const stopResize = () => {
  isResizing.value = false
  
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
  document.removeEventListener('touchmove', handleResize)
  document.removeEventListener('touchend', stopResize)
  
  // 恢复样式
  document.body.style.userSelect = ''
  document.body.style.cursor = ''
}

onUnmounted(() => {
  if (isResizing.value) {
    stopResize()
  }
})
</script>

<style scoped>
.resizable-splitter {
  position: relative;
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  transition: background-color 0.2s ease;
  z-index: 10;
}

.resizable-splitter:hover {
  background-color: #e3f2fd;
}

.resizable-splitter.vertical {
  width: 4px;
  cursor: col-resize;
  min-height: 100%;
}

.resizable-splitter.horizontal {
  height: 4px;
  cursor: row-resize;
  min-width: 100%;
}

.splitter-line {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.splitter-handle {
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.resizable-splitter:hover .splitter-handle {
  opacity: 1;
}

.vertical .splitter-handle {
  width: 20px;
  height: 40px;
  background-color: rgba(25, 118, 210, 0.1);
  border-radius: 10px;
  margin-left: -8px;
}

.horizontal .splitter-handle {
  width: 40px;
  height: 20px;
  background-color: rgba(25, 118, 210, 0.1);
  border-radius: 10px;
  margin-top: -8px;
}
</style>

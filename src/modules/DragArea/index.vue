<template>
  <div class="drag-area">
    <div class="canvas-wrapper" ref="canvasWrapper">
      <!-- Grid布局框架 -->
      <GridLayoutFramework />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { GridLayoutFramework } from '@/modules/GridLayout'

// 模板引用
const canvasWrapper = ref(null)
</script>

<style scoped>
.drag-area {
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.canvas-wrapper {
  height: 100%;
  width: 100%;
  position: relative;
  overflow: auto;
}
</style>

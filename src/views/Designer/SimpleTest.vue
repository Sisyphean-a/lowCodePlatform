<template>
  <v-app>
    <v-app-bar color="primary" dark>
      <v-app-bar-title>低代码表单设计器 - 测试版</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title>
                <v-icon class="me-2">mdi-widgets</v-icon>
                测试页面
              </v-card-title>
              <v-card-text>
                <p>如果您能看到这个页面，说明Vuetify配置正确。</p>
                
                <v-btn color="primary" class="me-2">
                  <v-icon>mdi-plus</v-icon>
                  测试按钮
                </v-btn>
                
                <v-text-field
                  label="测试输入框"
                  variant="outlined"
                  class="mt-4"
                ></v-text-field>
                
                <v-select
                  label="测试选择器"
                  :items="['选项1', '选项2', '选项3']"
                  variant="outlined"
                  class="mt-4"
                ></v-select>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
// 简单的测试组件，不需要复杂的逻辑
</script>

<style scoped>
/* 基础样式 */
</style>

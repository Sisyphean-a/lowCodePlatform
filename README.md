# 低代码平台设计器

一个功能强大、易于使用的低代码平台设计器，基于 Vue 3 + Vuetify 构建。支持可视化拖拽设计、自由布局、丰富的组件库和完善的属性配置。

## ✨ 特性

### 🎨 可视化设计
- **自由拖拽布局**：支持组件的自由拖拽定位，不再局限于网格布局
- **实时预览**：所见即所得的设计体验
- **多选操作**：支持多个组件的批量选择和操作
- **网格吸附**：可选的网格对齐功能，确保布局整齐

### 🧩 丰富的组件库
- **布局组件**：容器、卡片、分割线等
- **表单组件**：输入框、选择器、日期选择器、单选框、复选框、开关、滑块等
- **展示组件**：文本、标题、图片、表格等
- **交互组件**：按钮、链接等

### 🛠️ 强大的工具栏
- **撤销/重做**：完整的操作历史管理
- **复制/粘贴**：支持组件的复制粘贴操作
- **对齐工具**：左对齐、居中、右对齐、顶部对齐、垂直居中、底部对齐
- **分布工具**：水平分布、垂直分布
- **层级管理**：置顶、置底、上移一层、下移一层
- **画布控制**：网格显示/隐藏、吸附开关、缩放控制

### 📋 多面板管理
- **组件库面板**：分类展示所有可用组件，支持搜索和筛选
- **属性配置面板**：动态属性配置、位置尺寸调整、样式编辑
- **组件树面板**：层级结构展示、重命名、显示/隐藏控制

### ⌨️ 快捷键支持
- `Ctrl+Z` / `Cmd+Z`：撤销
- `Ctrl+Y` / `Cmd+Y` / `Ctrl+Shift+Z`：重做
- `Ctrl+C` / `Cmd+C`：复制
- `Ctrl+V` / `Cmd+V`：粘贴
- `Ctrl+A` / `Cmd+A`：全选
- `Delete` / `Backspace`：删除选中组件
- `Escape`：取消选择

### 🎯 响应式布局
- **可调节面板**：左右面板宽度可自由调节
- **自适应设计**：中心设计区域自动适应屏幕大小
- **移动端友好**：支持移动设备上的基本操作

## 🚀 快速开始

### 环境要求
- Node.js 16+
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 📖 使用指南

### 基本操作

1. **添加组件**
   - 从左侧组件库拖拽组件到设计画布
   - 组件会自动定位到鼠标释放的位置

2. **选择组件**
   - 单击组件进行选择
   - 按住 Ctrl/Cmd 键多选组件
   - 拖拽选择框进行区域选择

3. **移动组件**
   - 拖拽选中的组件到新位置
   - 支持网格吸附对齐

4. **调整大小**
   - 选中组件后拖拽四角的调整手柄
   - 在属性面板中精确设置尺寸

5. **配置属性**
   - 在右侧属性面板中修改组件属性
   - 支持实时预览属性变化

### 高级功能

1. **组件对齐**
   - 选择多个组件后使用工具栏的对齐工具
   - 支持左对齐、居中、右对齐等多种对齐方式

2. **层级管理**
   - 使用工具栏的层级工具调整组件层级
   - 在组件树面板中查看和管理层级结构

3. **样式编辑**
   - 在样式面板中设置背景色、边框、阴影等样式
   - 支持颜色选择器和数值输入

4. **代码生成**
   - 点击顶部工具栏的"预览代码"查看生成的 Vue 代码
   - 点击"导出代码"下载代码文件

## 🏗️ 技术架构

### 核心技术栈
- **Vue 3**：使用 Composition API 构建
- **Vuetify 3**：Material Design 组件库
- **Pinia**：状态管理
- **Vite**：构建工具

### 项目结构
```
src/
├── components/          # 通用组件
│   └── common/         # 公共组件
├── modules/            # 功能模块
│   ├── ComponentLibrary/  # 组件库
│   ├── DragArea/          # 设计画布
│   ├── PropertyPanel/     # 属性面板
│   ├── ComponentTree/     # 组件树
│   └── CodeGenerator/     # 代码生成器
├── stores/             # 状态管理
│   ├── designer.js     # 设计器状态
│   └── components.js   # 组件定义
├── views/              # 页面视图
└── plugins/            # 插件配置
```

### 核心模块

1. **设计器状态管理** (`stores/designer.js`)
   - 组件管理：添加、删除、更新组件
   - 选择管理：单选、多选、清空选择
   - 历史管理：撤销、重做操作
   - 画布配置：网格、缩放、吸附设置

2. **组件定义** (`stores/components.js`)
   - 组件库定义：类型、属性、配置架构
   - 组件实例创建：根据类型创建组件实例
   - 分类管理：按功能分类组件

3. **拖拽画布** (`modules/DragArea/`)
   - 自由拖拽：支持组件的自由定位
   - 调整大小：拖拽手柄调整组件尺寸
   - 选择交互：单选、多选、框选
   - 网格系统：可选的网格对齐功能

## 🔧 自定义开发

### 添加新组件

1. 在 `stores/components.js` 中定义组件：
```javascript
{
  type: 'custom-component',
  name: '自定义组件',
  icon: 'mdi-puzzle',
  category: 'custom',
  defaultProps: {
    // 默认属性
  },
  configSchema: [
    // 属性配置架构
  ]
}
```

2. 在 `modules/DragArea/ComponentRenderer.vue` 中添加渲染逻辑

3. 更新组件库的分类配置

### 扩展属性类型

在属性面板中支持新的属性类型：

1. 在 `modules/PropertyPanel/index.vue` 中添加新的属性编辑器
2. 更新属性配置架构的类型定义

### 自定义主题

修改 `src/plugins/vuetify.js` 中的主题配置：
```javascript
const theme = {
  themes: {
    light: {
      colors: {
        primary: '#1976D2',
        // 其他颜色配置
      }
    }
  }
}
```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 提交 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vuetify](https://vuetifyjs.com/) - Vue.js 的 Material Design 组件框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Pinia](https://pinia.vuejs.org/) - Vue.js 的状态管理库

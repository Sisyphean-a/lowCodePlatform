# 低代码平台设计器

一个功能强大、易于使用的低代码平台设计器，基于 Vue 3 + Vuetify 构建。支持可视化拖拽设计、自由布局、丰富的组件库和完善的属性配置。

## ✨ 特性

### 🎨 可视化设计

- **Grid 布局框架**：基于 CSS Grid 的智能布局系统，确保设计与代码一致
- **实时预览**：所见即所得的设计体验，Grid 布局可视化显示
- **多选操作**：支持多个组件的批量选择和操作
- **智能对齐**：组件自动对齐到 Grid 单元格，布局更加规整

### 🧩 丰富的组件库

- **布局组件**：容器、卡片、分割线等
- **表单组件**：输入框、选择器、日期选择器、单选框、复选框、开关、滑块等
- **展示组件**：文本、标题、图片、表格等
- **交互组件**：按钮、链接等

### 🛠️ 强大的工具栏

- **撤销/重做**：完整的操作历史管理
- **复制/粘贴**：支持组件的复制粘贴操作
- **Grid 布局控制**：列数调整、间距设置、网格线显示/隐藏
- **自动排列**：一键自动排列所有组件到 Grid 布局
- **布局预设**：2 列、3 列、4 列、6 列快速布局模板
- **画布控制**：缩放控制、Grid 配置实时预览

### 📋 多面板管理

- **组件库面板**：分类展示所有可用组件，支持搜索和筛选
- **属性配置面板**：动态属性配置、Grid 位置调整、样式编辑
- **Grid 布局面板**：完整的 Grid 布局配置，包括行列数、间距、预设等
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

## � Grid 布局框架

### 设计理念

本低代码平台采用**CSS Grid 布局**作为核心布局框架，这是经过深思熟虑的技术选择：

#### 为什么选择 Grid 布局？

1. **设计与代码一致性**：设计器中看到的 Grid 布局与最终生成的代码完全一致
2. **现代化标准**：CSS Grid 是现代浏览器的原生布局标准，性能优异
3. **简单而强大**：无需额外容器组件，直接使用 CSS Grid 的强大功能
4. **响应式友好**：天然支持响应式设计，适配不同屏幕尺寸

#### 核心特性

- **可视化 Grid**：在设计器中直接显示 Grid 网格线和单元格
- **智能定位**：组件自动对齐到 Grid 单元格，避免布局混乱
- **灵活配置**：支持 1-12 列的灵活配置，行数可自动或固定
- **间距控制**：精确控制行间距和列间距（0-50px）
- **预设模板**：提供 2 列、3 列、4 列、6 列等常用布局预设
- **实时预览**：配置变更实时反映到设计器和生成代码中

### Grid 配置选项

| 配置项     | 说明                 | 默认值 | 范围       |
| ---------- | -------------------- | ------ | ---------- |
| 列数       | Grid 布局的列数      | 3      | 1-12       |
| 行数       | 自动或固定行数       | auto   | auto/1-20  |
| 列间距     | 列之间的间距         | 20px   | 0-50px     |
| 行间距     | 行之间的间距         | 20px   | 0-50px     |
| 最小行高   | 每行的最小高度       | 60px   | 40-200px   |
| 显示网格线 | 是否显示 Grid 网格线 | true   | true/false |

### 使用方法

1. **基础使用**

   - 从组件库拖拽组件到 Grid 画布
   - 组件自动对齐到最近的 Grid 单元格
   - 在属性面板的"布局"标签页配置 Grid 参数

2. **快速配置**

   - 使用预设模板快速设置常用布局
   - 点击"自动排列"重新整理所有组件
   - 实时调整间距和行列数

3. **高级功能**
   - 支持组件跨列和跨行（未来版本）
   - 响应式断点配置（未来版本）
   - 嵌套 Grid 布局（未来版本）

## �🏗️ 技术架构

### 核心技术栈

- **Vue 3**：使用 Composition API 构建
- **Vuetify 3**：Material Design 组件库
- **Pinia**：状态管理
- **Vite**：构建工具
- **CSS Grid**：原生 Grid 布局系统

### 项目结构

```
src/
├── components/          # 通用组件
│   └── common/         # 公共组件
├── modules/            # 功能模块
│   ├── ComponentLibrary/  # 组件库
│   ├── DragArea/          # 设计画布
│   ├── GridLayout/        # Grid布局框架
│   │   ├── GridLayoutFramework.vue  # Grid布局核心组件
│   │   ├── GridConfigPanel.vue      # Grid配置面板
│   │   └── index.js                 # 模块导出
│   ├── PropertyPanel/     # 属性面板
│   ├── ComponentTree/     # 组件树
│   └── CodeGenerator/     # 代码生成器
├── stores/             # 状态管理
│   ├── designer.js     # 设计器状态（包含Grid布局管理）
│   └── components.js   # 组件定义
├── utils/              # 工具函数
│   └── gridUtils.js    # Grid布局工具函数
├── views/              # 页面视图
└── plugins/            # 插件配置
```

### 核心模块

1. **Grid 布局框架** (`modules/GridLayout/`)

   - **GridLayoutFramework.vue**：Grid 布局的可视化显示和交互
     - CSS Grid 容器渲染
     - 网格线显示和单元格高亮
     - 拖拽定位到 Grid 单元格
     - 组件 Grid 坐标管理
   - **GridConfigPanel.vue**：Grid 布局配置界面
     - 行列数配置（1-12 列，自动/固定行数）
     - 间距设置（列间距、行间距、最小行高）
     - 布局预设（2 列、3 列、4 列、6 列）
     - 实时预览和自动排列功能

2. **Grid 工具函数** (`utils/gridUtils.js`)

   - 坐标转换：像素坐标与 Grid 坐标互转
   - 位置计算：单元格尺寸、可用位置查找
   - 冲突检测：Grid 位置占用检查
   - 样式生成：Grid 容器和项目 CSS 样式

3. **设计器状态管理** (`stores/designer.js`)

   - 组件管理：添加、删除、更新组件（支持 Grid 定位）
   - Grid 布局管理：Grid 配置更新、组件 Grid 位置管理
   - 选择管理：单选、多选、清空选择
   - 历史管理：撤销、重做操作
   - 自动排列：智能重排组件到 Grid 布局

4. **组件定义** (`stores/components.js`)

   - 组件库定义：类型、属性、配置架构
   - 组件实例创建：根据类型创建组件实例（包含 Grid 位置）
   - 分类管理：按功能分类组件

5. **设计画布** (`modules/DragArea/`)

   - Grid 布局集成：使用 GridLayoutFramework 替代自由定位
   - 组件渲染：在 Grid 单元格中渲染组件
   - 交互处理：拖拽、选择、调整等操作
   - 向后兼容：保留原有自由定位系统（可选）

6. **代码生成器** (`modules/CodeGenerator/`)
   - Grid 样式生成：根据 Grid 配置生成 CSS Grid 样式
   - 模板生成：生成使用 Grid 布局的 Vue 模板
   - 一致性保证：确保生成代码与设计器显示一致

## 🔧 Grid 布局技术细节

### 数据结构设计

#### Grid 配置结构

```javascript
// formConfig.layout
{
  type: 'grid',           // 布局类型
  columns: 3,             // 列数 (1-12)
  rows: 'auto',           // 行数 ('auto' 或具体数字)
  columnGap: '20px',      // 列间距
  rowGap: '20px',         // 行间距
  minRowHeight: '60px',   // 最小行高
  showGridLines: true     // 显示网格线
}
```

#### 组件 Grid 位置结构

```javascript
// component.gridPosition
{
  column: 1,              // 起始列 (1-based)
  row: 1,                 // 起始行 (1-based)
  columnSpan: 1,          // 跨列数
  rowSpan: 1              // 跨行数
}
```

### 核心算法

1. **坐标转换算法**

   - 像素坐标 → Grid 坐标：`pixelToGridPosition()`
   - Grid 坐标 → 像素坐标：`gridToPixelPosition()`
   - 考虑容器尺寸、缩放比例、间距等因素

2. **冲突检测算法**

   - 检查 Grid 位置是否被占用：`isGridPositionOccupied()`
   - 支持跨列跨行的复杂冲突检测
   - 排除指定组件的冲突检查

3. **自动排列算法**
   - 查找下一个可用位置：`findNextAvailablePosition()`
   - 从左到右、从上到下的贪心算法
   - 考虑组件跨度的最优放置

### 性能优化

1. **渲染优化**

   - 使用 CSS Grid 原生性能
   - 避免频繁的 DOM 操作
   - 合理使用 Vue 的响应式系统

2. **计算优化**
   - 缓存 Grid 容器尺寸计算
   - 防抖处理配置变更
   - 延迟执行自动排列

### 兼容性考虑

1. **向后兼容**

   - 保留原有 position 属性
   - 提供坐标转换函数
   - 支持渐进式迁移

2. **浏览器兼容**
   - CSS Grid 支持现代浏览器
   - 提供降级方案（如需要）

### 扩展性设计

1. **模块化架构**

   - Grid 工具函数独立封装
   - 组件间松耦合设计
   - 易于添加新功能

2. **配置驱动**
   - 所有 Grid 参数可配置
   - 支持主题和预设
   - 便于定制化开发

## 🔧 自定义开发

### 扩展 Grid 布局功能

1. **添加新的 Grid 配置选项**

```javascript
// 在 GridConfigPanel.vue 中添加新配置
const newConfigOption = {
  key: "customOption",
  label: "自定义选项",
  type: "input",
  default: "defaultValue",
};
```

2. **自定义 Grid 工具函数**

```javascript
// 在 utils/gridUtils.js 中添加新函数
export function customGridFunction(params) {
  // 自定义Grid处理逻辑
}
```

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
  ],
  // Grid布局相关配置
  gridConfig: {
    defaultSpan: { columnSpan: 1, rowSpan: 1 },
    minSpan: { columnSpan: 1, rowSpan: 1 },
    maxSpan: { columnSpan: 12, rowSpan: 5 }
  }
}
```

2. 在 `modules/DragArea/ComponentRenderer.vue` 中添加渲染逻辑

3. 确保组件支持 Grid 定位和样式

4. 更新组件库的分类配置

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
        primary: "#1976D2",
        // 其他颜色配置
      },
    },
  },
};
```

## 🚀 后续扩展规划

### Grid 布局增强功能

1. **高级 Grid 功能**

   - 组件跨列跨行支持
   - 嵌套 Grid 布局
   - Grid 区域命名和模板

2. **响应式 Grid**

   - 断点配置（手机、平板、桌面）
   - 不同屏幕尺寸的 Grid 参数
   - 自适应列数调整

3. **Grid 模板系统**

   - 预定义 Grid 模板库
   - 自定义模板保存和分享
   - 模板导入导出功能

4. **可视化增强**
   - Grid 单元格编号显示
   - 拖拽时的实时预览
   - 更丰富的视觉反馈

### 注意事项

1. **性能考虑**

   - 大量组件时的渲染性能
   - Grid 计算的优化空间
   - 内存使用的监控

2. **用户体验**

   - Grid 学习曲线的平滑化
   - 错误提示和引导
   - 快捷操作的完善

3. **代码质量**

   - 单元测试的完善
   - 类型定义的添加
   - 文档的持续更新

4. **兼容性维护**
   - 旧版本数据的迁移
   - API 的向后兼容
   - 浏览器支持的跟进

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### Grid 布局相关贡献

1. **功能增强**

   - 新的 Grid 配置选项
   - 更智能的自动排列算法
   - 性能优化建议

2. **Bug 修复**

   - Grid 坐标计算问题
   - 拖拽交互异常
   - 样式显示错误

3. **文档完善**
   - 使用教程和示例
   - API 文档补充
   - 最佳实践分享

### 贡献流程

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/grid-enhancement`
3. 提交更改：`git commit -m 'Add grid enhancement feature'`
4. 推送分支：`git push origin feature/grid-enhancement`
5. 提交 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vuetify](https://vuetifyjs.com/) - Vue.js 的 Material Design 组件框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Pinia](https://pinia.vuejs.org/) - Vue.js 的状态管理库

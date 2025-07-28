import { defineStore } from 'pinia'

export const useComponentsStore = defineStore('components', {
  state: () => ({
    // 可用组件库
    availableComponents: [
      // 布局组件
      {
        type: 'container',
        name: '容器',
        icon: 'mdi-view-dashboard-outline',
        category: 'layout',
        defaultProps: {
          padding: '16px',
          backgroundColor: 'transparent',
          borderRadius: '4px'
        },
        configSchema: [
          {
            key: 'label',
            label: '标签',
            type: 'input',
            default: '容器'
          },
          {
            key: 'padding',
            label: '内边距',
            type: 'input',
            default: '16px'
          },
          {
            key: 'backgroundColor',
            label: '背景色',
            type: 'color',
            default: 'transparent'
          }
        ]
      },
      {
        type: 'card',
        name: '卡片',
        icon: 'mdi-card-outline',
        category: 'layout',
        defaultProps: {
          title: '卡片标题',
          elevation: 2,
          outlined: false
        },
        configSchema: [
          {
            key: 'title',
            label: '标题',
            type: 'input',
            default: '卡片标题'
          },
          {
            key: 'elevation',
            label: '阴影',
            type: 'number',
            default: 2
          },
          {
            key: 'outlined',
            label: '边框模式',
            type: 'switch',
            default: false
          }
        ]
      },
      {
        type: 'divider',
        name: '分割线',
        icon: 'mdi-minus',
        category: 'layout',
        defaultProps: {
          thickness: 1,
          color: '#e0e0e0'
        },
        configSchema: [
          {
            key: 'thickness',
            label: '厚度',
            type: 'number',
            default: 1
          },
          {
            key: 'color',
            label: '颜色',
            type: 'color',
            default: '#e0e0e0'
          }
        ]
      },

      // 表单组件
      {
        type: 'el-input',
        name: '输入框',
        icon: 'mdi-form-textbox',
        category: 'form',
        defaultProps: {
          placeholder: '请输入',
          clearable: true,
          size: 'small'
        },
        configSchema: [
          {
            key: 'label',
            label: '标签',
            type: 'input',
            required: true,
            default: '输入框'
          },
          {
            key: 'placeholder',
            label: '占位符',
            type: 'input',
            default: '请输入'
          },
          {
            key: 'clearable',
            label: '可清空',
            type: 'switch',
            default: true
          },
          {
            key: 'disabled',
            label: '禁用',
            type: 'switch',
            default: false
          }
        ]
      },
      {
        type: 'el-textarea',
        name: '文本域',
        icon: 'mdi-text-box-outline',
        category: 'form',
        defaultProps: {
          placeholder: '请输入内容',
          rows: 3,
          autosize: false
        },
        configSchema: [
          {
            key: 'label',
            label: '标签',
            type: 'input',
            default: '文本域'
          },
          {
            key: 'placeholder',
            label: '占位符',
            type: 'input',
            default: '请输入内容'
          },
          {
            key: 'rows',
            label: '行数',
            type: 'number',
            default: 3
          },
          {
            key: 'autosize',
            label: '自适应高度',
            type: 'switch',
            default: false
          }
        ]
      },
      {
        type: 'el-select',
        name: '选择器',
        icon: 'mdi-form-dropdown',
        category: 'form',
        defaultProps: {
          placeholder: '请选择',
          clearable: true,
          size: 'small'
        },
        configSchema: [
          {
            key: 'label',
            label: '标签',
            type: 'input',
            required: true,
            default: '选择器'
          },
          {
            key: 'placeholder',
            label: '占位符',
            type: 'input',
            default: '请选择'
          },
          {
            key: 'options',
            label: '选项',
            type: 'options',
            default: [
              { label: '选项1', value: '1' },
              { label: '选项2', value: '2' }
            ]
          },
          {
            key: 'clearable',
            label: '可清空',
            type: 'switch',
            default: true
          },
          {
            key: 'multiple',
            label: '多选',
            type: 'switch',
            default: false
          }
        ]
      },
      {
        type: 'el-radio-group',
        name: '单选框组',
        icon: 'mdi-radiobox-marked',
        category: 'form',
        defaultProps: {
          size: 'small'
        },
        configSchema: [
          {
            key: 'label',
            label: '标签',
            type: 'input',
            default: '单选框组'
          },
          {
            key: 'options',
            label: '选项',
            type: 'options',
            default: [
              { label: '选项1', value: '1' },
              { label: '选项2', value: '2' }
            ]
          },
          {
            key: 'disabled',
            label: '禁用',
            type: 'switch',
            default: false
          }
        ]
      },
      {
        type: 'el-checkbox-group',
        name: '复选框组',
        icon: 'mdi-checkbox-marked',
        category: 'form',
        defaultProps: {
          size: 'small'
        },
        configSchema: [
          {
            key: 'label',
            label: '标签',
            type: 'input',
            default: '复选框组'
          },
          {
            key: 'options',
            label: '选项',
            type: 'options',
            default: [
              { label: '选项1', value: '1' },
              { label: '选项2', value: '2' }
            ]
          },
          {
            key: 'disabled',
            label: '禁用',
            type: 'switch',
            default: false
          }
        ]
      },
      {
        type: 'el-switch',
        name: '开关',
        icon: 'mdi-toggle-switch',
        category: 'form',
        defaultProps: {
          size: 'small',
          activeText: '开启',
          inactiveText: '关闭'
        },
        configSchema: [
          {
            key: 'label',
            label: '标签',
            type: 'input',
            default: '开关'
          },
          {
            key: 'activeText',
            label: '开启文字',
            type: 'input',
            default: '开启'
          },
          {
            key: 'inactiveText',
            label: '关闭文字',
            type: 'input',
            default: '关闭'
          },
          {
            key: 'disabled',
            label: '禁用',
            type: 'switch',
            default: false
          }
        ]
      },
      {
        type: 'el-slider',
        name: '滑块',
        icon: 'mdi-tune-horizontal',
        category: 'form',
        defaultProps: {
          min: 0,
          max: 100,
          step: 1,
          showStops: false
        },
        configSchema: [
          {
            key: 'label',
            label: '标签',
            type: 'input',
            default: '滑块'
          },
          {
            key: 'min',
            label: '最小值',
            type: 'number',
            default: 0
          },
          {
            key: 'max',
            label: '最大值',
            type: 'number',
            default: 100
          },
          {
            key: 'step',
            label: '步长',
            type: 'number',
            default: 1
          }
        ]
      },
      {
        type: 'el-date-picker',
        name: '日期选择器',
        icon: 'mdi-calendar',
        category: 'form',
        defaultProps: {
          placeholder: '请选择日期',
          type: 'date',
          size: 'small',
          format: 'YYYY-MM-DD'
        },
        configSchema: [
          {
            key: 'label',
            label: '标签',
            type: 'input',
            required: true,
            default: '日期选择器'
          },
          {
            key: 'placeholder',
            label: '占位符',
            type: 'input',
            default: '请选择日期'
          },
          {
            key: 'type',
            label: '类型',
            type: 'select',
            options: [
              { label: '日期', value: 'date' },
              { label: '日期时间', value: 'datetime' },
              { label: '日期范围', value: 'daterange' }
            ],
            default: 'date'
          },
          {
            key: 'format',
            label: '格式',
            type: 'input',
            default: 'YYYY-MM-DD'
          }
        ]
      },

      // 展示组件
      {
        type: 'text',
        name: '文本',
        icon: 'mdi-text',
        category: 'display',
        defaultProps: {
          content: '这是一段文本',
          fontSize: '14px',
          color: '#333333',
          fontWeight: 'normal'
        },
        configSchema: [
          {
            key: 'content',
            label: '文本内容',
            type: 'textarea',
            default: '这是一段文本'
          },
          {
            key: 'fontSize',
            label: '字体大小',
            type: 'input',
            default: '14px'
          },
          {
            key: 'color',
            label: '文字颜色',
            type: 'color',
            default: '#333333'
          },
          {
            key: 'fontWeight',
            label: '字体粗细',
            type: 'select',
            options: [
              { label: '正常', value: 'normal' },
              { label: '粗体', value: 'bold' }
            ],
            default: 'normal'
          }
        ]
      },
      {
        type: 'title',
        name: '标题',
        icon: 'mdi-format-title',
        category: 'display',
        defaultProps: {
          content: '标题文本',
          level: 'h2',
          color: '#333333',
          textAlign: 'left'
        },
        configSchema: [
          {
            key: 'content',
            label: '标题内容',
            type: 'input',
            default: '标题文本'
          },
          {
            key: 'level',
            label: '标题级别',
            type: 'select',
            options: [
              { label: 'H1', value: 'h1' },
              { label: 'H2', value: 'h2' },
              { label: 'H3', value: 'h3' },
              { label: 'H4', value: 'h4' }
            ],
            default: 'h2'
          },
          {
            key: 'color',
            label: '文字颜色',
            type: 'color',
            default: '#333333'
          },
          {
            key: 'textAlign',
            label: '对齐方式',
            type: 'select',
            options: [
              { label: '左对齐', value: 'left' },
              { label: '居中', value: 'center' },
              { label: '右对齐', value: 'right' }
            ],
            default: 'left'
          }
        ]
      },
      {
        type: 'image',
        name: '图片',
        icon: 'mdi-image',
        category: 'display',
        defaultProps: {
          src: 'https://via.placeholder.com/200x150',
          alt: '图片',
          width: '200px',
          height: '150px'
        },
        configSchema: [
          {
            key: 'src',
            label: '图片地址',
            type: 'input',
            default: 'https://via.placeholder.com/200x150'
          },
          {
            key: 'alt',
            label: '替代文本',
            type: 'input',
            default: '图片'
          },
          {
            key: 'width',
            label: '宽度',
            type: 'input',
            default: '200px'
          },
          {
            key: 'height',
            label: '高度',
            type: 'input',
            default: '150px'
          }
        ]
      },
      {
        type: 'table',
        name: '表格',
        icon: 'mdi-table',
        category: 'display',
        defaultProps: {
          columns: [
            { label: '姓名', prop: 'name' },
            { label: '年龄', prop: 'age' },
            { label: '地址', prop: 'address' }
          ],
          data: [
            { name: '张三', age: 25, address: '北京市' },
            { name: '李四', age: 30, address: '上海市' }
          ],
          stripe: true,
          border: true
        },
        configSchema: [
          {
            key: 'columns',
            label: '表格列',
            type: 'table-columns',
            default: [
              { label: '姓名', prop: 'name' },
              { label: '年龄', prop: 'age' },
              { label: '地址', prop: 'address' }
            ]
          },
          {
            key: 'stripe',
            label: '斑马纹',
            type: 'switch',
            default: true
          },
          {
            key: 'border',
            label: '边框',
            type: 'switch',
            default: true
          }
        ]
      },

      // 交互组件
      {
        type: 'button',
        name: '按钮',
        icon: 'mdi-gesture-tap-button',
        category: 'interaction',
        defaultProps: {
          text: '按钮',
          type: 'primary',
          size: 'default',
          disabled: false
        },
        configSchema: [
          {
            key: 'text',
            label: '按钮文字',
            type: 'input',
            default: '按钮'
          },
          {
            key: 'type',
            label: '按钮类型',
            type: 'select',
            options: [
              { label: '主要', value: 'primary' },
              { label: '成功', value: 'success' },
              { label: '警告', value: 'warning' },
              { label: '危险', value: 'error' },
              { label: '信息', value: 'info' }
            ],
            default: 'primary'
          },
          {
            key: 'size',
            label: '尺寸',
            type: 'select',
            options: [
              { label: '大', value: 'large' },
              { label: '默认', value: 'default' },
              { label: '小', value: 'small' }
            ],
            default: 'default'
          },
          {
            key: 'disabled',
            label: '禁用',
            type: 'switch',
            default: false
          }
        ]
      },
      {
        type: 'link',
        name: '链接',
        icon: 'mdi-link',
        category: 'interaction',
        defaultProps: {
          text: '链接文本',
          href: '#',
          target: '_self',
          color: '#1976D2'
        },
        configSchema: [
          {
            key: 'text',
            label: '链接文字',
            type: 'input',
            default: '链接文本'
          },
          {
            key: 'href',
            label: '链接地址',
            type: 'input',
            default: '#'
          },
          {
            key: 'target',
            label: '打开方式',
            type: 'select',
            options: [
              { label: '当前窗口', value: '_self' },
              { label: '新窗口', value: '_blank' }
            ],
            default: '_self'
          },
          {
            key: 'color',
            label: '链接颜色',
            type: 'color',
            default: '#1976D2'
          }
        ]
      }
    ]
  }),
  
  getters: {
    getComponentByType: (state) => (type) => {
      return state.availableComponents.find(comp => comp.type === type)
    },
    
    getComponentsByCategory: (state) => (category) => {
      return state.availableComponents.filter(comp => comp.category === category)
    }
  },
  
  actions: {
    // 创建组件实例
    createComponentInstance(type, customProps = {}) {
      const componentDef = this.getComponentByType(type)
      if (!componentDef) {
        throw new Error(`Unknown component type: ${type}`)
      }
      
      return {
        type,
        label: customProps.label || componentDef.configSchema.find(s => s.key === 'label')?.default || '查询条件',
        props: {
          ...componentDef.defaultProps,
          ...customProps
        }
      }
    }
  }
})

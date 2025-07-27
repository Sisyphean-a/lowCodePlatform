import { defineStore } from 'pinia'

export const useComponentsStore = defineStore('components', {
  state: () => ({
    // 可用组件库
    availableComponents: [
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
            default: '查询条件'
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
            default: '查询条件'
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
            default: '查询条件'
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

/**
 * 代码生成器 - 将设计器数据转换为Vue 2 + Element UI代码
 */

// 生成Vue单文件组件代码
export function generateVueCode(components, formConfig) {
  const template = generateTemplate(components, formConfig)
  const script = generateScript(components)
  const style = generateStyle(formConfig)
  
  return `${template}\n\n${script}\n\n${style}`
}

// 生成模板部分
function generateTemplate(components, formConfig) {
  const formItems = components.map(component => generateFormItem(component)).join('\n      ')
  
  return `<template>
  <div class="AAA">
    <el-form
      ref="form"
      :model="conditionParam"
      label-width="${formConfig.labelWidth}"
      class="formGrid"
    >
      ${formItems}
    </el-form>
    <div
      class="bonusButtonDiv"
      v-loading="loading"
      :element-loading-text="loadingText"
    >
      <el-button
        v-for="button in buttons"
        :key="button.text"
        type="primary"
        size="small"
        @click="button.action"
      >
        <i :class="button.icon"> {{ button.text }}</i>
      </el-button>
    </div>
  </div>
</template>`
}

// 生成表单项
function generateFormItem(component) {
  const { type, label, props } = component
  let controlHtml = ''
  
  switch (type) {
    case 'el-input':
      controlHtml = generateInputControl(props)
      break
    case 'el-select':
      controlHtml = generateSelectControl(props)
      break
    case 'el-date-picker':
      controlHtml = generateDatePickerControl(props)
      break
    default:
      controlHtml = `<!-- 未知组件类型: ${type} -->`
  }
  
  return `<el-form-item label="${label}">
        ${controlHtml}
      </el-form-item>`
}

// 生成输入框控件
function generateInputControl(props) {
  const attributes = []
  
  if (props.placeholder) {
    attributes.push(`placeholder="${props.placeholder}"`)
  }
  if (props.clearable) {
    attributes.push('clearable')
  }
  if (props.disabled) {
    attributes.push('disabled')
  }
  if (props.size) {
    attributes.push(`size="${props.size}"`)
  }
  
  return `<el-input${attributes.length ? ' ' + attributes.join(' ') : ''}></el-input>`
}

// 生成选择器控件
function generateSelectControl(props) {
  const attributes = []
  
  if (props.placeholder) {
    attributes.push(`placeholder="${props.placeholder}"`)
  }
  if (props.clearable) {
    attributes.push('clearable')
  }
  if (props.multiple) {
    attributes.push('multiple')
  }
  if (props.disabled) {
    attributes.push('disabled')
  }
  if (props.size) {
    attributes.push(`size="${props.size}"`)
  }
  
  let optionsHtml = ''
  if (props.options && props.options.length > 0) {
    optionsHtml = '\n        ' + props.options.map(option => 
      `<el-option label="${option.label}" value="${option.value}"></el-option>`
    ).join('\n        ') + '\n      '
  }
  
  return `<el-select${attributes.length ? ' ' + attributes.join(' ') : ''}>${optionsHtml}</el-select>`
}

// 生成日期选择器控件
function generateDatePickerControl(props) {
  const attributes = []
  
  if (props.placeholder) {
    attributes.push(`placeholder="${props.placeholder}"`)
  }
  if (props.type) {
    attributes.push(`type="${props.type}"`)
  }
  if (props.format) {
    attributes.push(`format="${props.format}"`)
  }
  if (props.disabled) {
    attributes.push('disabled')
  }
  if (props.size) {
    attributes.push(`size="${props.size}"`)
  }
  
  return `<el-date-picker${attributes.length ? ' ' + attributes.join(' ') : ''}></el-date-picker>`
}

// 生成脚本部分
function generateScript(components) {
  return `<script>
export default {
  components: {},
  mixins: [],
  data() {
    return {
      conditionParam: {},
      loading: false,
      loadingText: '加载中...',
      buttons: [
        {
          text: "按钮1",
          icon: "el-icon-check",
          action: this.reviewPassed,
        },
        {
          text: "查询",
          icon: "el-icon-check",
          action: this.queryResult,
        },
      ],
    };
  },
  computed: {},
  created() {},
  methods: {
    /**
     * @description: 根据查询结果获取列表数据
     */
    getList() {},

    /**
     * @description: 查询
     */
    queryResult() {},

    /**
     * @description: 审核通过
     */
    reviewPassed() {},
  },
};
</script>`
}

// 生成样式部分
function generateStyle(formConfig) {
  const layout = formConfig.layout
  const columns = layout.columns || 3
  const columnGap = layout.columnGap || '20px'
  const rowGap = layout.rowGap || '20px'
  const minRowHeight = layout.minRowHeight || '60px'

  // 生成Grid模板行
  let gridTemplateRows = 'auto'
  if (layout.rows !== 'auto' && typeof layout.rows === 'number') {
    gridTemplateRows = `repeat(${layout.rows}, minmax(${minRowHeight}, auto))`
  }

  return `<style scoped lang="scss">
.formGrid {
  display: grid;
  grid-template-columns: repeat(${columns}, minmax(0, 1fr));
  grid-template-rows: ${gridTemplateRows};
  gap: ${rowGap} ${columnGap};
  margin: 10px 10px;
  text-align: right;
  min-height: 400px;
}

.bonusButtonDiv {
  text-align: right;
  margin: 1px 1px;
  display: flow-root;
  .el-button {
    text-align: right;
    float: right;
    margin: 0 5px 15px 5px;
  }
}

.AAA {
  background-color: white;
  padding: 20px 20px;
  ::v-deep .el-table__header-wrapper .el-table__cell > .cell {
    display: flex;
    justify-content: center;
  }
  ::v-deep .el-button--small {
    padding: 9px 8px;
  }
}
</style>`
}

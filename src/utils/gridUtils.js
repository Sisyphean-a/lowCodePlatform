/**
 * Grid布局工具函数
 * 提供Grid坐标转换、单元格计算、冲突检测等功能
 */

/**
 * 将像素坐标转换为Grid坐标
 * @param {number} x - 像素X坐标
 * @param {number} y - 像素Y坐标
 * @param {Object} gridConfig - Grid配置
 * @param {HTMLElement} gridContainer - Grid容器元素
 * @returns {Object} Grid坐标 {column, row}
 */
export function pixelToGridPosition(x, y, gridConfig, gridContainer) {
  if (!gridContainer) return { column: 1, row: 1 }

  const rect = gridContainer.getBoundingClientRect()

  // 解析gap值
  const columnGapPx = parseInt(gridConfig.columnGap) || 20
  const rowGapPx = parseInt(gridConfig.rowGap) || 20

  // 减去padding偏移，因为网格容器现在有padding
  const relativeX = x - columnGapPx
  const relativeY = y - rowGapPx

  // 如果点击在padding区域内，返回边界位置
  if (relativeX < 0 || relativeY < 0) {
    return { column: 1, row: 1 }
  }

  // 计算考虑gap和padding的单元格尺寸
  const availableWidth = rect.width - 2 * columnGapPx
  const cellWidth = (availableWidth - (gridConfig.columns - 1) * columnGapPx) / gridConfig.columns
  const cellHeight = getCellHeight(gridConfig, gridContainer)

  // 计算Grid坐标（从1开始）
  // 需要考虑gap的影响
  let column = 1
  let accumulatedWidth = 0

  for (let i = 1; i <= gridConfig.columns; i++) {
    const cellEnd = accumulatedWidth + cellWidth
    if (relativeX <= cellEnd) {
      column = i
      break
    }
    accumulatedWidth = cellEnd + columnGapPx
  }

  // 行的计算相对简单，因为行高是固定的
  const totalRowHeight = cellHeight + rowGapPx
  const row = Math.max(1, Math.floor(relativeY / totalRowHeight) + 1)

  return {
    column: Math.max(1, Math.min(gridConfig.columns, column)),
    row
  }
}

/**
 * 将Grid坐标转换为像素坐标
 * @param {number} column - Grid列坐标
 * @param {number} row - Grid行坐标
 * @param {Object} gridConfig - Grid配置
 * @param {HTMLElement} gridContainer - Grid容器元素
 * @returns {Object} 像素坐标 {x, y, width, height}
 */
export function gridToPixelPosition(column, row, gridConfig, gridContainer) {
  if (!gridContainer) return { x: 0, y: 0, width: 200, height: 40 }
  
  const rect = gridContainer.getBoundingClientRect()
  const cellWidth = rect.width / gridConfig.columns
  const cellHeight = getCellHeight(gridConfig, gridContainer)
  
  return {
    x: (column - 1) * cellWidth,
    y: (row - 1) * cellHeight,
    width: cellWidth,
    height: cellHeight
  }
}

/**
 * 获取单元格高度
 * @param {Object} gridConfig - Grid配置
 * @param {HTMLElement} gridContainer - Grid容器元素
 * @returns {number} 单元格高度
 */
export function getCellHeight(gridConfig, gridContainer) {
  if (!gridContainer) return 60

  // 始终使用最小行高，确保网格单元格有固定的高度
  const minRowHeight = parseInt(gridConfig.minRowHeight) || 60

  // 对于auto行模式，直接使用最小行高
  if (gridConfig.rows === 'auto') {
    return minRowHeight
  }

  // 对于固定行数模式，计算实际行高，但不小于最小行高
  const rect = gridContainer.getBoundingClientRect()
  const calculatedHeight = rect.height / gridConfig.rows
  return Math.max(minRowHeight, calculatedHeight)
}

/**
 * 检查Grid位置是否被占用
 * @param {number} column - 列坐标
 * @param {number} row - 行坐标
 * @param {number} columnSpan - 跨列数
 * @param {number} rowSpan - 跨行数
 * @param {Array} components - 组件列表
 * @param {string} excludeId - 排除的组件ID
 * @returns {boolean} 是否被占用
 */
export function isGridPositionOccupied(column, row, columnSpan = 1, rowSpan = 1, components, excludeId = null) {
  return components.some(component => {
    if (component.id === excludeId) return false
    if (!component.gridPosition) return false
    
    const comp = component.gridPosition
    const compColumnEnd = comp.column + (comp.columnSpan || 1) - 1
    const compRowEnd = comp.row + (comp.rowSpan || 1) - 1
    const targetColumnEnd = column + columnSpan - 1
    const targetRowEnd = row + rowSpan - 1
    
    // 检查是否有重叠
    return !(
      targetColumnEnd < comp.column ||
      column > compColumnEnd ||
      targetRowEnd < comp.row ||
      row > compRowEnd
    )
  })
}

/**
 * 查找下一个可用的Grid位置
 * @param {Object} gridConfig - Grid配置
 * @param {Array} components - 组件列表
 * @param {number} columnSpan - 跨列数
 * @param {number} rowSpan - 跨行数
 * @returns {Object} 可用位置 {column, row}
 */
export function findNextAvailablePosition(gridConfig, components, columnSpan = 1, rowSpan = 1) {
  const maxColumns = gridConfig.columns
  
  // 从第一行第一列开始查找
  for (let row = 1; row <= 100; row++) { // 最多查找100行
    for (let column = 1; column <= maxColumns - columnSpan + 1; column++) {
      if (!isGridPositionOccupied(column, row, columnSpan, rowSpan, components)) {
        return { column, row }
      }
    }
  }
  
  // 如果找不到，返回第一个位置
  return { column: 1, row: 1 }
}

/**
 * 验证Grid位置是否有效
 * @param {number} column - 列坐标
 * @param {number} row - 行坐标
 * @param {number} columnSpan - 跨列数
 * @param {number} rowSpan - 跨行数
 * @param {Object} gridConfig - Grid配置
 * @returns {boolean} 是否有效
 */
export function isValidGridPosition(column, row, columnSpan = 1, rowSpan = 1, gridConfig) {
  return (
    column >= 1 &&
    row >= 1 &&
    columnSpan >= 1 &&
    rowSpan >= 1 &&
    column + columnSpan - 1 <= gridConfig.columns
  )
}

/**
 * 计算Grid容器的CSS样式
 * @param {Object} gridConfig - Grid配置
 * @returns {Object} CSS样式对象
 */
export function getGridContainerStyles(gridConfig) {
  const {
    columns = 3,
    columnGap = '20px',
    rowGap = '20px',
    minRowHeight = '60px'
  } = gridConfig

  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gridTemplateRows: gridConfig.rows === 'auto'
      ? `repeat(10, ${minRowHeight})` // 创建10行固定高度的网格
      : `repeat(${gridConfig.rows}, ${minRowHeight})`,
    gap: `${rowGap} ${columnGap}`,
    padding: `${rowGap} ${columnGap}`, // 添加padding，让最外面一圈也有gap
    width: '100%',
    minHeight: '400px',
    gridAutoRows: minRowHeight // 确保新行也使用固定高度
  }
}

/**
 * 计算组件在Grid中的CSS样式
 * @param {Object} gridPosition - Grid位置信息
 * @returns {Object} CSS样式对象
 */
export function getGridItemStyles(gridPosition) {
  if (!gridPosition) return {}
  
  const {
    column = 1,
    row = 1,
    columnSpan = 1,
    rowSpan = 1
  } = gridPosition
  
  return {
    gridColumnStart: column,
    gridColumnEnd: column + columnSpan,
    gridRowStart: row,
    gridRowEnd: row + rowSpan
  }
}

/**
 * 将旧的position坐标转换为Grid坐标
 * @param {Object} position - 旧的position坐标
 * @param {Object} gridConfig - Grid配置
 * @param {HTMLElement} gridContainer - Grid容器元素
 * @returns {Object} Grid坐标
 */
export function convertPositionToGrid(position, gridConfig, gridContainer) {
  if (!position || !gridContainer) {
    return { column: 1, row: 1, columnSpan: 1, rowSpan: 1 }
  }
  
  const gridPos = pixelToGridPosition(position.x, position.y, gridConfig, gridContainer)
  
  // 根据组件尺寸计算跨度
  const cellWidth = gridContainer.getBoundingClientRect().width / gridConfig.columns
  const cellHeight = getCellHeight(gridConfig, gridContainer)
  
  const columnSpan = Math.max(1, Math.round(position.width / cellWidth))
  const rowSpan = Math.max(1, Math.round(position.height / cellHeight))
  
  return {
    column: gridPos.column,
    row: gridPos.row,
    columnSpan: Math.min(columnSpan, gridConfig.columns - gridPos.column + 1),
    rowSpan
  }
}

/**
 * 获取Grid网格线的CSS样式
 * @param {Object} gridConfig - Grid配置
 * @returns {Object} CSS样式对象
 */
export function getGridLinesStyles(gridConfig) {
  if (!gridConfig.showGridLines) return { display: 'none' }

  const {
    columns = 3,
    columnGap = '20px',
    rowGap = '20px',
    minRowHeight = '60px'
  } = gridConfig

  // 使用与实际Grid完全相同的布局来绘制网格线
  return {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 5, // 降低z-index，确保不遮挡组件
    // 使用与实际Grid完全相同的CSS Grid布局
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gridTemplateRows: `repeat(10, ${minRowHeight})`,
    gap: `${rowGap} ${columnGap}`,
    padding: `${rowGap} ${columnGap}`, // 添加与容器相同的padding
    // 添加外边框
    border: '2px solid rgba(0, 123, 255, 0.6)',
    borderRadius: '4px'
  }
}

/**
 * 生成网格单元格指示器的样式（用于在模板中渲染）
 * @param {Object} gridConfig - Grid配置
 * @returns {Array} 网格单元格数组
 */
export function getGridCells(gridConfig) {
  const { columns = 3 } = gridConfig
  const cells = []

  // 生成前10行的网格单元格
  for (let row = 1; row <= 10; row++) {
    for (let col = 1; col <= columns; col++) {
      cells.push({
        column: col,
        row: row,
        style: {
          gridColumnStart: col,
          gridColumnEnd: col + 1,
          gridRowStart: row,
          gridRowEnd: row + 1,
          border: '1px solid rgba(0, 123, 255, 0.3)',
          backgroundColor: 'rgba(0, 123, 255, 0.05)'
        }
      })
    }
  }

  return cells
}

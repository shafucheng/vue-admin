import type { TableColumnsType, TableProps } from 'ant-design-vue'

export const getATableProps = (
  {
    columns = [],
    dataSource = [{}],
    loading = false,
    page = 1,
    pageSize = 10,
    total = 0,
  } = {} as {
    columns?: TableColumnsType
    dataSource?: any[]
    loading?: boolean
    page?: number
    pageSize?: number
    total?: number
  },
) => {
  return {
    columns,
    dataSource,
    loading,
    size: 'middle',
    scroll: {
      x: (() => {
        try {
          return columns
            .map(({ width }) => {
              switch (typeof width) {
                case 'string':
                  return parseFloat(width)
                case 'number':
                  return width
                default:
                  throw 'width is not defined'
              }
            })
            .reduce((p, c) => p + c, 0)
        } catch (err) {
          return true
        }
      })(),
    },
    pagination: {
      size: 'default',
      current: page,
      pageSize,
      total,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total: number) =>
        `第 ${pageSize * (page - 1) + 1}-${Math.min(
          pageSize * page,
          total,
        )} 条 / 总共 ${total} 条`,
    },
  } as TableProps
}

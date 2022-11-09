import { type TableProps, Table } from 'ant-design-vue'
import type { Key } from 'ant-design-vue/es/table/interface'
import _ from 'lodash-es'
import { type PropType, defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const defaultCurrent = 1
const defaultPageSize = 10

export default defineComponent({
  name: 'SearchTable',
  props: {
    currentKey: {
      type: String as PropType<string>,
      default: 'page',
    },
    pageSizeKey: {
      type: String as PropType<string>,
      default: 'pageSize',
    },
    sortersKey: {
      type: String as PropType<string>,
      default: 'sorters',
    },
    rowKey: {
      type: String as PropType<TableProps['rowKey']>,
      default: 'id',
    },
    columns: {
      type: Array as PropType<TableProps['columns']>,
      default: () => [],
    },
    dataSource: {
      type: Array as PropType<TableProps['dataSource']>,
      default: () => [],
    },
    pagination: {
      type: [Boolean, Object] as PropType<TableProps['pagination']>,
      default: () => ({}),
    },
    loading: {
      type: [Boolean, Object] as PropType<TableProps['loading']>,
      default: false,
    },
    selectedRowKeys: {
      type: Array as PropType<
        Required<TableProps>['rowSelection']['selectedRowKeys']
      >,
    },
  },
  emits: ['update:selectedRowKeys', 'change'],
  setup: (props, { slots, emit }) => {
    const route = useRoute()
    const router = useRouter()

    const queryCurrent = $computed(() => {
      const current = route.query[props.currentKey]
      try {
        if (!_.isString(current)) {
          throw ''
        }
        const ret = JSON.parse(current)
        if (!_.isNumber(ret)) {
          throw ''
        }
        return ret
      } catch (err) {
        return defaultCurrent
      }
    })
    const queryPageSize = $computed(() => {
      const pageSize = route.query[props.pageSizeKey]
      try {
        if (!_.isString(pageSize)) {
          throw ''
        }
        const ret = JSON.parse(pageSize)
        if (!_.isNumber(ret)) {
          throw ''
        }
        return ret
      } catch (err) {
        return defaultPageSize
      }
    })
    const querySorters = $computed(() => {
      const sorters = route.query[props.sortersKey]
      try {
        if (!_.isString(sorters)) {
          throw ''
        }
        const ret = JSON.parse(sorters)
        if (!_.isArray(ret)) {
          throw ''
        }
        return ret.filter((item) => {
          const { field, order } = item ?? {}
          return (
            _.isString(field) &&
            field !== '' &&
            (order === 'ascend' || order === 'descend')
          )
        })
      } catch (err) {
        return []
      }
    })

    const columns = $computed(() => {
      const sorters = _.fromPairs(
        querySorters.map(({ field, order }) => [field, order]),
      )

      return props.columns?.map((item: any) => {
        const field = item.dataIndex ?? item.key

        return {
          ...item,
          sortOrder: sorters[field] ?? item.sortOrder,
          filteredValue: (() => {
            const _queryValue = route.query[field]
            try {
              if (!_.isString(_queryValue)) {
                throw ''
              }
              return JSON.parse(_queryValue)
            } catch (err) {
              return []
            }
          })(),
        }
      })
    })

    return () => {
      return (
        <Table
          columns={columns}
          dataSource={props.dataSource}
          loading={props.loading}
          size={'middle'}
          scroll={{
            x: (() => {
              try {
                return columns
                  ?.map(({ width }) => {
                    switch (typeof width) {
                      case 'string':
                        return parseFloat(width)
                      case 'number':
                        return width
                      default:
                        throw ''
                    }
                  })
                  .reduce((p, c) => p + c, 0)
              } catch (err) {
                return true
              }
            })(),
          }}
          rowKey={'id'}
          rowSelection={{
            selectedRowKeys: props.selectedRowKeys,
            onChange: (selectedRowKeys) => {
              emit(
                'update:selectedRowKeys',
                _.concat(
                  _.without(
                    props.selectedRowKeys,
                    ...(props.dataSource ?? []).map(
                      (row: any, index: number) => {
                        const { rowKey } = props
                        if (_.isString(rowKey)) {
                          return row[rowKey] as Key
                        }
                        if (_.isFunction(rowKey)) {
                          return rowKey(row, index)
                        }
                        return index
                      },
                    ),
                  ),
                  selectedRowKeys,
                ),
              )
            },
          }}
          pagination={
            props.pagination && {
              size: 'default',
              current: queryCurrent,
              pageSize: queryPageSize,
              total: 100,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total: number) =>
                `第 ${queryPageSize * (queryCurrent - 1) + 1}-${Math.min(
                  queryPageSize * queryCurrent,
                  100,
                )} 条 / 总共 ${total} 条`,
              ...props.pagination,
            }
          }
          onChange={(pagination, filters, sorter) => {
            const _current = pagination.current!
            const _pageSize = pagination.pageSize!
            const _filters = _.fromPairs(
              _.toPairs(filters).map(([key, value]) => [
                key,
                _.isNil(value) ? undefined : value,
              ]),
            )
            const _sorter = (_.isArray(sorter) ? sorter : [sorter])
              .filter(
                ({ column, field, columnKey }) =>
                  column?.sorter && (field ?? columnKey),
              )
              .sort((a: any, b: any) => {
                return (
                  _.get(a, 'column.sorter.multiple', 0) -
                  _.get(b, 'column.sorter.multiple', 0)
                )
              })
              .map(({ order, field, columnKey }) => ({
                field: field ?? columnKey,
                order,
              }))
            router.replace({
              ...route,
              query: {
                ...route.query,
                ..._.fromPairs(
                  _.toPairs(_filters).map(([key, value]) => [
                    key,
                    JSON.stringify(value),
                  ]),
                ),
                [props.currentKey]:
                  _current === defaultCurrent
                    ? undefined
                    : JSON.stringify(_current),
                [props.pageSizeKey]:
                  _pageSize === defaultPageSize
                    ? undefined
                    : JSON.stringify(_pageSize),
                [props.sortersKey]:
                  _sorter.length === 0 ? undefined : JSON.stringify(_sorter),
              },
            })
            emit('change', {
              ..._filters,
              [props.currentKey]: _current,
              [props.pageSizeKey]: _pageSize,
              [props.sortersKey]: _sorter.length === 0 ? undefined : _sorter,
            })
          }}
        >
          {slots}
        </Table>
      )
    }
  },
})

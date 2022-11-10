import { type TableProps, Table } from 'ant-design-vue'
import type { Key } from 'ant-design-vue/es/table/interface'
import _ from 'lodash-es'
import { type PropType, defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'

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

    const withFiltersColumnKeys = $computed(() => {
      return (
        props.columns
          ?.filter(
            ({ dataIndex, key, filters }: any) => filters && (dataIndex ?? key),
          )
          .map(({ dataIndex, key }: any) => dataIndex ?? key) ?? []
      )
    })

    const defaultCurrent = $computed(
      () =>
        (props.pagination ? props.pagination.defaultCurrent : undefined) ?? 1,
    )
    const defaultPageSize = $computed(
      () =>
        (props.pagination ? props.pagination.defaultPageSize : undefined) ?? 10,
    )

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
    const queryFilters = $computed(() => {
      return _.fromPairs(
        withFiltersColumnKeys.map((key) => {
          const value = route.query[key]
          try {
            if (!_.isString(value)) {
              throw ''
            }
            return [key, JSON.parse(value)]
          } catch (err) {
            return [key, undefined]
          }
        }),
      )
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

    const emitChange = (
      filters: any,
      sorters: any,
      current: number,
      pageSize: number,
    ) => {
      emit('change', {
        ...filters,
        [props.sortersKey]: sorters,
        [props.currentKey]: current,
        [props.pageSizeKey]: pageSize,
      })
    }

    emitChange(queryFilters, querySorters, queryCurrent, queryPageSize)

    const columns = $computed(() => {
      const sorters = _.fromPairs(
        querySorters.map(({ field, order }) => [field, order]),
      )

      return props.columns?.map((item: any) => {
        const field = item.dataIndex ?? item.key

        return {
          ...item,
          sortOrder: sorters[field] ?? item.sortOrder,
          filteredValue: queryFilters[field] ?? null,
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
          rowKey={props.rowKey}
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
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `第 ${range[0]}-${range[1]} 条 / 总共 ${total} 条`,
              ...props.pagination,
            }
          }
          onChange={(pagination, filters, sorter) => {
            const _current = pagination.current!
            const _pageSize = pagination.pageSize!
            const _filters = _.fromPairs(
              withFiltersColumnKeys.map((key) => {
                const value = filters[key]
                try {
                  if (
                    _.isNil(value) ||
                    (_.isArray(value) && value.length === 0) ||
                    (_.isObject(value) && _.isEmpty(value))
                  ) {
                    throw ''
                  }
                  JSON.stringify(value)
                  return [key, value]
                } catch (err) {
                  return [key, undefined]
                }
              }),
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
            emitChange(_filters, _sorter, _current, _pageSize)
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
                [props.sortersKey]:
                  _sorter.length === 0 ? undefined : JSON.stringify(_sorter),
                [props.currentKey]:
                  _current === defaultCurrent
                    ? undefined
                    : JSON.stringify(_current),
                [props.pageSizeKey]:
                  _pageSize === defaultPageSize
                    ? undefined
                    : JSON.stringify(_pageSize),
              },
            })
          }}
        >
          {slots}
        </Table>
      )
    }
  },
})

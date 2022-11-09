import { LoadingOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { PageContainer } from '@ant-design-vue/pro-layout'
import { DatePicker, FormItem, Input, Select } from '@formily/antdv-x3'
import {
  type TableColumnsType,
  Button,
  Popconfirm,
  Space,
  Typography,
} from 'ant-design-vue'
import type { Key } from 'ant-design-vue/es/table/interface'
import { defineComponent, watchEffect } from 'vue'

import QueryForm from '@/components/formily/QueryForm'
import TableContainer from '@/components/MainContainer'
import SchemaField from '@/components/SchemaField'
import SearchContainer from '@/components/SearchContainer'
import SearchForm from '@/components/SearchForm'
import SearchTable from '@/components/SearchTable'
import TableActionSpace from '@/components/TableActionSpace'
import { getSchemaFields } from '@/utils/getSchemaFields'

const searchSchema = {
  type: 'object',
  properties: {
    search: {
      type: 'void',
      'x-component': 'QueryForm',
      'x-component-props': {
        onSubmit: '{{onSubmit}}',
      },
      properties: {
        name: {
          type: 'string',
          title: 'Name',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            placeholder: '请选择',
            mode: 'multiple',
          },
          enum: [
            {
              label: 'Male',
              value: 'male',
            },
            {
              label: 'Female',
              value: 'female',
            },
          ],
        },
        bbb: {
          type: 'string',
          title: 'BBB',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '请输入',
          },
        },
        ccc: {
          type: 'string',
          title: 'CCC',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '请输入',
          },
        },
        ddd: {
          type: 'array',
          title: 'DDD',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            placeholder: '请选择',
            mode: 'multiple',
          },
          enum: [
            {
              label: 'Option 1',
              value: 1,
            },
            {
              label: 'Option 2',
              value: 2,
            },
          ],
        },
        '[startDate, endDate]': {
          type: 'number',
          title: 'EEE',
          'x-decorator': 'FormItem',
          'x-component': 'DatePicker.RangePicker',
          'x-component-props': {
            showTime: true,
            valueFormat: 'x',
          },
        },
        fff: {
          type: 'string',
          title: 'FFF',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '请输入',
          },
        },
        ggg: {
          type: 'string',
          title: 'GGG',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '请输入',
          },
        },
      },
    },
  },
}

const tableColumns: TableColumnsType = [
  {
    width: 100,
    title: 'Name',
    dataIndex: 'name',
    fixed: 'left',
    filters: [
      { text: 'Male', value: 'male' },
      { text: 'Female', value: 'female' },
    ],
    sorter: {
      multiple: 1,
    },
    // sortOrder: 'ascend',
  },
  ...Array.from({ length: 10 }).map((_, index) => {
    const realIndex = index + 1
    return {
      width: 100,
      title: `Field ${realIndex}`,
      dataIndex: `field_${realIndex}`,
      sorter: {
        multiple: realIndex + 1,
      },
      // sortOrder: 'descend',
    }
  }),
  {
    width: 120,
    title: 'Action',
    key: 'action',
    fixed: 'right',
  },
]

const ItemActionDelete = defineComponent({
  name: 'ItemActionDelete',
  setup: () => {
    let loading = $ref(false)

    return () => {
      return (
        <Popconfirm
          title={'Are you sure delete this task?'}
          onConfirm={() => {
            loading = true
            setTimeout(() => {
              loading = false
            }, 2000)
          }}
        >
          <Typography.Link disabled={loading}>
            {loading && <LoadingOutlined />} Delete
          </Typography.Link>
        </Popconfirm>
      )
    }
  },
})

export default defineComponent({
  name: 'SearchTableView',
  setup: () => {
    let queryValues = $ref({})
    let tableValues = $ref({})

    const request = async (params: any, page: number, pageSize: number) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return {
        page,
        pageSize,
        total: 329,
        list: Array.from({ length: pageSize }).map((_, index) => {
          const id = pageSize * (page - 1) + index + 1
          return {
            id,
            name: `Item ${id}`,
          }
        }),
      }
    }

    let loading = $ref(false)
    let data = $ref<any>({
      page: 0,
      pageSize: 0,
      total: 0,
      list: [],
    })

    const run = async (
      { page = 1, pageSize = 10, ...params } = {
        ...queryValues,
        ...tableValues,
      },
    ) => {
      loading = true
      data = await request(params, page, pageSize)
      loading = false
    }
    const tableSelectedRowKeys = $ref<Key[]>([])
    watchEffect(() => {
      console.log($$(tableSelectedRowKeys))
    })

    return () => {
      return (
        <PageContainer fixedHeader={true}>
          <SearchContainer>
            <SearchForm
              querySyncFields={getSchemaFields(searchSchema)}
              onSubmit={(values) => {
                queryValues = values
                run()
              }}
            >
              {{
                default: ({ onSubmit }: any) => (
                  <SchemaField
                    components={{
                      QueryForm,
                      DatePicker,
                      FormItem,
                      Input,
                      Select,
                    }}
                    schema={searchSchema}
                    scope={{ onSubmit }}
                  />
                ),
              }}
            </SearchForm>
          </SearchContainer>
          <TableContainer
            title={'表格'}
            showPaddingBottom={!(data.list?.length > 0)}
          >
            {{
              action: () => (
                <Space>
                  <Button type={'primary'}>
                    <PlusOutlined />
                    新增
                  </Button>
                </Space>
              ),
              default: () => (
                <SearchTable
                  columns={tableColumns}
                  dataSource={data.list}
                  loading={loading}
                  pagination={{
                    current: data.page,
                    pageSize: data.pageSize,
                    total: data.total,
                  }}
                  v-model={[tableSelectedRowKeys, 'selectedRowKeys']}
                  onChange={(params) => {
                    tableValues = params
                    run()
                  }}
                >
                  {{
                    bodyCell: ({ column, text }: any) => {
                      switch (column.key) {
                        case 'action':
                          return (
                            <TableActionSpace>
                              <Typography.Link>Edit</Typography.Link>
                              <ItemActionDelete />
                            </TableActionSpace>
                          )
                        default:
                          return text
                      }
                    },
                  }}
                </SearchTable>
              ),
            }}
          </TableContainer>
        </PageContainer>
      )
    }
  },
})

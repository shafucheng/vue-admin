import { LoadingOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { PageContainer } from '@ant-design-vue/pro-layout'
import { DatePicker, FormItem, Input, Select } from '@formily/antdv-x3'
import { useAxios } from '@vueuse/integrations/useAxios'
import {
  type TableColumnsType,
  Button,
  Popconfirm,
  Space,
  Typography,
} from 'ant-design-vue'
import type { Key } from 'ant-design-vue/es/table/interface'
import { defineComponent, onMounted, reactive, toRaw, watch } from 'vue'

import QueryForm from '@/components/formily/QueryForm'
import TableContainer from '@/components/MainContainer'
import SchemaField from '@/components/SchemaField'
import SearchContainer from '@/components/SearchContainer'
import SearchForm from '@/components/SearchForm'
import SearchTable from '@/components/SearchTable'
import TableActionSpace from '@/components/TableActionSpace'
import { getSchemaFields } from '@/utils/getSchemaFields'
import request from '@/utils/request'

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
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '请输入',
          },
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
          type: 'string',
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
          type: 'string',
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
    title: 'Index',
    key: 'index',
    fixed: 'left',
  },
  {
    width: 100,
    title: 'Name',
    dataIndex: 'name',
    fixed: 'left',
  },
  ...Array.from({ length: 10 }).map((_, index) => {
    const realIndex = index + 1
    return {
      width: 100,
      title: `Field ${realIndex}`,
      dataIndex: `field_${realIndex}`,
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

    const tableAxios = reactive(
      useAxios<{
        list: {
          id: number
          name: string
        }[]
        total: number
        page: number
        pageSize: number
      }>(
        '/tableData.json',
        {
          method: 'GET',
        },
        request,
        { immediate: false },
      ),
    )

    const tableAxiosExecute = () => {
      tableAxios.execute({
        params: {
          ...toRaw(queryValues),
          ...toRaw(tableValues),
        },
      })
    }

    onMounted(() => {
      watch(() => [queryValues, tableValues], tableAxiosExecute)
      tableAxiosExecute()
    })

    const tableSelectedRowKeys = $ref<Key[]>([])

    return () => {
      return (
        <PageContainer>
          <SearchContainer>
            <SearchForm
              querySyncFields={getSchemaFields(searchSchema)}
              onSubmit={(values) => {
                queryValues = values
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
            showPaddingBottom={!tableAxios.data?.list.length}
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
                  dataSource={tableAxios.data?.list}
                  loading={tableAxios.isLoading}
                  pagination={{
                    current: tableAxios.data?.page,
                    pageSize: tableAxios.data?.pageSize,
                    total: tableAxios.data?.total,
                  }}
                  v-model={[tableSelectedRowKeys, 'selectedRowKeys']}
                  onChange={(params) => {
                    tableValues = params
                  }}
                >
                  {{
                    bodyCell: ({ column, text, index }: any) => {
                      switch (column.key) {
                        case 'index':
                          return `${
                            tableAxios.data?.pageSize! *
                              (tableAxios.data?.page! - 1) +
                            index +
                            1
                          }`
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

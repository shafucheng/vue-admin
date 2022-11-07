import { Form } from '@formily/antdv-x3'
import { createForm } from '@formily/core'
import _ from 'lodash-es'
import {
  type PropType,
  defineComponent,
  nextTick,
  onMounted,
  watchEffect,
} from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'SearchForm',
  props: {
    querySyncFields: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },
  emits: ['submit'],
  setup: (props, { slots, emit }) => {
    const route = useRoute()
    const router = useRouter()

    const form = createForm()

    const syncToQuery = (values: any) => {
      const queryValues = _.mapValues(
        _.pick(values, props.querySyncFields),
        (value) => {
          try {
            if (_.isArray(value) && value.length === 0) {
              return undefined
            }
            if (value === '') {
              return undefined
            }
            return JSON.stringify(value)
          } catch (err) {
            return undefined
          }
        },
      )
      nextTick(() => {
        router.replace({
          ...route,
          query: {
            ...route.query,
            ...queryValues,
          },
        })
      })
    }

    const syncToForm = (query: any) => {
      const values = _.mapValues(
        _.pick(query, props.querySyncFields),
        (value: any) => {
          try {
            if (_.isArray(value) && value.length === 0) {
              return undefined
            }
            return JSON.parse(value)
          } catch (err) {
            return undefined
          }
        },
      )
      form.setValues(values)
    }

    watchEffect(() => {
      syncToForm(_.cloneDeep(route.query))
    })

    const onSubmit = () => {
      const values = _.cloneDeep(form.values)
      syncToQuery(values)
      emit('submit', values)
    }

    onMounted(() => {
      onSubmit()
    })

    return () => {
      return <Form form={form}>{slots.default?.({ onSubmit })}</Form>
    }
  },
})

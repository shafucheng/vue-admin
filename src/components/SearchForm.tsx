import { Form } from '@formily/antdv-x3'
import { createForm } from '@formily/core'
import _ from 'lodash-es'
import { defineComponent, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const decode = (value: any) => JSON.parse(value)
const encode = (value: any) => JSON.stringify(value)

const isJson = (obj: any) => {
  try {
    if (typeof obj !== 'string') {
      return false
    }
    JSON.parse(obj)
  } catch (err) {
    return false
  }
  return true
}

export default defineComponent({
  name: 'SearchForm',
  emits: ['submit'],
  setup: (props, { slots, emit }) => {
    const route = useRoute()
    const router = useRouter()
    const form = createForm()

    const onSubmit = (querySync = true) => {
      const values = _.cloneDeep(form.values)
      if (querySync) {
        const encodeValues: any = {}
        Object.keys(values).forEach((key) => {
          try {
            if (Array.isArray(values[key])) {
              encodeValues[key] = values[key].map((item: any) => encode(item))
            } else {
              encodeValues[key] = encode(values[key])
            }
          } catch (err) {
            // pass
          }
        })
        router.replace({
          query: _.assign({}, _.cloneDeep(route.query), encodeValues),
        })
      }
      emit('submit', values)
    }

    onMounted(() => {
      const query = _.cloneDeep(route.query)
      const decodeQuery: any = {}
      Object.keys(query).forEach((key) => {
        try {
          if (Array.isArray(query[key])) {
            decodeQuery[key] = (query[key] as Array<any>)
              .filter((item) => isJson(item))
              .map((item) => decode(item))
          } else if (isJson(query[key])) {
            decodeQuery[key] = decode(query[key] as string)
          }
        } catch (err) {
          // pass
        }
      })
      form.setValues(decodeQuery)
      onSubmit(false)
    })

    return () => {
      return <Form form={form}>{slots.default?.({ onSubmit })}</Form>
    }
  },
})

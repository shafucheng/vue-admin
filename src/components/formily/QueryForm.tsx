import { DownOutlined, UpOutlined } from '@ant-design/icons-vue'
import { FormItem, FormLayout, Submit } from '@formily/antdv-x3'
import { useForm } from '@formily/vue'
import { useElementSize } from '@vueuse/core'
import { Button, Space, TypographyLink } from 'ant-design-vue'
import { defineComponent, ref, withModifiers } from 'vue'

export default defineComponent({
  name: 'QueryForm',
  props: {
    minWidth: {
      type: Number,
      default: 240,
    },
    columnGap: {
      type: Number,
      default: 24,
    },
  },
  emits: ['submit'],
  setup: (props, { slots, emit }) => {
    const container = ref<HTMLDivElement>()

    const { width: containerWidth } = $(useElementSize(container))

    const columns = $computed(() =>
      Math.floor(
        (containerWidth + props.columnGap) / (props.minWidth + props.columnGap),
      ),
    )

    const rows = $computed(() =>
      Math.ceil(
        (container.value?.childElementCount ?? 1) / Math.max(1, columns),
      ),
    )

    const layout = $computed(() => (columns <= 2 ? 'vertical' : 'inline'))

    let collapsed = $ref(true)

    const toggle = () => {
      collapsed = !collapsed
    }

    return () => {
      const form = $(useForm())

      return (
        <FormLayout layout={layout}>
          <div
            ref={container}
            class={'w-full grid gap-x-6'}
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(${props.minWidth}px, 1fr))`,
            }}
          >
            {slots.default?.().map((item, index) => (
              <div
                class={{
                  hidden: collapsed && index > 0 && index > columns - 2,
                }}
              >
                {item}
              </div>
            ))}
            <FormItem style={{ gridColumnStart: columns }}>
              <Space
                class={`w-full justify-end ${
                  layout === 'vertical' && columns > 1 ? 'mt-22px' : ''
                }`}
                align={'center'}
                size={'middle'}
              >
                <Space>
                  <Button
                    onClick={() => {
                      form.reset()
                      emit('submit')
                    }}
                  >
                    重置
                  </Button>
                  <Submit
                    onSubmit={() => {
                      emit('submit')
                    }}
                  >
                    查询
                  </Submit>
                </Space>
                {rows > 1 && (
                  <TypographyLink onClick={withModifiers(toggle, ['prevent'])}>
                    {collapsed ? (
                      <>
                        展开
                        <DownOutlined class={'ml-7px'} />
                      </>
                    ) : (
                      <>
                        收起
                        <UpOutlined class={'ml-7px'} />
                      </>
                    )}
                  </TypographyLink>
                )}
              </Space>
            </FormItem>
          </div>
        </FormLayout>
      )
    }
  },
})

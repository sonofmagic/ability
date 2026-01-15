import type { AbilityLike } from '../types'
import { defineComponent } from 'vue'
import { useAbility } from '../useAbility'

export interface CanProps {
  I?: string
  do?: string
  a?: unknown
  an?: unknown
  this?: unknown
  on?: unknown
  not?: boolean
  passThrough?: boolean
  field?: string
}

function detectSubjectProp(props: Record<string, unknown>) {
  if (props.a !== undefined) {
    return 'a'
  }

  if (props.this !== undefined) {
    return 'this'
  }

  if (props.an !== undefined) {
    return 'an'
  }

  return ''
}

export const Can = defineComponent<CanProps>({
  name: 'Can',
  props: {
    I: String,
    do: String,
    a: [String, Object, Function],
    an: [String, Object, Function],
    this: [String, Object, Function],
    on: [String, Object, Function],
    not: Boolean,
    passThrough: Boolean,
    field: String,
  },
  setup(props, { slots }) {
    const $props = props as Record<string, any>
    let actionProp = 'do'
    let subjectProp = 'on'

    if ($props[actionProp] === undefined) {
      actionProp = 'I'
      subjectProp = detectSubjectProp($props)
    }

    if (!$props[actionProp]) {
      throw new Error('Neither `I` nor `do` prop was passed in <Can>')
    }

    if (!slots.default) {
      throw new Error('Expects to receive default slot')
    }

    const ability = useAbility<AbilityLike>()

    return () => {
      const subject = subjectProp ? $props[subjectProp] : undefined
      const isAllowed = ability.can($props[actionProp], subject, $props.field)
      const canRender = props.not ? !isAllowed : isAllowed

      if (!props.passThrough) {
        return canRender ? slots.default!() : null
      }

      return slots.default!({
        allowed: canRender,
        ability,
      })
    }
  },
})

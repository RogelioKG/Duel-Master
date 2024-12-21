import type { MaybeElementRef } from '@vueuse/core'
import VanillaTilt from 'vanilla-tilt'
import { onMounted, onUnmounted, unref } from 'vue'

export interface TiltEffectElement extends HTMLElement {
  vanillaTilt: {
    destroy: () => void
  }
}

/**
 * ### Brief
 * provides tilt effect for a specified element
 *
 * ### Params
 * @param element
 * @param options
 *    + enable: determines whether the tilt effect is enabled
 *
 * ### Example
 * 不需要在 life cycle 額外做初始化，
 * 因為 composables 都幫你處理好了，
 * 這 export 出去的函式是允許你手動管理效果。
 * ```ts
 * const { reinitTiltEffect, destroyTiltEffect } = useTiltEffect(element, { enable: true })
 * ```
 */
export const useTiltEffect = (
  element: MaybeElementRef<HTMLElement | null>,
  { enable }: { enable: boolean },
) => {
  let destroyed = true

  const initTiltEffect = () => {
    if (!enable || !destroyed) return
    const rawElement = unref(element)
    if (!rawElement) return
    VanillaTilt.init(rawElement, {
      max: 10,
      speed: 2000,
      perspective: 500,
      glare: true,
      'max-glare': 0.2,
    })
    destroyed = false
  }

  const destroyTiltEffect = () => {
    if (!enable || destroyed) return // defense
    const rawElement = unref(element) as TiltEffectElement
    if (!rawElement) return
    rawElement.vanillaTilt.destroy()
    rawElement.querySelector('.js-tilt-glare')?.remove()
    destroyed = true
  }

  onMounted(() => {
    initTiltEffect()
  })
  onUnmounted(() => {
    destroyTiltEffect()
  })

  return {
    reinitTiltEffect: initTiltEffect,
    destroyTiltEffect: destroyTiltEffect,
  }
}

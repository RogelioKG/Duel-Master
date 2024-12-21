import { useMediaQuery, type MaybeElementRef } from '@vueuse/core'
import { unref, watch } from 'vue'
import type { CanvasCardType, Dimension } from '../../types'

/**
 * ## Brief
 * Dynamically adjusts the width or height of `CanvasCard` based on the screen size.
 *
 * ## Side effects
 * Sets the width or height of `CanvasCard` when the component is mounted.
 *
 * ## Example
 * ```typescript
 * const card1 = useTemplateRef<CanvasCardType>('card1')
 *
 * useResponsiveCard(card1,
 *   {
 *     500: 100, // For window width below 500px, apply 100px width
 *     600: 200, // For window width below 600px, apply 200px width
 *     700: 250, // For window width below 700px, apply 250px width
 *     800: 300, // For window width below 800px, apply 300px width
 *   },
 *   { width: 400 },  // For window width above 800px, apply 400px width
 * )
 *
 * onMounted(() => {
 *   initResponsive() // When being used in component, call this function to initialize
 * })
 * ```
 */
export const useResponsiveCard = (
  cardElement: MaybeElementRef<CanvasCardType | null>,
  breakpointMap: Record<number, number>,
  maxSize: Dimension,
) => {
  if (!(maxSize.width || maxSize.height)) {
    throw new Error('Either width or height must be provided in maxSize.')
  }

  const dim = maxSize.width !== undefined ? 'width' : 'height'

  // 由小到大排序斷點
  const breakpoints = Object.keys(breakpointMap)
    .map(Number)
    .sort((a, b) => a - b)

  const queries = breakpoints.map((bp) => useMediaQuery(`(max-${dim}: ${bp}px)`))

  const initResponsive = () => {
    const rawCardElement = unref(cardElement)
    if (!rawCardElement) return

    const i = queries.findIndex((query) => query.value)
    if (i !== -1) {
      const newSize: Dimension =
        dim === 'width'
          ? { width: breakpointMap[breakpoints[i]] }
          : { height: breakpointMap[breakpoints[i]] }
      rawCardElement.setSize(newSize)
    }

    // 其實可以寫成動態 key 較簡潔，但 TypeScript 對型別檢查超嚴格，所以只好改寫成這樣
    queries.forEach((query, i) => {
      watch(query, (matches) => {
        if (matches) {
          const newSize: Dimension =
            dim === 'width'
              ? { width: breakpointMap[breakpoints[i]] }
              : { height: breakpointMap[breakpoints[i]] }
          rawCardElement.setSize(newSize)
        } else if (i === queries.length - 1) {
          rawCardElement.setSize(maxSize)
        } else {
          const nextSize: Dimension =
            dim === 'width'
              ? { width: breakpointMap[breakpoints[i + 1]] }
              : { height: breakpointMap[breakpoints[i + 1]] }
          rawCardElement.setSize(nextSize)
        }
      })
    })
  }

  return {
    initResponsive,
  }
}

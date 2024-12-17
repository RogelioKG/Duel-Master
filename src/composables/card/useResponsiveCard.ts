import { onMounted, unref, watch } from 'vue'
import { useMediaQuery, type MaybeElementRef } from '@vueuse/core'
import type { CanvasCardType } from '@/types/all'

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
 * ```
 */
export const useResponsiveCard = (
  cardElement: MaybeElementRef<CanvasCardType | null>,
  breakpointMap: Record<number, number>,
  maxSize: { width?: number; height?: number },
) => {
  const dim = (() => {
    if (maxSize.width !== undefined) return 'width'
    if (maxSize.height !== undefined) return 'height'
    throw new Error('Either width or height must be provided.')
  })()

  // 由小到大排序斷點
  const breakpoints = Object.keys(breakpointMap)
    .map(Number)
    .sort((a, b) => a - b)

  const queries = breakpoints.map((bp) => useMediaQuery(`(max-${dim}: ${bp}px)`))

  const responsive = () => {
    const rawCardElement = unref(cardElement)
    if (!rawCardElement) return

    // 先初始化 responsive 應有的寬度 (由小到大找到第一個 true)
    const i = queries.findIndex((query) => query.value)
    // 如果沒有 true，表示在最寬的情況
    if (i !== -1) {
      rawCardElement.setSize({ [dim]: breakpointMap[breakpoints[i]] })
    }
    // 監聽變化
    queries.forEach((query, i) => {
      watch(query, (matches) => {
        if (matches) {
          // query 變化成 true，設定寬度
          rawCardElement.setSize({ [dim]: breakpointMap[breakpoints[i]] })
        } else if (i === queries.length - 1) {
          // query 變化成 false、而且是最後一個時，設定為最大寬度
          rawCardElement.setSize(maxSize)
        } else {
          // query 變化成 false 時，設定為下個寬度
          rawCardElement.setSize({ [dim]: breakpointMap[breakpoints[i + 1]] })
        }
      })
    })
  }

  onMounted(() => {
    responsive()
  })
}

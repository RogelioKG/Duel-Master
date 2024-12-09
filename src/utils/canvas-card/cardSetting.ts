import { onMounted, watch, type ShallowRef } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import type { BackCardData, CardData, FrontCardData } from 'yugioh-card'
import { API } from '@/config'
import type { CanvasCardType } from '@/types/all'

// export constants //
export const CANVAS_WIDTH = 1394
export const CANVAS_HEIGHT = 2031

// export function //
export const widthToScale = (width: number) => width / CANVAS_WIDTH

export const heightToScale = (height: number) => height / CANVAS_HEIGHT

export const setCardImg = (partialFrontCard: Partial<FrontCardData>) => {
  // 幫你設定好 image (URL)
  if (partialFrontCard.password) {
    partialFrontCard.image = `${API.YUGIOH_IMAGE}/${partialFrontCard.password}.jpg`
  }
}

export const setCardScale = (
  partialCard: Partial<CardData>,
  options: { width?: number; height?: number },
) => {
  // 幫你設定好 scale
  if (options.width === undefined && options.height === undefined) {
    return
  } else if (options.width !== undefined) {
    partialCard.scale = widthToScale(options.width)
  } else if (options.height !== undefined) {
    partialCard.scale = heightToScale(options.height)
  } else {
    throw new Error('Either width or height must be provided.')
  }
}

export const createFrontCard = (
  partialFrontCard: Partial<FrontCardData>,
  options: { width?: number; height?: number },
) => {
  setCardImg(partialFrontCard)
  setCardScale(partialFrontCard, options)
  return partialFrontCard
}

export const createBackCard = (
  partialBackCard: Partial<BackCardData>,
  options: { width?: number; height?: number },
) => {
  setCardScale(partialBackCard, options)
  return partialBackCard
}

/**
 * ### Brief:
 * responsive width of `CanvasCard`
 *
 * ### Side effects:
 * sets the width once initially when the component is mounted
 *
 * ### Params:
 * @param card - the reference of `CanvasCard` component
 * @param breakpointMap - ...
 *    - key: The breakpoint (maximum width in pixels).
 *    - value: The scale value to apply at that breakpoint.
 * @param options - ...
 *    - maxWidth: The maximum width to consider for scaling when no media queries match.
 *
 * ### Example:
 * ```typescript
 * const card1 = useTemplateRef<CanvasCardType>('card1')
 *
 * responsiveCard(card1,
 *   {
 *     500: 100, // For window width below 500px, apply 100px width
 *     600: 200, // For window width below 600px, apply 200px width
 *     700: 250, // For window width below 700px, apply 250px width
 *     800: 300, // For window width below 800px, apply 300px width
 *   },
 *   { maxWidth: 400 },  // For window width above 800px, apply 400px width
 * )
 * ```
 */
export const responsiveCard = (
  card: Readonly<ShallowRef<CanvasCardType | null>>,
  breakpointMap: Record<number, number>,
  { maxWidth }: { maxWidth: number },
) => {
  // 由小到大排序斷點
  const breakpoints = Object.keys(breakpointMap)
    .map((key) => Number(key))
    .sort((a, b) => a - b)

  const queries = breakpoints.map((bp) => useMediaQuery(`(max-width: ${bp}px)`)) // <= ? px

  onMounted(() => {
    // 在 mount 時，先初始化 responsive 應有的寬度
    // (由小到大找到第一個 true)
    const i = queries.findIndex((query) => query.value)
    // 如果沒有 true，表示在最寬的情況
    if (i !== -1) {
      card.value?.setScale(widthToScale(breakpointMap[breakpoints[i]]))
    }
  })

  // 之後再來監聽變化
  queries.forEach((query, i) => {
    watch(query, (matches) => {
      if (matches) {
        // query 變化成 true，設定寬度
        card.value?.setScale(widthToScale(breakpointMap[breakpoints[i]]))
      } else if (i === queries.length - 1) {
        // query 變化成 false、而且是最後一個時，設定為最大寬度
        card.value?.setScale(widthToScale(maxWidth))
      } else {
        // query 變化成 false 時，設定為下個寬度
        card.value?.setScale(widthToScale(breakpointMap[breakpoints[i + 1]]))
      }
    })
  })
}

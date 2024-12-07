import type { BackCardData, CardData, FrontCardData } from 'yugioh-card'
import { API } from '@/config'

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

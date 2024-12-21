import type { CardData, FrontCardData } from 'yugioh-card'
import { API } from '../../config'
import type { Dimension } from '../../types'

// export constants //
export const CANVAS_WIDTH = 1394
export const CANVAS_HEIGHT = 2031

// export function //
export const sizeToScale = (size: Dimension) => {
  if (size.width !== undefined) return size.width / CANVAS_WIDTH
  if (size.height !== undefined) return size.height / CANVAS_HEIGHT
  throw new Error('Either width or height must be provided.')
}

export const setCardImg = (partialFrontCard: Partial<FrontCardData>) => {
  // 幫你設定好 image (URL)
  if (partialFrontCard.password) {
    partialFrontCard.image = `${API.YUGIOH_IMAGE}/${partialFrontCard.password}.jpg`
  }
}

export const setCardScale = (partialCard: Partial<CardData>, size: Dimension) => {
  // 幫你設定好 scale
  partialCard.scale = sizeToScale(size)
}

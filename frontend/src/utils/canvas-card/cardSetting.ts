import type { CardData, FrontCardData } from 'yugioh-card'
import type { Dimension } from '../../types'
import { API } from '../../config'

// export constants //
export const CANVAS_WIDTH = 1394
export const CANVAS_HEIGHT = 2031

// export function //
export function sizeToScale(size: Dimension) {
  if (size.width !== undefined)
    return size.width / CANVAS_WIDTH
  if (size.height !== undefined)
    return size.height / CANVAS_HEIGHT
  throw new Error('Either width or height must be provided.')
}

export function setCardImg(partialFrontCard: Partial<FrontCardData>) {
  // 幫你設定好 image (URL)
  if (partialFrontCard.password) {
    partialFrontCard.image = `${API.YUGIOH_IMAGE}/${partialFrontCard.password}`
  }
}

export function setCardScale(partialCard: Partial<CardData>, size: Dimension) {
  // 幫你設定好 scale
  partialCard.scale = sizeToScale(size)
}

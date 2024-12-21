import type { BackCardData, FrontCardData } from 'yugioh-card'
import type { Dimension } from '../../types'
import { setCardImg, setCardScale } from './cardSetting'

export const initFrontCardData = (partialFrontCard: Partial<FrontCardData>, size: Dimension) => {
  setCardImg(partialFrontCard)
  setCardScale(partialFrontCard, size)
}

export const initBackCardData = (partialBackCard: Partial<BackCardData>, size: Dimension) => {
  setCardScale(partialBackCard, size)
}

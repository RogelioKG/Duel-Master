import type { BackCardData, FrontCardData } from 'yugioh-card'
import { setCardImg, setCardScale } from './_cardSetting'

export const createFrontCardData = (
  partialFrontCard: Partial<FrontCardData>,
  size: { width?: number; height?: number },
) => {
  setCardImg(partialFrontCard)
  setCardScale(partialFrontCard, size)
  return partialFrontCard
}

export const createBackCardData = (
  partialBackCard: Partial<BackCardData>,
  size: { width?: number; height?: number },
) => {
  setCardScale(partialBackCard, size)
  return partialBackCard
}

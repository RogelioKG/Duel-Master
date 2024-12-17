type ApiKey = 'YUGIOH_DATA' | 'YUGIOH_IMAGE' | 'YUGIOH_AI_MODEL'
type PathKey = 'YUGIOH_ASSETS' | 'YUGIOH_RESOURCES'

export const API: Record<ApiKey, string> = {
  YUGIOH_DATA: import.meta.env.VITE_YUGIOH_DATA_API,
  YUGIOH_IMAGE: import.meta.env.VITE_YUGIOH_IMAGE_API,
  YUGIOH_AI_MODEL: import.meta.env.VITE_YUGIOH_AI_MODEL_API,
} as const
export const PATH: Record<PathKey, string> = {
  YUGIOH_ASSETS: import.meta.env.VITE_YUGIOH_ASSETS,
  YUGIOH_RESOURCES: import.meta.env.VITE_YUGIOH_RESOURCES,
} as const
export const CARD_LEAVING_MS = 3000
export const FLIP_DURATION_MS = 1500

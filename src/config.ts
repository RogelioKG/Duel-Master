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

export const AVATAR_URLS = {
  System: 'https://api.dicebear.com/7.x/bottts/svg?seed=system',
  You: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chickenattack',
} as const

export const CARD_LEAVING_MS = 2500
export const FLIP_DURATION_MS = 1000
export const LARGE_CARD_BP = {
  breakpointMap: {
    320: 260,
    375: 300,
    425: 330,
    768: 350,
    850: 370,
    1024: 400,
  },
  maxSize: { width: 400 },
}
export const SMALL_CARD_BP = {
  breakpointMap: {
    320: 140,
    375: 150,
    425: 165,
    850: 200,
  },
  maxSize: { width: 250 },
}

export const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

export const isImage = (types: readonly string[]) => {
  return types.every(type => type.startsWith('image'))
}

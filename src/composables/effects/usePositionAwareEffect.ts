import { useEventListener, type MaybeElementRef } from '@vueuse/core'
import { onMounted } from 'vue'

export const usePositionAwareEffect = (button: MaybeElementRef<HTMLElement | null>) => {
  onMounted(() => {
    function updatePosition(this: HTMLElement, e: MouseEvent) {
      const parentOffset = this.getBoundingClientRect()
      const relX = e.pageX - parentOffset.left
      const relY = e.pageY - parentOffset.top
      const span = this.getElementsByTagName('span')
      if (span[0]) {
        span[0].style.top = `${relY}px`
        span[0].style.left = `${relX}px`
      }
    }
    useEventListener(button, 'mouseenter', updatePosition)
    useEventListener(button, 'mouseout', updatePosition)
  })
}

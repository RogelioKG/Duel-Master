import { useEventListener } from '@vueuse/core'
import { onMounted } from 'vue'
import { isTouchDevice } from '../../utils/misc/methods'

export const useParallaxEffect = (selector: string, speed: number = 1 / 100) => {
  if (isTouchDevice) return

  onMounted(() => {
    const elements = document.querySelectorAll<HTMLElement>(selector)

    function parallax(this: HTMLElement, e: MouseEvent) {
      const x = (window.innerWidth - e.pageX) * speed
      const y = (window.innerHeight - e.pageY) * speed
      this.style.transform = `translateX(${x}px) translateY(${y}px)`
    }

    elements.forEach((element) => {
      // 注意：是註冊在 window 上
      useEventListener(window, 'mousemove', parallax.bind(element))
    })
  })
}

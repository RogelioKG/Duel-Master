import { useEventListener } from '@vueuse/core'
import { isTouchDevice } from './device'

export const positionAwareEffect = (selector: string) => {
  const buttons = document.querySelectorAll<HTMLElement>(selector)

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

  buttons.forEach((button) => {
    useEventListener(button, 'mouseenter', updatePosition)
    useEventListener(button, 'mouseout', updatePosition)
  })
}

export const parallaxEffect = (selector: string, speed: number = 1 / 100) => {
  if (isTouchDevice) return

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
}

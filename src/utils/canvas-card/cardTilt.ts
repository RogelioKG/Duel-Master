import VanillaTilt from 'vanilla-tilt'

export interface tiltEffectElement extends HTMLElement {
  vanillaTilt: {
    destroy: () => void
  }
}

export const initTiltEffect = (cardElement: HTMLElement | null) => {
  if (cardElement) {
    const setting = { max: 10, speed: 2000, perspective: 500, glare: true, 'max-glare': 0.2 }
    VanillaTilt.init(cardElement, setting)
  }
}

export const destroyTiltEffect = (cardElement: tiltEffectElement | null) => {
  if (cardElement) {
    cardElement.vanillaTilt.destroy()
    const tiltEffectElement = cardElement.querySelector('.js-tilt-glare')
    tiltEffectElement?.remove()
  }
}

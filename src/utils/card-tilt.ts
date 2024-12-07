import VanillaTilt from 'vanilla-tilt'

export interface tiltEffectElement extends HTMLElement {
  vanillaTilt: {
    destroy: () => void
  }
}

export const initTiltEffect = (cardElement: HTMLElement | null) => {
  if (cardElement) {
    VanillaTilt.init(cardElement, {
      max: 10,
      speed: 2000,
      perspective: 500,
      glare: true,
      'max-glare': 0.2,
    })
  }
}

export const destroyTiltEffect = (cardElement: tiltEffectElement | null) => {
  if (cardElement) {
    cardElement.vanillaTilt.destroy()
    const tiltEffectElement = cardElement.querySelector('.js-tilt-glare')
    tiltEffectElement?.remove()
  }
}

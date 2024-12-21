// THE UNIVERSE. Code adapted from https://codepen.io/Acuetouag/pen/vOgmza

const starDensity: number = 0.314
const speedCoeff: number = 0.07
let width: number
let height: number
let starCount: number
const first: boolean = false
const giantColor: string = '180,184,240'
const starColor: string = '226,225,142'
const cometColor: string = '226,225,224'
const stars: Star[] = []
let isEnding: boolean = false

class Star {
  private x!: number
  private y!: number
  private r!: number
  private dx!: number
  private dy!: number
  private fadingOut!: boolean | null
  private fadingIn!: boolean
  private opacity!: number
  private opacityTresh!: number
  private do!: number
  private giant!: boolean
  private comet!: boolean
  private universe: CanvasRenderingContext2D

  constructor(universe: CanvasRenderingContext2D) {
    this.universe = universe
    this.reset()
  }

  reset(): void {
    this.giant = getProbability(3)
    this.comet = this.giant || first ? false : getProbability(5)
    this.x = getRandInterval(0, width - 10)
    this.y = getRandInterval(0, height)
    this.r = getRandInterval(1.1, 2.6)
    this.dx = 10 * speedCoeff + (this.comet ? speedCoeff * getRandInterval(50, 120) : 0)
    this.dy = -10 * speedCoeff - (this.comet ? speedCoeff * getRandInterval(50, 120) : 0)
    this.fadingOut = null
    this.fadingIn = true
    this.opacity = 0
    this.opacityTresh = getRandInterval(0.2, 1 - (this.comet ? 0.4 : 0))
    this.do = getRandInterval(0.005, 0.02) + (this.comet ? 0.001 : 0) // original: (0.0005, 0.002)
  }

  fadeIn(): void {
    if (this.fadingIn) {
      this.fadingIn = this.opacity <= this.opacityTresh
      this.opacity += this.do
    }
  }

  fadeOut(): void {
    if (this.fadingOut) {
      this.fadingOut = this.opacity >= 0
      this.opacity -= this.do / 2
      if (this.x > width || this.y < 0) {
        this.fadingOut = false
        this.reset()
      }
    }
  }

  forceFadingOut() {
    this.fadingOut = true
  }

  draw(): void {
    this.universe.beginPath()

    if (this.giant) {
      this.universe.fillStyle = `rgba(${giantColor},${this.opacity})`
      this.universe.arc(this.x, this.y, 2, 0, 2 * Math.PI, false)
    } else if (this.comet) {
      this.universe.fillStyle = `rgba(${cometColor},${this.opacity})`
      this.universe.arc(this.x, this.y, 1.5, 0, 2 * Math.PI, false)

      for (let i = 0; i < 30; i++) {
        this.universe.fillStyle = `rgba(${cometColor},${this.opacity})`
        this.universe.fillRect(this.x - (this.dx / 4) * i, this.y - (this.dy / 4) * i - 2, 2, 2)
      }
    } else {
      this.universe.fillStyle = `rgba(${starColor},${this.opacity})`
      this.universe.fillRect(this.x, this.y, this.r, this.r)
    }

    this.universe.closePath()
    this.universe.fill()
  }

  move(): void {
    this.x += this.dx
    this.y += this.dy
    if (!this.fadingOut && (this.x > width - width / 4 || this.y < 0)) {
      this.fadingOut = true
    }
  }
}

function getProbability(percents: number): boolean {
  return Math.random() * 100 < percents
}

function getRandInterval(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

function createUniverse(canvas: HTMLCanvasElement): void {
  const universe = canvas.getContext('2d')!
  for (let i = 0; i < starCount; i++) {
    stars[i] = new Star(universe)
    stars[i].reset()
  }
  draw(universe)
}

function endingDraw(universe: CanvasRenderingContext2D, counter: number): void {
  universe.clearRect(0, 0, width, height)

  for (const star of stars) {
    star.move()
    star.fadeOut()
    star.draw()
  }

  if (counter != 0) {
    window.requestAnimationFrame(() => endingDraw(universe, --counter))
  } else {
    universe.clearRect(0, 0, width, height)
  }
}

function draw(universe: CanvasRenderingContext2D): void {
  universe.clearRect(0, 0, width, height)

  for (const star of stars) {
    star.move()
    star.fadeIn()
    star.fadeOut()
    star.draw()
  }

  if (isEnding) {
    stars.forEach((star) => star.forceFadingOut())
    window.requestAnimationFrame(() => endingDraw(universe, 300))
  } else {
    window.requestAnimationFrame(() => draw(universe))
  }
}

function setEndingSignal(ending: boolean) {
  isEnding = ending
}

function initCanvas(canvas: HTMLCanvasElement): void {
  width = window.innerWidth
  height = window.innerHeight
  starCount = width * starDensity
  canvas.width = width
  canvas.height = height
}

export { createUniverse, initCanvas, setEndingSignal }

// * enum (FRONT) * //

// !: 僅保留繁中 ('sc')
export type Language = 'sc' | 'tc' | 'jp' | 'kr' | 'en' | 'astral'

// !: 僅保留必要字體 ('custom2')
export type Font = 'custom1' | 'custom2' | ''

export type Align = 'left' | 'center' | 'right' | ''

export type Type = 'monster' | 'spell' | 'trap' | 'pendulum'

export type Attribute = 'dark' | 'light' | 'earth' | 'water' | 'fire' | 'wind' | 'divine' | ''

export type Icon = 'equip' | 'field' | 'quick-play' | 'ritual' | 'continuous' | 'counter' | ''

export type CardType =
  | 'normal'
  | 'effect'
  | 'ritual'
  | 'fusion'
  | 'synchro'
  | 'xyz'
  | 'link'
  | 'token'

export type PendulumType =
  | 'normal-pendulum'
  | 'effect-pendulum'
  | 'ritual-pendulum'
  | 'fusion-pendulum'
  | 'synchro-pendulum'
  | 'xyz-pendulum'

// 上 | 右上 | 右 | 右下 | 下 | 左下 | 左 | 左上
export type ArrowType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export type Copyright = 'sc' | 'jp' | 'en' | ''

export type Laser = 'laser1' | 'laser2' | 'laser3' | 'laser4' | ''

export type Rare = 'dt' | 'ur' | 'gr' | 'hr' | 'ser' | 'gser' | 'pser' | ''

// * enum (BACK) * //

export type BackType = 'normal' | 'tormentor' | 'sky-dragon' | 'winged-dragon'

export type Logo = 'ocg' | 'tcg' | 'rd'

// * data * //

export interface CardData {
  radius: boolean
  scale: number
}

// * data (FRONT) * //

export interface FrontCardData extends CardData {
  language: Language
  font: Font
  name: string
  color: string
  align: Align
  gradient: boolean
  gradientColor1: string
  gradientColor2: string
  type: Type
  attribute: Attribute
  icon: Icon
  image: string
  cardType: CardType
  pendulumType: PendulumType
  level: number
  rank: number
  pendulumScale: number
  pendulumDescription: string
  monsterType: string
  atkBar: boolean
  atk: number
  def: number
  arrowList: ArrowType[]
  description: string
  firstLineCompress: boolean
  descriptionAlign: boolean
  descriptionZoom: number
  descriptionWeight: number
  package: string
  password: string
  copyright: Copyright
  laser: Laser
  rare: Rare
  twentieth: boolean
}

// * data (BACK) * //

export interface BackCardData extends CardData {
  type: BackType
  logo: Logo
  konami: boolean
  register: boolean
}

// * entity * //

export type Entity<T extends CardData> = {
  view: HTMLElement
  data: Partial<T>
  resourcePath: string
}

// * card * //

// https://github.com/kooriookami/yugioh-card/blob/master/packages/yugioh-card/src/card/index.js
export class Card<T extends CardData> {
  constructor(entity: Entity<T>)
  data: T
  setData(data: Partial<T>): void
}

// * card (FRONT) * //

// https://github.com/kooriookami/yugioh-card/blob/master/packages/yugioh-card/src/yugioh-card/index.js
export class YugiohCard extends Card<FrontCardData> {}

// ! 不保留 YugiohSeries2Card
// https://github.com/kooriookami/yugioh-card/blob/master/packages/yugioh-card/src/yugioh-series-2-card/index.js
export class YugiohSeries2Card extends YugiohCard {}

// ! 不保留 Rush Duel
// https://github.com/kooriookami/yugioh-card/blob/master/packages/yugioh-card/src/rush-duel-card/index.js
export class RushDuelCard extends YugiohCard {}

// * card (BACK) * //

// https://github.com/kooriookami/yugioh-card/blob/master/packages/yugioh-card/src/yugioh-back-card/index.js
export class YugiohBackCard extends Card<BackCardData> {}

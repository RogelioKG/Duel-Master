import type { ArrowType, Attribute, FrontCardData, Type } from 'yugioh-card'
import type { ArrowTypeName, YCard } from '../../types/ygoprodeck'

export function yCardtoFrontCardData(card: YCard): Partial<FrontCardData> {
  // type
  const cardType = card.type.toLowerCase()
  const keywords: Type[] = ['pendulum', 'monster', 'spell', 'trap']

  // arrowList
  const arrowNameMap: ArrowTypeName[] = [
    '',
    'Top',
    'Top-Right',
    'Right',
    'Bottom-Right',
    'Bottom',
    'Bottom-Left',
    'Left',
    'Top-Left',
  ]

  // return object
  const frontCardData = {
    password: card.id,
    name: card.name,
    type: keywords.find(keyword => cardType.includes(keyword)),
    cardType: card.frameType,
    atk: card.atk,
    def: card.def,
    level: card.level,
    monsterType: card.race,
  }

  if (card.linkData) {
    Object.assign(frontCardData, {
      arrowList: card.linkData.linkmarkers.map(arrow => arrowNameMap.indexOf(arrow) as ArrowType),
    })
  }
  if (card.attribute) {
    Object.assign(frontCardData, {
      attribute: card.attribute.toLowerCase() as Attribute,
    })
  }
  if (card.scale) {
    Object.assign(frontCardData, {
      pendulumScale: card.scale,
    })
  }
  if (card.pend_desc) {
    Object.assign(frontCardData, {
      pendulumDescription: card.pend_desc,
    })
  }

  return frontCardData
}

import type { Card, CardData, Entity } from 'yugioh-card'
import { ref, useTemplateRef } from 'vue'
import { API } from '../../config'

export function useCard<T extends CardData, U extends Card<T>>(
  CardConstructor: new (args: Entity<T>) => U,
  refName: string,
) {
  // ref //
  const cardContent = ref<U>()

  // template ref //
  const cardBody = useTemplateRef<HTMLDivElement>(refName)

  // methods //
  const initCardView = (cardData: Partial<T>) => {
    if (cardBody.value) {
      cardContent.value = new CardConstructor({
        view: cardBody.value,
        data: cardData, // 在 constructor 中 Object.assign 給 this.data
        resourcePath: API.YUGIOH_MATERIAL,
      })
    }
  }

  const setData = (cardData: Partial<T>) => {
    cardContent.value?.setData(cardData)
  }

  const getData = (): T => {
    return JSON.parse(JSON.stringify(cardContent.value?.data))
  }

  const getDataProp = (prop: keyof T): T[keyof T] | undefined => {
    return cardContent.value?.data[prop]
  }

  return {
    cardBody,
    cardContent,
    initCardView,
    setData,
    getData,
    getDataProp,
  }
}

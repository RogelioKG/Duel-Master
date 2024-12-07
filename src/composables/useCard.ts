import { ref, useTemplateRef } from 'vue'
import type { Entity, CardData, Card } from 'yugioh-card'
import { PATH } from '@/config'

export function useCard<T extends CardData, U extends Card<T>>(
  CardConstructor: new (args: Entity<T>) => U,
  refName: string,
) {
  // data //
  const cardBody = useTemplateRef<HTMLDivElement>(refName)
  const cardContent = ref<U>()

  // methods //
  const initCardView = (cardData: Partial<T>) => {
    if (cardBody.value) {
      cardContent.value = new CardConstructor({
        view: cardBody.value,
        data: cardData,
        resourcePath: PATH.YUGIOH_ASSETS,
      })
    }
  }
  const setData = (cardData: Partial<T>) => {
    cardContent.value?.setData(cardData)
  }

  return {
    cardBody,
    cardContent,
    initCardView,
    setData,
  }
}

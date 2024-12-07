<template>
  <div class="whole-card" :style="{ width: `${CANVAS_WIDTH * scale}px`, height: `${CANVAS_HEIGHT * scale}px` }"
    :data-tilt="isTilt">
    <div ref="frontCard" class="front"></div>
    <div ref="backCard" class="back"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { YugiohBackCard, YugiohCard, type BackCardData, type FrontCardData } from 'yugioh-card'
import { useCard } from '@/composables/useCard'
import { CANVAS_WIDTH, CANVAS_HEIGHT, setCardImg } from '@/utils/card-setting'
import { type tiltEffectElement, initTiltEffect, destroyTiltEffect } from '@/utils/card-tilt'

// 使用說明
// ------------------------------------------------------
// Caution:
// 要使用 setData() 才會重繪 (這是 yugioh-card 內部的渲染邏輯)
//
// Example:
// + 更改卡面資料
//   card.value?.setFrontData({ password: '14558127' })
// + 更改卡背資料
//   card.value?.setBackData({ type: 'tormentor' })
// ------------------------------------------------------

// props //
const {
  frontCardData,
  backCardData,
  frontCardConstructor = YugiohCard,
  backCardConstructor = YugiohBackCard,
  isTilt
} = defineProps<{
  frontCardData: Partial<FrontCardData>,
  backCardData: Partial<BackCardData>,
  frontCardConstructor?: typeof YugiohCard,
  backCardConstructor?: typeof YugiohBackCard,
  isTilt: boolean,
}>()

// composable //
const { initCardView: initFrontCardView, setData: _setFrontData } = useCard(frontCardConstructor, 'frontCard')
// Cannot find name 'frontCardConstructor'.
const { initCardView: initBackCardView, setData: _setBackData } = useCard(backCardConstructor, 'backCard')

// computed //
const scale = ref(frontCardData.scale as number)
const actualScale = computed(() => scale.value * window.devicePixelRatio) // 實際渲染時的縮放比例

// life cycle //
onMounted(() => {
  initFrontCardView(Object.assign(frontCardData, { scale: actualScale.value }))
  initBackCardView(Object.assign(backCardData, { scale: actualScale.value }))
  if (isTilt) {
    const cardElement = document.querySelector<HTMLElement>('.whole-card')
    initTiltEffect(cardElement)
  }
})

// methods //
const setFrontData = (cardData: Partial<FrontCardData>) => {
  delete cardData.scale
  setCardImg(cardData) // 自動設定圖片
  _setFrontData(cardData)
}

const setBackData = (cardData: Partial<BackCardData>) => {
  delete cardData.scale
  _setBackData(cardData)
}

const setScale = (newScale: number) => {
  // ! tilt 效果在重新渲染時會有問題，盡可能別使用這個函數
  const cardElement = document.querySelector<tiltEffectElement>('.whole-card')
  if (isTilt) {
    destroyTiltEffect(cardElement)
  }
  scale.value = newScale
  _setFrontData({ scale: actualScale.value })
  _setBackData({ scale: actualScale.value })
  if (isTilt) {
    initTiltEffect(cardElement)
  }
}

// expose //
defineExpose({
  setFrontData,
  setBackData,
  setScale,
})
</script>

<style scoped lang="scss">
.whole-card {
  margin: 0 auto;
  position: relative;

  &:hover .front {
    transform: rotateY(0);
  }

  &:hover .back {
    transform: rotateY(180deg);
  }
}

.front,
.back {
  position: absolute;
  /* 讓兩張牌重疊 */
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  backface-visibility: hidden;
  /* 看不到背面 */
  box-shadow: 20px 20px 20px 0px rgba(0, 0, 0, 0.2);
  transition: 500ms;
}

.front {
  transform: rotateY(-180deg);
}
</style>

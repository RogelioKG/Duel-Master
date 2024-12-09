<template>
  <div ref="cardElement" class="whole-card" @click="flip('switch')"
    :style="{ width: `${CANVAS_WIDTH * scale}px`, height: `${CANVAS_HEIGHT * scale}px` }" :data-tilt="isTilt">
    <div ref="frontCardElement" class="front"></div>
    <div ref="backCardElement" class="back"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import { YugiohBackCard, YugiohCard, type BackCardData, type FrontCardData } from 'yugioh-card'
import { useCard } from '@/composables/useCanvasCard'
import { CANVAS_WIDTH, CANVAS_HEIGHT, setCardImg } from '@/utils/canvas-card/cardSetting'
import { type tiltEffectElement, destroyTiltEffect, initTiltEffect } from '@/utils/canvas-card/cardTilt'

// 說明
// ------------------------------------------------------
// ### Caution:
// 在 yugioh-card canvas card 工具中，要使用 setData() 才會觸發重新渲染，
// 基於此，這裡抽出了 setFrontData() 和 setBackData() 給外部做使用。
//
// ### Example:
// + 更改卡面資料 (並重新渲染)
//   card.value?.setFrontData({ password: '14558127' })
// + 更改卡背資料 (並重新渲染)
//   card.value?.setBackData({ type: 'tormentor' })
// + 更改卡片寬度 (並重新渲染)
//   card.value?.setScale({ scale: widthToScale(400) })
// + 卡片翻面
//   card.value?.flip('front')
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

// ref //
const isFrontSide = ref(false) // 當前卡片正面是否為卡面 (front)

// template ref //
const cardElement = useTemplateRef<tiltEffectElement>('cardElement')

// composable //
const {
  cardBody: frontCardElement,
  initCardView: initFrontCardView,
  setData: _setFrontData
} = useCard(frontCardConstructor, 'frontCardElement')

const {
  cardBody: backCardElement,
  initCardView: initBackCardView,
  setData: _setBackData
} = useCard(backCardConstructor, 'backCardElement')


// computed //
const scale = ref(frontCardData.scale as number)
const actualScale = computed(() => scale.value * window.devicePixelRatio) // 實際渲染時的縮放比例

// life cycle //
onMounted(() => {
  initFrontCardView(Object.assign(frontCardData, { scale: actualScale.value }))
  initBackCardView(Object.assign(backCardData, { scale: actualScale.value }))
  if (isTilt) {
    initTiltEffect(cardElement.value)
  }
})

onUnmounted(() => {
  if (isTilt) {
    destroyTiltEffect(cardElement.value)
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
  scale.value = newScale
  _setFrontData({ scale: actualScale.value })
  _setBackData({ scale: actualScale.value })
}

const flip = (flipSide: 'front' | 'back' | 'switch') => {
  if (!frontCardElement.value || !backCardElement.value) return

  if (isTilt) {
    destroyTiltEffect(cardElement.value) // 避免翻牌時，特效留在原地的窘境
  }

  const flipToBack = flipSide === 'back' || (flipSide === 'switch' && isFrontSide.value)
  const flipToFront = flipSide === 'front' || (flipSide === 'switch' && !isFrontSide.value)

  if (flipToBack) {
    frontCardElement.value.style.transform = 'rotateY(-180deg)'
    backCardElement.value.style.transform = 'rotateY(0)'
    isFrontSide.value = false
  } else if (flipToFront) {
    frontCardElement.value.style.transform = 'rotateY(0)'
    backCardElement.value.style.transform = 'rotateY(180deg)'
    isFrontSide.value = true
  }

  if (isTilt) {
    setTimeout(() => {
      initTiltEffect(cardElement.value)
    }, 500) // 翻牌花 500ms (transition: 500ms)
  }
}

// expose //
defineExpose({
  flip,
  setFrontData,
  setBackData,
  setScale,
})
</script>

<style scoped lang="scss">
// 說明
// ------------------------------------------------------
// ### Brief:
// + 正面為 back (front: -180deg / back: 0deg)
// + 正面為 front (front: 0deg / back: 180deg)
// ------------------------------------------------------

.whole-card {
  margin: 0 auto;
  position: relative;
  transform-style: preserve-3d;
  transform: perspective(1000px);
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
  box-shadow: 40px 40px 40px 0px rgba(0, 0, 0, 0.5);
  transition: 500ms;
}

.front {
  transform: rotateY(-180deg);
}

.back {
  transform: rotateY(0deg);
}
</style>

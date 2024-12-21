<script lang="ts">
/**
## Note

傳進來的 `frontCardData` 和 `backCardData` 允許只有部分資料，
因為它只會 `Obejct.assign` 給 `this.data`，裡面有很多預設值。
在作者源代碼中，表明是使用 `setData()` 才會變更 `this.data` 並觸發重新渲染。
基於此，這裡抽出了 `setFrontCardData()` 和 `setBackCardData()` 給外部設定。

## Example

In `<template>`
```html
<CanvasCard
  ref="cardRef"
  :front-card-data="frontCardData"
  :back-card-data="backCardData"
  :is-tilt="true">
</CanvasCard>
```

In `<script setup>`
```typescript
import { initFrontCardData, initBackCardData } from '@/utils/canvas-card/cardInit'

const cardRef = useTemplateRef('cardRef')
// 創建卡面資料
const frontCardData = initFrontCardData(yugiohExample, { width: 400 })
// 創建卡背資料
const backCardData = initBackCardData(yugiohBackExample, { width: 400 })

OnMounted(() => {
  if (cardRef.value) {
    // 更改卡面資料 (並重新渲染)
    cardRef.value.setFrontCardData({ password: '14558127' })
    // 更改卡背資料 (並重新渲染)
    cardRef.value.setBackCardData({ type: 'tormentor' })
    // 取得卡面資料
    cardRef.value.getFrontCardData()
    // 取得卡背資料
    cardRef.value.getBackCardData()
    // 更改卡片寬度 (並重新渲染)
    cardRef.value.setSize({ width: 400 })
    // 卡片翻到卡背
    cardRef.value.flip('back')
    // 使用者不可點擊卡片翻面
    cardRef.value.enableClickFlip(false)
    // 顯示幫助資訊 (內容文字放大，放在卡背)
    cardRef.value.enableHelpInfo(true)
  }
})
```
*/
export default {}
</script>

<template>
  <div
    ref="cardElementRef"
    class="whole-card"
    @click="canClickFlip && flip('toggle')"
    :style="{
      width: `${CANVAS_WIDTH * scale}px`,
      height: `${CANVAS_HEIGHT * scale}px`,
    }"
    :data-tilt="isTilt"
  >
    <div ref="frontCardElementRef" class="front" :style="{ boxShadow: boxShadow }"></div>
    <div
      ref="backCardElementRef"
      v-show="!hasHelpInfo"
      class="back"
      :style="{ boxShadow: boxShadow }"
    ></div>
    <div ref="helpElementRef" v-show="hasHelpInfo" class="back" :style="{ boxShadow: boxShadow }">
      <div class="help-info">
        <!-- 這裡 click 也會順便 flip('front')，就不必重複做一遍了 -->
        <BoxButton tag="button" class="close-btn" @click="enableHelpInfo(false, FLIP_DURATION_MS)">
          <CloseIcon style="color: var(--primary-color)" />
        </BoxButton>
        <h3>
          {{ helpInfoName }}
        </h3>
        <p>
          {{ helpInfoDescription }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { YugiohBackCard, YugiohCard, type BackCardData, type FrontCardData } from 'yugioh-card'
import CloseIcon from '../../components/icon/CloseIcon.vue'
import { useCard } from '../../composables/canvas-card/useCanvasCard'
import { useTiltEffect } from '../../composables/effects/useTiltEffect'
import { FLIP_DURATION_MS } from '../../config'
import type { Dimension } from '../../types'
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  setCardImg,
  sizeToScale,
} from '../../utils/canvas-card/cardSetting'
import { sleep } from '../../utils/misc/methods'
import BoxButton from '../button/BoxButton.vue'

// props //
const {
  frontCardData,
  backCardData,
  frontCardConstructor = YugiohCard,
  backCardConstructor = YugiohBackCard,
  isTilt,
} = defineProps<{
  frontCardData: Partial<FrontCardData>
  backCardData: Partial<BackCardData>
  frontCardConstructor?: typeof YugiohCard
  backCardConstructor?: typeof YugiohBackCard
  isTilt: boolean
}>()

// template ref //
const cardElementRef = useTemplateRef('cardElementRef')
const helpElementRef = useTemplateRef('helpElementRef')

// composable //
const {
  cardBody: frontCardElementRef,
  initCardView: initFrontCardView,
  setData: _setFrontCardData,
  getData: _getFrontCardData,
} = useCard(frontCardConstructor, 'frontCardElementRef')

const {
  cardBody: backCardElementRef,
  initCardView: initBackCardView,
  setData: _setBackCardData,
  getData: _getBackCardData,
} = useCard(backCardConstructor, 'backCardElementRef')

const { reinitTiltEffect: reinitCardTiltEffect, destroyTiltEffect: destroyCardTiltEffect } =
  useTiltEffect(cardElementRef, { enable: isTilt })

// ref //
const isFrontSide = ref(false) // 當前卡片正面是否為卡面 (front)
const canClickFlip = ref(true) // 是否可以翻面
const scale = ref(frontCardData.scale as number) // 縮放比例
const hasHelpInfo = ref(false) // 是否顯示幫助資訊
const helpInfoName = ref('') // 幫助資訊名稱
const helpInfoDescription = ref('') // 幫助資訊描述

// computed //
const actualScale = computed(() => scale.value * window.devicePixelRatio) // 實際渲染時的縮放比例
const boxShadow = computed(() => {
  const shadowSize = 140 * scale.value
  return `${shadowSize}px ${shadowSize}px ${shadowSize}px 0px rgba(0, 0, 0, 0.5)`
})

// life cycle //
onMounted(() => {
  initFrontCardView(frontCardData)
  _setFrontCardData({ scale: actualScale.value })
  helpInfoName.value = frontCardData.name || ''
  helpInfoDescription.value = frontCardData.description || ''
  initBackCardView(backCardData)
  _setBackCardData({ scale: actualScale.value })
  if (cardElementRef.value) {
    cardElementRef.value.style.setProperty('--flip-duration', `${FLIP_DURATION_MS}ms`) // 與 CSS 共享常數
  }
})

// methods //
const setFrontCardData = (cardData: Partial<FrontCardData>) => {
  delete cardData.scale
  setCardImg(cardData) // 自動設定圖片
  _setFrontCardData(cardData)
  helpInfoName.value = cardData.name || ''
  helpInfoDescription.value = cardData.description || ''
}

const setBackCardData = (cardData: Partial<BackCardData>) => {
  delete cardData.scale
  _setBackCardData(cardData)
}

const getFrontCardData = () => {
  const frontCardData = _getFrontCardData()
  frontCardData.scale = scale.value
  return frontCardData
}

const getBackCardData = () => {
  const backCardData = _getBackCardData()
  backCardData.scale = scale.value
  return backCardData
}

const setSize = (size: Dimension) => {
  scale.value = sizeToScale(size)
  _setFrontCardData({ scale: actualScale.value })
  _setBackCardData({ scale: actualScale.value })
}

const flip = async (flipSide: 'front' | 'back' | 'toggle', delay: number = 0): Promise<void> => {
  const flipAction = async () => {
    if (!frontCardElementRef.value || !backCardElementRef.value) return

    const frontCard = frontCardElementRef.value
    const backCard = hasHelpInfo.value ? helpElementRef.value! : backCardElementRef.value

    destroyCardTiltEffect() // 避免翻牌時，特效留在原地的窘境

    const flipToBack = flipSide === 'back' || (flipSide === 'toggle' && isFrontSide.value)
    const flipToFront = flipSide === 'front' || (flipSide === 'toggle' && !isFrontSide.value)

    if (flipToBack) {
      frontCard.style.transform = 'rotateY(-180deg)'
      backCard.style.transform = 'rotateY(0)'
      isFrontSide.value = false
    } else if (flipToFront) {
      frontCard.style.transform = 'rotateY(0)'
      backCard.style.transform = 'rotateY(180deg)'
      isFrontSide.value = true
    }
    await sleep(FLIP_DURATION_MS) // 翻牌延遲

    if (isTilt) {
      reinitCardTiltEffect()
    }
  }

  if (delay) {
    await sleep(delay) // 等待指定的延遲時間
  }
  await flipAction()
}

const enableClickFlip = (enable: boolean) => {
  canClickFlip.value = enable
}

const enableHelpInfo = async (enable: boolean, delay: number = 0) => {
  // 切換前 transform 要保持同步
  const helpInfoChange = () => {
    if (enable) {
      helpElementRef.value!.style.transform = backCardElementRef.value!.style.transform
    } else {
      backCardElementRef.value!.style.transform = helpElementRef.value!.style.transform
    }
    hasHelpInfo.value = enable
  }

  if (!delay) {
    helpInfoChange()
  } else {
    await sleep(delay)
    helpInfoChange()
  }
}

// expose //
defineExpose({
  flip,
  enableClickFlip,
  enableHelpInfo,
  setFrontCardData,
  setBackCardData,
  getFrontCardData,
  getBackCardData,
  setSize,
})
</script>

<style scoped lang="css">
/*
說明
------------------------------------------------------
### Brief:
+ 正面為 back (front: -180deg / back: 0deg)
+ 正面為 front (front: 0deg / back: 180deg)
------------------------------------------------------
*/

.whole-card {
  margin: 0 auto;
  position: relative;
  transform-style: preserve-3d;
  transform: perspective(1000px);
  /* default */
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
  transition: var(--flip-duration);
}

.front {
  transform: rotateY(-180deg);
}

.back {
  transform: rotateY(0deg);
}

/* HELP INFO */

.help-info {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  background-color: #1e1e1e;
  border: 1px solid var(--primary-color);
  font-size: 1.5rem;
  color: var(--primary-color);
  border-radius: 6px;
  padding: 50px;
  font-family: 'Noto Sans TC';
}

.help-info h3 {
  padding: 0 0 20px 0;
  font-size: 3rem;
  font-weight: 700;
}

.help-info h3::after {
  content: '';
  display: block;
  width: 100%;
  height: 2px;
  background-color: var(--primary-color);
  margin: 20px auto;
}

.help-info p {
  font-size: 1.3rem;
  font-weight: 300;
  text-align: justify;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  background-color: transparent;
  border: none;
  cursor: pointer;
}
</style>

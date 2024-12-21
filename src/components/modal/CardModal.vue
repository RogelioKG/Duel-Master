<template>
  <BaseModal ref="baseModalRef">
    <template #body>
      <div class="modal-body">
        <div
          class="card-container"
          :class="{
            'card-leaving': isCardLeaving,
            'card-base-disappearing': isCardOnPosition,
          }"
        >
          <div
            ref="cardTranslateRef"
            class="card-translate"
            :class="{ 'card-leaving': isCardLeaving }"
          >
            <CanvasCard
              ref="cardRef"
              :front-card-data="cardInfo.frontCardData"
              :back-card-data="cardInfo.backCardData"
              :is-tilt="true"
            >
            </CanvasCard>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="modal-footer">
        <div class="help-btn-block">
          <PosBoxButton
            tag="button"
            class="rounded-30"
            :class="{ disabled: !isResultObtained }"
            @click="showHelpInfo"
            :disabled="!isResultObtained"
          >
            <QuestionMarkIcon />
          </PosBoxButton>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from 'vue'
import { useResponsiveCard } from '../../composables/canvas-card/useResponsiveCard'
import { CARD_LEAVING_MS } from '../../config'
import type { CardInfo, Dimension } from '../../types'
import { initBackCardData, initFrontCardData } from '../../utils/canvas-card/cardInit'
import { sleep } from '../../utils/misc/methods'
import PosBoxButton from '../button/PosBoxButton.vue'
import CanvasCard from '../canvas-card/CanvasCard.vue'
import QuestionMarkIcon from '../icon/QuestionMarkIcon.vue'
import BaseModal from '../modal/BaseModal.vue'

// props //
const props = defineProps<{
  cardInfo: CardInfo
  maxSize: Dimension
  breakpointMap?: Record<number, number>
}>()

// template ref //
const cardRef = useTemplateRef('cardRef')
const baseModalRef = useTemplateRef('baseModalRef')
const cardTranslateRef = useTemplateRef('cardTranslateRef')

// ref //
const isCardLeaving = ref(false) // 控制卡片進離場動效
const isCardOnPosition = ref(true) // 卡片是否在原位
const isResultObtained = ref(false) // 是否已取得結果

// methods //
const flipCard = async (flipSide: 'front' | 'back', delay?: number) => {
  cardRef.value?.flip(flipSide, delay)
}

const showHelpInfo = () => {
  cardRef.value?.enableHelpInfo(true)
  cardRef.value?.flip('back', 100)
}

const entering = async () => {
  isCardLeaving.value = false // 卡片進場開始
  await sleep(CARD_LEAVING_MS)
  isCardOnPosition.value = true // 卡片就位
}

const leaving = async () => {
  isCardLeaving.value = true // 卡片離場開始
  isCardOnPosition.value = false // 卡片離席
  await sleep(CARD_LEAVING_MS)
}

const cardEntering = async () => {
  const rawRard = cardRef.value
  if (!rawRard) return
  rawRard.enableClickFlip(true)
  await entering() // 卡片進場
  await rawRard.flip('front') // 翻到正面
}

const cardLeaving = async () => {
  const rawRard = cardRef.value
  if (!rawRard) return
  rawRard.enableClickFlip(false)
  await rawRard.flip('back') // 翻到背面
  await leaving() // 卡片離場
}

const showModal = async () => {
  // 先設定卡片資料
  initFrontCardData(props.cardInfo.frontCardData, props.maxSize)
  initBackCardData(props.cardInfo.backCardData, props.maxSize)
  // 再顯示 modal
  baseModalRef.value?.showModal()
  await nextTick() // 確保 DOM 更新完成 (才可設定其他 ref)
  if (props.breakpointMap) {
    // 若有 breakpointMap 則啟用 responsive 卡片大小
    const { initResponsive } = useResponsiveCard(cardRef, props.breakpointMap, props.maxSize)
    initResponsive()
  }
  cardTranslateRef.value?.style.setProperty('--card-leaving', `${CARD_LEAVING_MS}ms`)
}

const closeModal = () => {
  baseModalRef.value?.closeModal()
}

const getCardInfo = (): CardInfo | undefined => {
  if (cardRef.value) {
    return {
      frontCardData: cardRef.value.getFrontCardData(),
      backCardData: cardRef.value.getBackCardData(),
    }
  }
}

const setCardInfo = (cardInfo: Partial<CardInfo>) => {
  if (cardInfo.frontCardData) {
    cardRef.value?.setFrontCardData(cardInfo.frontCardData)
  }
  if (cardInfo.backCardData) {
    cardRef.value?.setBackCardData(cardInfo.backCardData)
  }
}

const resultObtained = () => {
  isResultObtained.value = true
}

// expose //
defineExpose({
  flipCard,
  cardLeaving,
  cardEntering,
  showModal,
  closeModal,
  setCardInfo,
  getCardInfo,
  resultObtained,
})
</script>

<style scoped lang="css">
.help-btn-block {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.disabled {
  cursor: not-allowed;
}

.rounded-30 {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

/*
* HOLLOW CARD LOADING EFFECT
*/
@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.card-container {
  position: relative;
  background: #050505;
  border-radius: 6px;
  transition: background 0.5s;
}

.card-container::after,
.card-container::before {
  --angle: 0deg;
  content: '';
  height: 101.5%;
  width: 101.5%;
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: -1;
  transform: translate(-50%, -50%);
  border-radius: 10px;
  background: conic-gradient(from var(--angle), transparent 70%, var(--primary-color));
  animation: spin 3s linear infinite;
  opacity: 0;
  transition: opacity 3s ease-in-out;
}

.card-container::after {
  filter: blur(10px);
}

@keyframes spin {
  from {
    --angle: 0deg;
  }

  to {
    --angle: 360deg;
  }
}

.card-container.card-base-disappearing {
  background: transparent;
}

.card-container.card-leaving::after,
.card-container.card-leaving::before {
  opacity: 1;
}

/*
* CARD ENTERING AND LEAVING EFFECT
*/
.card-translate {
  transform: translateY(0px);
  transition: transform var(--card-leaving) ease-in-out;
}

.card-translate.card-leaving {
  transform: translateY(-160%);
}
</style>

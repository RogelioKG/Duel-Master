<template>
  <main>
    <div class="jagged-bg"></div>
    <div class="translation container-fluid">
      <div class="translation-content row">
        <div class="btn-group col-md-6" v-if="isLargeScreen">
          <div class="btn-with-gap-block">
            <FillButton tag="button" :active-r="!!imageFile" @click="modalDropRef?.showModal()">
              Upload image
              <!-- <lord-icon src="https://cdn.lordicon.com/rszslpey.json" trigger="morph" state="morph-sea"
                colors="primary:#f5deb3,secondary:#f5deb3" style="width:50px;height:50px">
              </lord-icon> -->
            </FillButton>
            <InputButton :active-r="!!passwordInput" @get-input="getInputHandler">
              Password
            </InputButton>
          </div>
          <div class="submit-btn-block">
            <FillButton tag="button" :active-r="!!imageFile" class="rounded-60" @click="submit">
              <ArrowRight></ArrowRight>
            </FillButton>
          </div>
        </div>
        <div class="card-group col-md-6 col-sm-12">
          <div class="card-container"
            :class="{ 'card-leaving': isCardLeaving, 'card-base-disappearing': isCardOnPosition }">
            <div ref="cardTranslateRef" class="card-translate" :class="{ 'card-leaving': isCardLeaving }">
              <CanvasCard ref="cardRef" :front-card-data="frontCardData" :back-card-data="backCardData" :is-tilt="true">
                <template #help-title>
                  青眼白龍
                </template>
                <template #help-content>
                  以高攻擊力著稱的傳說之龍。任何對手都能將之粉碎，其破壞力不可估量。
                </template>
              </CanvasCard>
            </div>
          </div>
          <div class="help-btn-block" v-if="isLargeScreen">
            <FillButton tag="button" class="rounded-30"
              @click="cardRef?.enableHelpInfo(true); cardRef?.flip('back', 100)">
              <QuestionMark></QuestionMark>
            </FillButton>
          </div>
        </div>
        <div class="bottom-btn-group" v-if="!isLargeScreen">
          <div class="plus-btn-block">
            <FillButton tag="button" class="rounded-60" @click="modalPlusRef?.showModal()">
              <Plus class="transition" :class="{ 'rotate-45': modalPlusRef?.isShow() }"></Plus>
            </FillButton>
          </div>
          <div class="help-btn-block">
            <FillButton tag="button" class="rounded-30"
              @click="cardRef?.enableHelpInfo(true); cardRef?.flip('back', 100)">
              <QuestionMark></QuestionMark>
            </FillButton>
          </div>
        </div>
      </div>
      <Teleport to="body">
        <FileUploadModal ref="modalDropRef" @file-upload="fileUploadHandler"></FileUploadModal>
      </Teleport>
      <Teleport to="body">
        <BaseModal ref="modalPlusRef">
          <template #body>
            <div class="modal-body">
              <div class="btn-with-gap-block">
                <FileUploadButton :data-types="isImage" :active-r="!!imageFile" @file-upload="fileUploadHandler">
                  Upload Image
                </FileUploadButton>
                <InputButton :active-r="!!passwordInput" @get-input="getInputHandler">
                  Password
                </InputButton>
                <FillButton tag="button" :active-r="!!imageFile" @click="modalPlusRef?.closeModal(); submit()">
                  <ArrowRight></ArrowRight>
                </FillButton>
              </div>
            </div>
          </template>
        </BaseModal>
      </Teleport>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref, toValue, useTemplateRef, watch } from 'vue'
import { useMediaQuery, type MaybeElementRef } from '@vueuse/core'
import { CARD_LEAVING_MS, FLIP_DURATION_MS } from '@/config'
import type { CanvasCardType } from '@/types'
import yugiohExample from '@/example/yugioh'
import yugiohBackExample from '@/example/yugiohBack'
import CanvasCard from '@/components/canvas-card/CanvasCard.vue'
import ArrowRight from '@/components/svg/ArrowRight.vue'
import Plus from '@/components/svg/Plus.vue'
import FillButton from '@/components/button/FillButton.vue'
import FileUploadButton from '@/components/button/FileUploadButton.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import FileUploadModal from '@/components/modal/FileUploadModal.vue'
import InputButton from '@/components/button/InputButton.vue'
import { useResponsiveCard } from '@/composables/card/useResponsiveCard'
import { translateAPI } from '@/api/translation'
import { isImage } from '@/utils/others/methods'
import { createFrontCardData, createBackCardData } from '@/utils/canvas-card/cardCreation'
import QuestionMark from '@/components/svg/QuestionMark.vue'

// variable //
const frontCardData = createFrontCardData(yugiohExample, { width: 400 })
const backCardData = createBackCardData(yugiohBackExample, { width: 400 })

// template ref //
const cardRef = useTemplateRef<CanvasCardType>('cardRef')
const cardTranslateRef = useTemplateRef('cardTranslateRef')
const modalPlusRef = useTemplateRef('modalPlusRef')
const modalDropRef = useTemplateRef('modalDropRef')

// ref //
const imageFile = ref<File>() // 圖片
const passwordInput = ref<string>('') // 密碼
const isLargeScreen = useMediaQuery('(min-width: 768px)')
const isCardLeaving = ref(true) // 控制卡片進離場動效
const isCardOnPosition = ref(false) // 卡片是否在原位

// composables //
useResponsiveCard(cardRef,
  {
    320: 260,
    375: 280,
    425: 300,
    768: 330,
    850: 300,
    1024: 350,
  },
  { width: 400 },
)

// methods //
const fileUploadHandler = (file: File) => { imageFile.value = file }
const getInputHandler = (input: string) => { passwordInput.value = input }

const clearFileAndPassword = () => {
  imageFile.value = undefined
  passwordInput.value = ''
}

const cardEnteringEffect = (card: MaybeElementRef<CanvasCardType | null>) => {
  const rawRard = toValue(card)
  if (!rawRard) return
  rawRard.enableClickFlip(true)
  isCardLeaving.value = false // 卡片進場
  setTimeout(() => {
    rawRard.flip('front') // 翻到正面
  }, CARD_LEAVING_MS)
}

const cardLeavingEffect = (card: MaybeElementRef<CanvasCardType | null>) => {
  const rawRard = toValue(card)
  if (!rawRard) return
  rawRard.enableClickFlip(false)
  rawRard.flip('back') // 翻到背面
  setTimeout(() => {
    isCardLeaving.value = true // 卡片離場
  }, FLIP_DURATION_MS)
}

const submit = () => {
  if (!imageFile.value) return
  const image = imageFile.value
  const password = passwordInput.value
  clearFileAndPassword()
  cardLeavingEffect(cardRef)
  const translatePromise = translateAPI(image)
  setTimeout(async () => {
    if (!cardRef.value) return
    cardRef.value.setFrontCardData({ password: password }) // 14558127
    const { data } = await translatePromise
    if (data.success) {
      cardRef.value.setFrontCardData(data.frontCardData)
    } else {
      // 翻譯錯誤
    }
    cardEnteringEffect(cardRef)
  }, FLIP_DURATION_MS + CARD_LEAVING_MS)
}

// watch //
watch(isLargeScreen, (large: boolean) => {
  if (large) {
    modalPlusRef.value?.closeModal() // 如果螢幕被拉大，就強制關掉 modalPlus
  } else {
    modalDropRef.value?.closeModal() // 否則強制關掉 modalDrop
  }
})

watch(isCardLeaving, (leaving) => {
  if (!leaving) {
    setTimeout(() => {
      isCardOnPosition.value = true // 卡片進場後，要等一段動畫時間才會就位
    }, CARD_LEAVING_MS)
  } else {
    isCardOnPosition.value = false
  }
})

// life cycle //
onMounted(() => {
  cardTranslateRef.value?.style.setProperty('--card-leaving', `${CARD_LEAVING_MS}ms`)
  cardEnteringEffect(cardRef)
})
</script>

<style scoped lang="css">
@import url("../styles/css/jagged-bg.css");
@import url("../styles/scss/utilities.scss");

.translation {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.translation-content {
  height: 100%;
}

.modal-body {
  position: absolute;
  bottom: -100px;
}

.btn-group,
.card-group {
  position: relative;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}

.submit-btn-block {
  position: absolute;
  right: calc(0% - 10px);
  top: calc(50% - 30px);
}

.bottom-btn-group {
  display: flex;
  flex-flow: column;
  justify-content: start;
  align-items: center;
}

.plus-btn-block {
  left: calc(50% - 30px);
  bottom: 5%;
}

.card-group .help-btn-block {
  margin-top: 50px;
}

.bottom-btn-group .help-btn-block {
  padding-top: 30px;
}

.btn-with-gap-block {
  display: flex;
  flex-flow: column;
  align-items: center;
}

.btn-with-gap-block> :not(:last-child) {
  margin-bottom: 50px;
}

/*
* HOLLOW CARD LOADING EFFECT
*/
@property --angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

.card-container {
  position: relative;
  background: #1e1e1e;
  border-radius: 6px;
  transition: background 0.5s;
}

.card-container::after,
.card-container::before {
  --angle: 0deg;
  content: "";
  height: 101.5%;
  width: 101.5%;
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: -1;
  transform: translate(-50%, -50%);
  border-radius: 10px;
  background: conic-gradient(from var(--angle),
      transparent 70%,
      var(--primary-color));
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

.transition {
  transition: transform 0.5s;
}

.rotate-45 {
  transform: rotate(45deg);
}
</style>

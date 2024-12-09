<template>
  <main>
    <div class="translation">
      <div class="col">
        <div class="btn-group">
          <button type="button" class="diff-btn position-aware">Upload Image<span></span></button>
          <button type="button" class="diff-btn position-aware">Password<span></span></button>
        </div>
        <div class="submit-btn">
          <button type="button" class="diff-btn position-aware submit">
            <ArrowRight></ArrowRight><span></span>
          </button>
        </div>
      </div>
      <div class="col">
        <CanvasCard ref="card1" :front-card-data="frontCardData" :back-card-data="backCardData" :is-tilt="true">
        </CanvasCard>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useTemplateRef, onMounted } from 'vue'
import { type CanvasCardType } from '@/types/all'
import yugiohExample from '@/assets/example/yugioh'
import yugiohBackExample from '@/assets/example/yugiohBack'
import CanvasCard from '@/components/CanvasCard.vue'
import ArrowRight from '@/components/icons/ArrowRight.vue'
import { createFrontCard, createBackCard, responsiveCard } from '@/utils/canvas-card/cardSetting'
import { positionAwareEffect } from '@/utils/effects'

// variable //
const frontCardData = createFrontCard(yugiohExample, { width: 400 })
const backCardData = createBackCard(yugiohBackExample, { width: 400 })

// template ref //
const card1 = useTemplateRef<CanvasCardType>('card1')

// life cycle //
onMounted(() => {
  positionAwareEffect('.position-aware')
})

// test code //
responsiveCard(card1,
  {
    500: 100,
    600: 200,
    700: 250,
    800: 300
  },
  { maxWidth: 400 },
)

setInterval(() => {
  card1.value?.flip('switch')
}, 3000)

</script>

<style scoped lang="css">
@import url("../assets/css/jagged-bg.css");
@import url("../assets/css/diff-button.css");

.translation {
  display: flex;
  flex-flow: row;
  align-items: center;
  width: 100%;
  height: 100%;
}

.col {
  position: relative;
  width: 50%;
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}

.diff-btn {
  color: wheat;
  border: 1px solid wheat;
}

.diff-btn:nth-child(n+2) {
  margin-top: 50px;
}

.diff-btn span {
  width: 0;
  height: 0;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
  background: wheat;
  transition: width 0.4s ease-in-out, height 0.4s ease-in-out;
}

.diff-btn:hover span {
  width: 225%;
  height: 600%;
}

.submit-btn {
  position: absolute;
  right: calc(0% - 30px);
  top: calc(50% - 30px);
}

.submit {
  width: 60px;
  height: 60px;
  margin: 20px;
  border-radius: 50%;
}
</style>

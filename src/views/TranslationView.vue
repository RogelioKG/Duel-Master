<template>
  <main>
    <video :src="`${PATH.YUGIOH_RESOURCES}/yugioh-bg.mp4`" autoplay muted loop plays-inline></video>
    <div class="wrapper">
      <div class="col">
        <Card ref="card1" :front-card-data="frontCardData" :back-card-data="backCardData" :is-tilt="true">
        </Card>
      </div>
      <div class="col">
        <button type="button" class="btn" href="#" id="toggleweight">Cool button.</button>
        <button type="button" class="btn" href="#" id="toggleweight">Cool button.</button>
        <button type="button" class="btn" href="#" id="toggleweight">Cool button.</button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import Card from '@/components/Card.vue'
import yugiohExample from '@/assets/example/rush-duel'
import yugiohBackExample from '@/assets/example/yugioh-back'
import { createFrontCard, createBackCard } from '@/utils/card-setting'
import { PATH } from '@/config'

// template ref //
const card1 = useTemplateRef('card1')

// variable //
const frontCardData = createFrontCard(yugiohExample, { width: 400 })
const backCardData = createBackCard(yugiohBackExample, { width: 400 })

// https://codepen.io/Rogelio-KG/pen/XJrdzXK
</script>

<style scoped lang="css">
@import url("../assets/css/yugioh-bg.css");

video {
  filter: blur(30px) grayscale(50%);
}

.wrapper {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.col {
  width: 50%;
}
</style>

<template>
  <div class="test">
    <div class="slider" style="--quantity: 6">
      <div class="item" style="--position: 1">
        <img :src="`${PATH.YUGIOH_ASSETS}/yugioh-back/image/card-normal.png`" />
      </div>
      <div class="item" style="--position: 2">
        <img :src="`${PATH.YUGIOH_ASSETS}/yugioh-back/image/card-normal.png`" />
      </div>
      <div class="item" style="--position: 3">
        <img :src="`${PATH.YUGIOH_ASSETS}/yugioh-back/image/card-normal.png`" />
      </div>
      <div class="item" style="--position: 4">
        <img :src="`${PATH.YUGIOH_ASSETS}/yugioh-back/image/card-normal.png`" />
      </div>
      <div class="item" style="--position: 5">
        <img :src="`${PATH.YUGIOH_ASSETS}/yugioh-back/image/card-normal.png`" />
      </div>
      <div class="item" style="--position: 6">
        <img :src="`${PATH.YUGIOH_ASSETS}/yugioh-back/image/card-normal.png`" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PATH } from '@/config'
</script>

<style scoped lang="css">
@import url('@/assets/css/card-slider-3d.css');

.test {
  width: 100%;
  height: 100%;
  background-color: #1E1E1E;
  text-align: center;
  overflow: hidden;
  position: relative;
}

img {
  width: 100px;
}
</style>

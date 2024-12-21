<template>
  <main>
    <video
      class="parallax-p100"
      :src="`${PATH.YUGIOH_RESOURCES}/yugioh-bg.mp4`"
      autoplay
      muted
      loop
      plays-inline
    ></video>
    <div class="content">
      <h1>Duel Master!</h1>
      <div class="btn-group">
        <FillBoxButton tag="RouterLink" to="/chatroom" class="link-btn chatroom"
          >Start</FillBoxButton
        >
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import FillBoxButton from '../components/button/FillBoxButton.vue'
import { useParallaxEffect } from '../composables/effects/useParallaxEffect'
import { PATH } from '../config'

// composables //
useParallaxEffect('.parallax-p100', 1 / 100)
</script>

<style scoped lang="css">
@import url('../styles/css/yugioh-bg.css');

/******************** < w320px Starts ********************/
main {
  filter: grayscale(50%);
  transition: filter 1s;
}

video {
  filter: blur(5px);
  transition: filter 1s;
}

.content {
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: center;
  text-align: center;
}

h1 {
  color: white;
  mix-blend-mode: difference;
  font-size: 5rem;
  font-family: 'Matrix II Bold';
}

.btn-group {
  display: flex;
  flex-flow: row;
  justify-content: center;
  margin-top: 70px;
}

.link-btn:nth-child(n + 2) {
  margin-left: 30px;
}

main:has(.link-btn.chatroom:hover) {
  filter: grayscale(20%);
}

main:has(.link-btn.chatroom:hover) video {
  filter: blur(0px);
}

/******************** < w320px Ends ********************/

/******************** Mobile S - w320px Starts ********************/
@media all and (min-width: 320px) {
}

/******************** Mobile S - w320px Ends ********************/

/******************** Mobile M - w375px) Starts ********************/
@media all and (min-width: 375px) {
}

/******************** Mobile M - w375px Ends ********************/

/******************** Mobile L - w425px Starts ********************/
@media (min-width: 425px) {
  h1 {
    font-size: 8rem;
  }

  .link-btn:nth-child(n + 2) {
    margin-left: 60px;
  }
}

/******************** Mobile L - w425px Ends ********************/

/******************** Tablet - w768px Starts ********************/
@media all and (min-width: 768px) {
  h1 {
    font-size: 10rem;
  }

  .link-btn:nth-child(n + 2) {
    margin-left: 80px;
  }
}

/******************** Tablet - w768px Ends ********************/

/******************** Laptop - w1024px Starts ********************/
@media all and (min-width: 1024px) {
  h1 {
    font-size: 12rem;
  }

  .btn-group {
    margin-top: 80px;
  }

  .link-btn:nth-child(n + 2) {
    margin-left: 120px;
  }
}

/******************** Laptop - w1024px Ends ********************/
</style>

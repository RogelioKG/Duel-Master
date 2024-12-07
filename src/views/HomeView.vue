<template>
  <main>
    <video :src="`${PATH.YUGIOH_RESOURCES}/yugioh-bg.mp4`" autoplay muted loop plays-inline></video>
    <div class="content">
      <h1>Duel Master!</h1>
      <div class="btn-group">
        <RouterLink class="btn translation" to="/translation">Translation</RouterLink>
        <RouterLink class="btn qa" to="/qa">Q&A</RouterLink>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { PATH } from '@/config'
import { onMounted, onUnmounted } from 'vue';
import { isTouchDevice } from '@/utils/device'

// methods //
const parallax = (e: MouseEvent) => {
  if (!isTouchDevice) {
    const videoElement = document.querySelector('video')
    if (videoElement) {
      const x = (window.innerHeight - e.pageX) / 100
      const y = (window.innerHeight - e.pageY) / 100
      videoElement.style.transform = `translateX(${x}px) translateY(${y}px)`
    }
  }
}

// life cycle //
onMounted(() => {
  document.addEventListener('mousemove', parallax)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', parallax)
})
</script>

<style scoped lang="css">
@import url('@/assets/css/yugioh-bg.css');

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
  font-family: 'Matrix II Bold';
}

h1 {
  color: white;
  mix-blend-mode: difference;
  font-size: 5rem;
}

.btn-group {
  display: flex;
  flex-flow: row;
  justify-content: center;
  margin-top: 70px;
}

.btn {
  position: relative;
  width: 100px;
  height: 60px;
  border: 1px solid #1E1E1E;
  color: #1E1E1E;
  font-size: 1rem;
  line-height: 60px;
  text-decoration: none;
}

.btn:nth-child(n+2) {
  margin-left: 30px;
}

.btn::after {
  position: absolute;
  content: '';
  width: 100%;
  height: 100%;
  left: 0;
  z-index: -1;
  background-color: transparent;
  transition: background-color 1s;
}

.btn:hover::after {
  background: red;
  mix-blend-mode: difference;
}

.btn:not(:hover)::after {
  mix-blend-mode: difference;
}

main:has(.btn.translation:hover) {
  filter: grayscale(20%);
}

main:has(.btn.translation:hover) video {
  filter: blur(0px);
}

main:has(.btn.qa:hover) {
  filter: grayscale(90%);
}

main:has(.btn.qa:hover) video {
  filter: blur(0px);
}

/******************** < w320px Ends ********************/

/******************** Mobile S - w320px Starts ********************/
@media all and (min-width: 320px) {
  .btn {
    width: 120px;
    font-size: 1.3rem;
  }
}

/******************** Mobile S - w320px Ends ********************/

/******************** Mobile M - w375px) Starts ********************/
@media all and (min-width: 375px) {}

/******************** Mobile M - w375px Ends ********************/

/******************** Mobile L - w425px Starts ********************/
@media (min-width: 425px) {
  h1 {
    font-size: 8rem;
  }

  .btn {
    width: 160px;
    font-size: 1.3rem;
  }

  .btn:nth-child(n+2) {
    margin-left: 60px;
  }
}

/******************** Mobile L - w425px Ends ********************/

/******************** Tablet - w768px Starts ********************/
@media all and (min-width: 768px) {
  h1 {
    font-size: 10rem;
  }

  .btn {
    width: 200px;
    font-size: 1.5rem;
  }

  .btn:nth-child(n+2) {
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

  .btn {
    width: 250px;
    font-size: 1.7rem;
  }

  .btn:nth-child(n+2) {
    margin-left: 120px;
  }
}

/******************** Laptop - w1024px Ends ********************/
</style>

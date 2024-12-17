<template>
  <component :is="tag" class="base-btn">
    <slot />
  </component>
</template>

<script setup lang="ts">
// props //
const { tag } = defineProps<{
  tag: string
}>()
</script>

<style scoped lang="css">
.base-btn {
  position: relative;
  display: block;
  overflow: hidden;
  width: 100px;
  height: 60px;
  border: 1px solid var(--secondary-color);
  background-color: transparent;
  color: var(--secondary-color);
  font-size: 1rem;
  text-decoration: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

/******************** Mobile S - w320px Starts ********************/
@media all and (min-width: 320px) {
  .base-btn {
    width: 130px;
    font-size: 1.3rem;
  }
}

/******************** Mobile S - w320px Ends ********************/

/******************** Mobile M - w375px) Starts ********************/
@media all and (min-width: 375px) {
  .base-btn {
    width: 150px;
  }
}

/******************** Mobile M - w375px Ends ********************/

/******************** Mobile L - w425px Starts ********************/
@media (min-width: 425px) {
  .base-btn {
    width: 170px;
  }
}

/******************** Mobile L - w425px Ends ********************/

/******************** Tablet - w768px Starts ********************/
@media all and (min-width: 768px) {
  .base-btn {
    width: 200px;
    font-size: 1.5rem;
  }
}

/******************** Tablet - w768px Ends ********************/

/******************** Laptop - w1024px Starts ********************/
@media all and (min-width: 1024px) {
  .base-btn {
    width: 250px;
    font-size: 1.7rem;
  }
}

/******************** Laptop - w1024px Ends ********************/
</style>

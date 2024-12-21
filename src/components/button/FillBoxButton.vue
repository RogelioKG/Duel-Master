<template>
  <BoxButton :tag="tag" class="diff-btn"> <slot /><span></span> </BoxButton>
</template>

<script setup lang="ts">
import BoxButton from './BoxButton.vue'

// props //
const { tag } = defineProps<{
  tag: string
}>()
</script>

<style scoped lang="css">
span {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  z-index: -1;
  mix-blend-mode: difference;
  background-color: transparent;
  transition: background-color 1s;
}

.diff-btn:hover span {
  background-color: red;
}
</style>

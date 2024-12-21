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
  font-family: 'Matrix II Bold', sans-serif;
  position: relative;
  display: block;
  overflow: hidden;
  width: 250px;
  height: 60px;
  border: 1px solid var(--secondary-color);
  background-color: transparent;
  color: var(--secondary-color);
  font-size: 1.6rem;
  text-decoration: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>

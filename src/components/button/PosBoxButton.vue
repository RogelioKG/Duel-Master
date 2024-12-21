<template>
  <BoxButton ref="fillBtnRef" :tag="tag" class="fill-btn" :class="{ active: activeR }">
    <slot /><span :class="{ active: activeR }"></span>
  </BoxButton>
</template>

<script setup lang="ts">
import { toRef, useTemplateRef } from 'vue'
import { usePositionAwareEffect } from '../../composables/effects/usePositionAwareEffect'
import BoxButton from './BoxButton.vue'

// props //
const props = defineProps<{
  tag: string
  activeR?: boolean
}>()

// ref //
const activeR = toRef(props, 'activeR')

// constant //
const tag = props.tag

// template ref //
const fillBtnRef = useTemplateRef<HTMLElement>('fillBtnRef')

// composables //
usePositionAwareEffect(fillBtnRef)
</script>

<style scoped lang="css">
.fill-btn {
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  transition: all 0.5s ease-in-out;
}

.fill-btn span {
  position: absolute;
  left: 0;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  border-radius: 50%;
  background: var(--primary-color);
  mix-blend-mode: difference;
  z-index: 1;
  transition:
    width 0.5s cubic-bezier(0.68, -0.01, 0.37, 0.67),
    height 0.5s cubic-bezier(0.68, -0.01, 0.37, 0.67),
    background 0.5s ease-in-out;
}

.fill-btn:hover span {
  width: 600px;
  height: 600px;
}

.fill-btn.active {
  color: var(--primary-active-color);
  border: 1px solid var(--primary-active-color);
}

.fill-btn span.active {
  background: var(--primary-active-color);
}
</style>

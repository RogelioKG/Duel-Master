<template>
  <div class="input-btn">
    <FillButton tag="label" for="input-area" :active-r="activeR" @click="clickHandler">
      <slot />
    </FillButton>
    <input type="text" id="input-area" v-model="inputText" :class="{ 'show': isInputState, 'active': activeR }"
      autocomplete="off" @keyup.enter="clickHandler" />
  </div>
</template>

<script setup lang="ts">
import { ref, toRef } from 'vue'
import FillButton from './FillButton.vue'

// props //
const props = defineProps<{
  activeR: boolean,
}>()

// ref //
const activeR = toRef(props, 'activeR')
const inputText = ref('')
const isInputState = ref(false)

// emit //
// 獲取輸入事件
const emit = defineEmits<{
  (e: 'get-input', input: string): void
}>()

// methods //
const clickHandler = () => {
  if (isInputState.value) {
    emit('get-input', inputText.value)
  }
  isInputState.value = !isInputState.value
}

</script>

<style scoped lang="css">
.input-btn {
  position: relative;
}

#input-area {
  position: absolute;
  width: 100%;
  font-size: 1.2rem;
  background-color: transparent;
  border: 1px solid var(--primary-color);
  border-top: none;
  text-align: center;
  color: white;
  visibility: hidden;
  height: 0px;
  transition: visibility 1s, height 1s;
}

#input-area.active {
  border-color: var(--primary-active-color);
}

#input-area.show {
  visibility: visible;
  height: 30px;
}

#input-area:focus {
  outline: none;
}
</style>

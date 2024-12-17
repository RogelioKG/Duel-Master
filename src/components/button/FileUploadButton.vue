<template>
  <FillButton tag="label" for="file-uploader" :active-r="activeR">
    <input ref="fileUploaderRef" type="file" id="file-uploader" />
    <slot />
  </FillButton>
</template>

<script setup lang="ts">
import { toRef, useTemplateRef } from 'vue'
import { useEventListener } from '@vueuse/core'
import FillButton from './FillButton.vue'

// props //
const props = defineProps<{
  activeR?: boolean,
  dataTypes: string[] | ((types: readonly string[]) => boolean)
}>()

// template ref //
const fileUploaderRef = useTemplateRef('fileUploaderRef')

// ref //
const activeR = toRef(props, 'activeR')

// constant
const dataTypes = props.dataTypes

// methods //
const checkDataTypes = (types: string[]) => {
  return typeof dataTypes === 'function'
    ? dataTypes(types)
    : dataTypes
      ? dataTypes.some(item => types.includes(item))
      : true
}

// composables //
useEventListener(fileUploaderRef, 'change', function (this: HTMLInputElement) {
  if (this.files && this.files.length > 0) {
    const file = this.files[0]
    if (checkDataTypes([ file.type ])) {
      emit('file-upload', file)
    } else {
      alert('Please upload image!')
    }
  }
}, false)

// emit //
const emit = defineEmits<{
  (e: 'file-upload', file: File): void // 檔案上傳事件
}>()
</script>

<style scoped lang="scss">
#file-uploader {
  display: none;
}
</style>

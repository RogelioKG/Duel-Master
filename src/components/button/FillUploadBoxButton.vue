<template>
  <PosBoxButton tag="label" for="file-uploader">
    <input type="file" id="file-uploader" @change="handleChange" />
    <slot />
  </PosBoxButton>
</template>

<script setup lang="ts">
import { type DataTypesChecker } from '../../types'
import { extractFile } from '../../utils/misc/file'
import PosBoxButton from './PosBoxButton.vue'

// props //
const props = defineProps<{
  dataTypes: DataTypesChecker
}>()

// emit //
const emit = defineEmits<{
  (e: 'upload', file: File): void // 檔案上傳事件
}>()

// methods //
const handleChange = (event: Event) => {
  const file = extractFile(event, props.dataTypes)
  if (file) {
    emit('upload', file)
  }
}
</script>

<style scoped lang="css">
#file-uploader {
  display: none;
}
</style>

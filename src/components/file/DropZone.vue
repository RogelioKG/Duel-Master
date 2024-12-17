<template>
  <div ref='dropZoneRef' class="drop-zone">
    <div class="drop-zone-content" :class="{ 'fade': isOverDropZone }">
      <slot />
    </div>
    <StarryNight ref="starryNightRef"></StarryNight>
  </div>
</template>

<script setup lang="ts">
import { useTemplateRef, watch } from 'vue'
import { useDropZone } from '@vueuse/core'
import StarryNight from '@/components/animation/StarryNight.vue'

// props //
const { dataTypes } = defineProps<{
  dataTypes: string[] | ((types: readonly string[]) => boolean)
}>()

// template ref //
const dropZoneRef = useTemplateRef('dropZoneRef')
const starryNightRef = useTemplateRef('starryNightRef')

// emit //
// 檔案上傳事件
const emit = defineEmits<{
  (e: 'file-upload', file: File): void
}>()

// methods //
function onDrop(files: File[] | null) {
  if (files) {
    emit('file-upload', files[0])
  }
}

// composables //
const { isOverDropZone } = useDropZone(dropZoneRef, {
  dataTypes: dataTypes,
  onDrop: onDrop,
})


// watch //
watch(isOverDropZone, () => {
  if (isOverDropZone.value) {
    starryNightRef.value?.enableStarryEffect()
  } else {
    starryNightRef.value?.disableStarryEffect()
  }
})

</script>

<style scoped lang="css">
.drop-zone {
  position: relative;
  width: 100%;
  height: 100%;
}

.drop-zone-content {
  position: absolute;
  width: 100%;
  top: 20%;
  font-size: 1.3rem;
  text-align: center;
  z-index: 1;
  opacity: 0.4;
  transition: opacity 1.5s ease-out;
}

.fade {
  opacity: 0;
}
</style>

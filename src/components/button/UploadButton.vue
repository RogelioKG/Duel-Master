<template>
  <div class="file-upload">
    <input ref="fileInput" type="file" class="hidden-input" @change="handleChange" />
    <button type="button" class="upload-button" @click="handleClick" title="Upload file">
      <UploadIcon />
    </button>
  </div>
  <Teleport to="body">
    <FileUploadModal ref="modalDropRef" @upload="handleFileUpload" />
  </Teleport>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { extractFile } from '../../utils/misc/file'
import { isTouchDevice } from '../../utils/misc/methods'
import UploadIcon from '../lordicon/UploadIcon.vue'
import FileUploadModal from '../modal/FileUploadModal.vue'

// props //
const props = defineProps<{
  dataTypes: string[] | ((types: readonly string[]) => boolean)
}>()

// emit //
const emit = defineEmits<{
  (e: 'upload', file: File): void
}>()

// template ref //
const fileInput = useTemplateRef('fileInput')
const modalDropRef = useTemplateRef('modalDropRef')

// methods //
// 如果不是觸控裝置，則顯示 modal
const handleClick = () => {
  if (isTouchDevice) {
    fileInput.value?.click()
  } else {
    modalDropRef.value?.showModal()
  }
}
const handleChange = (event: Event) => {
  const file = extractFile(event, props.dataTypes)
  if (file) {
    emit('upload', file)
  }
}
const handleFileUpload = (file: File) => {
  emit('upload', file)
}
</script>

<style scoped>
.file-upload {
  position: relative;
}

.hidden-input {
  display: none;
}

.upload-button {
  height: 45px;
  width: 45px;
  color: var(--primary-color);
  border: 1px solid var(--primary-color-bright);
  background-color: var(--primary-color-dim);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-button:hover {
  border-color: var(--primary-active-color);
  background-color: var(--primary-active-color-bright);
}

.upload-button svg {
  transition: transform 0.2s ease;
}

.upload-button:hover svg {
  transform: scale(1.1);
}
</style>

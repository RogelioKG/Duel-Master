<template>
  <BaseModal ref="baseModalRef">
    <template #header>
      <div class="modal-header">
        <div class="close-btn-block">
          <BoxButton tag="button" class="close-btn rounded" @click="baseModalRef?.closeModal()">
            <CloseIcon />
          </BoxButton>
        </div>
      </div>
    </template>
    <template #body>
      <div class="modal-body">
        <div class="drop-block">
          <DropZone :data-types="isImage" @upload="handleFileUpload">
            Drop images here...
          </DropZone>
        </div>
        <div class="upload-block">
          <div class="upload-block-content">or</div>
          <FillUploadBoxButton :data-types="isImage" @upload="handleFileUpload">
            Choose Photo
          </FillUploadBoxButton>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import DropZone from '../../components/file/DropZone.vue'
import CloseIcon from '../../components/icon/CloseIcon.vue'
import { isImage } from '../../utils/misc/file'
import BoxButton from '../button/BoxButton.vue'
import FillUploadBoxButton from '../button/FillUploadBoxButton.vue'
import BaseModal from './BaseModal.vue'

// template ref //
const baseModalRef = useTemplateRef('baseModalRef')

// emit //
const emit = defineEmits<{
  (e: 'upload', file: File): void
}>()

// methods //
const handleFileUpload = (file: File) => {
  emit('upload', file)
  baseModalRef.value?.closeModal()
}

// expose //
defineExpose({
  isShow: () => baseModalRef.value?.isShow(),
  showModal: () => baseModalRef.value?.showModal(),
  closeModal: () => baseModalRef.value?.closeModal(),
})
</script>

<style scoped lang="scss">
.modal-body {
  font-family: 'Matrix II Bold', sans-serif;
  color: var(--primary-color);
  background-color: black;
  width: 500px;
  height: 600px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--primary-color-shadowy);
}

.drop-block {
  width: 100%;
  height: 300px;
}

.upload-block {
  width: 100%;
  height: 300px;
  display: flex;
  flex-flow: column;
  justify-content: start;
  align-items: center;
}

.upload-block-content {
  display: flex;
  align-items: center;
  height: 40%;
}

.close-btn-block {
  position: absolute;
  top: -10px;
  right: -10px;
  z-index: 1;
}

.close-btn {
  color: var(--primary-color);
  background-color: var(--gray-color);
  border: 1px solid var(--primary-color-shadowy);
}

.rounded {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
</style>

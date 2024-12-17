<template>
  <BaseModal ref="baseModalRef">
    <template #header>
      <div class="modal-header">
        <div class="close-btn-block">
          <BaseButton tag="button" class="close-btn rounded">
            <Close style="color: white;" @click="baseModalRef?.closeModal()"></Close>
          </BaseButton>
        </div>
      </div>
    </template>
    <template #body>
      <div class="modal-body">
        <div class="drop-block">
          <DropZone :data-types="isImage" @file-upload="fileUploadHandler">
            Drop images here...
          </DropZone>
        </div>
        <div class="upload-block">
          <div class="upload-block-content">
            or
          </div>
          <FileUploadButton :data-types="isImage" @file-upload="fileUploadHandler">
            Choose Photo
          </FileUploadButton>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import BaseModal from './BaseModal.vue'
import FileUploadButton from '@/components/button/FileUploadButton.vue'
import BaseButton from '@/components/button/BaseButton.vue'
import DropZone from '@/components/file/DropZone.vue'
import Close from '@/components/svg/Close.vue'
import { isImage } from '@/utils/others/methods'

// template ref //
const baseModalRef = useTemplateRef('baseModalRef')

// emit //
// 檔案上傳事件
const emit = defineEmits<{
  (e: 'file-upload', file: File): void
}>()

// methods //
const fileUploadHandler = (file: File) => {
  emit('file-upload', file)
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
  color: var(--primary-color);
  background-color: black;
  width: 600px;
  height: 600px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #1e1e1e;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.75);
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
  background-color: rgb(60, 60, 60);
  border: 1px solid #1e1e1e;
}

.rounded {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
</style>

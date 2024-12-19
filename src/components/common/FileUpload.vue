<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'upload', file: File): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)

const handleClick = () => {
  fileInput.value?.click()
}

const handleChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files?.length) {
    emit('upload', input.files[0])
    input.value = '' // Reset input
  }
}
</script>

<template>
  <div class="file-upload">
    <input
      ref="fileInput"
      type="file"
      class="hidden-input"
      @change="handleChange"
    />
    <button 
      type="button" 
      class="upload-button" 
      @click="handleClick"
      title="Upload file"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.file-upload {
  position: relative;
}

.hidden-input {
  display: none;
}

.upload-button {
  height: 40px;
  width: 40px;
  background-color: rgba(245, 222, 179, 0.2);
  color: var(--primary-color);
  border: 1px solid rgba(245, 222, 179, 0.4);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-button:hover {
  background-color: rgba(249, 189, 77, 0.3);
  border-color: var(--primary-active-color);
}

.upload-button svg {
  transition: transform 0.2s ease;
}

.upload-button:hover svg {
  transform: translateY(-2px);
}
</style>
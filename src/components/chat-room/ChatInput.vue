<template>
  <div class="chat-input">
    <UploadButton :data-types="isImage" @upload="handleFileUpload" />
    <textarea
      ref="textarea"
      v-model="newMessage"
      placeholder="問我酷問題..."
      @keydown="handleKeydown"
      rows="1"
      class="message-input"
    />
    <button @click="sendMessage" :disabled="!newMessage.trim()" class="send-button">
      <SendIcon />
    </button>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, useTemplateRef, watch } from 'vue'
import { isImage } from '../../utils/misc/file'
import UploadButton from '../button/UploadButton.vue'
import SendIcon from '../lordicon/SendIcon.vue'

const emit = defineEmits<{
  (e: 'send', message: string): void
  (e: 'upload', file: File): void
}>()

const newMessage = ref('')
const textarea = useTemplateRef<HTMLTextAreaElement>('textarea')

const adjustTextareaHeight = async () => {
  await nextTick()
  if (textarea.value) {
    // Reset height to auto first to get the correct scrollHeight
    textarea.value.style.height = 'auto'

    // Get the scroll height and set the new height
    const scrollHeight = textarea.value.scrollHeight
    const newHeight = newMessage.value.trim()
      ? `${Math.min(Math.max(scrollHeight, 40), 150)}px`
      : '40px'

    textarea.value.style.height = newHeight
  }
}

// Watch for changes in the message content
watch(newMessage, () => {
  adjustTextareaHeight()
})

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    if (e.shiftKey) {
      // Allow default behavior for Shift + Enter (new line)
      return
    }
    e.preventDefault()
    sendMessage()
  }
}

const sendMessage = () => {
  if (newMessage.value.trim()) {
    emit('send', newMessage.value)
    newMessage.value = ''
    // Reset textarea height after sending
    if (textarea.value) {
      textarea.value.style.height = '40px'
    }
  }
}

const handleFileUpload = (file: File) => {
  emit('upload', file)
}
</script>

<style scoped>
.chat-input {
  display: flex;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  background-color: var(--secondary-color);
  border-top: 1px solid var(--primary-color-brighter);
  align-items: flex-start;
}

.message-input {
  font-family: inherit;
  font-size: 1.2em;
  font-weight: 300;
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--primary-color);
  background-color: var(--input-unfocused);
  border: 1px solid var(--primary-color-bright);
  border-radius: var(--border-radius-sm);
  resize: none;
  min-height: 46px;
  max-height: 150px;
  overflow-y: auto;
  vertical-align: bottom;
  transition:
    height 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.message-input::placeholder {
  color: var(--primary-color-brighter);
}

.message-input:focus {
  outline: none;
  background-color: var(--input-focused);
  border-color: var(--primary-active-color);
}

.send-button {
  font-family: inherit;
  height: 45px;
  padding: 0 var(--spacing-lg);
  color: var(--primary-color);
  background-color: var(--primary-color-dim);
  border: 1px solid var(--primary-color-bright);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-button:disabled {
  color: var(--primary-color-bright);
  border-color: var(--primary-color-dim);
  background-color: var(--primary-color-shadowy);
  cursor: not-allowed;
}

.send-button:hover:not(:disabled) {
  border-color: var(--primary-active-color);
  background-color: var(--primary-active-color-bright);
}
</style>

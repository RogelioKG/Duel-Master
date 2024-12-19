<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import FileUpload from '../common/FileUpload.vue'

const emit = defineEmits<{
  (e: 'send', message: string): void
  (e: 'upload', file: File): void
}>()

const newMessage = ref('')
const textarea = ref<HTMLTextAreaElement | null>(null)

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
    e.preventDefault() // Prevent default Enter behavior
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

<template>
  <div class="chat-input">
    <FileUpload @upload="handleFileUpload" />
    <textarea
      ref="textarea"
      v-model="newMessage"
      placeholder="Type a message... (Shift + Enter for new line)"
      @keydown="handleKeydown"
      rows="1"
      class="message-input"
    />
    <button @click="sendMessage" :disabled="!newMessage.trim()" class="send-button">
      Send
    </button>
  </div>
</template>

<style scoped>
.chat-input {
  display: flex;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  background-color: rgba(255, 255, 255, 0.1);
  border-top: 1px solid rgba(245, 222, 179, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  align-items: flex-start;
}

.message-input {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid rgba(245, 222, 179, 0.4);
  border-radius: var(--border-radius-sm);
  font-size: 1em;
  background-color: rgba(255, 255, 255, 0.15);
  color: var(--primary-color);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  resize: none;
  min-height: 40px;
  max-height: 150px;
  line-height: 1.4;
  font-family: inherit;
  overflow-y: hidden;
  transition: height 0.2s ease;
}

.message-input::placeholder {
  color: rgba(245, 222, 179, 0.6);
}

.message-input:focus {
  outline: none;
  border-color: var(--primary-active-color);
  background-color: rgba(255, 255, 255, 0.2);
}

.send-button {
  height: 40px;
  padding: 0 var(--spacing-lg);
  background-color: rgba(245, 222, 179, 0.2);
  color: var(--primary-color);
  border: 1px solid rgba(245, 222, 179, 0.4);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-button:disabled {
  background-color: rgba(245, 222, 179, 0.1);
  border-color: rgba(245, 222, 179, 0.2);
  color: rgba(245, 222, 179, 0.4);
  cursor: not-allowed;
}

.send-button:hover:not(:disabled) {
  background-color: rgba(249, 189, 77, 0.3);
  border-color: var(--primary-active-color);
}
</style>
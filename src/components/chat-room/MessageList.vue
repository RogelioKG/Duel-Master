<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import type { Message } from '../../types'
import ChatMessage from './Message.vue'

const props = defineProps<{
  messages: Message[]
}>()

const messagesContainer = ref<HTMLDivElement | null>(null)

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Watch for changes in messages array
watch(() => props.messages, () => {
  scrollToBottom()
}, { deep: true })

// Initial scroll when component is mounted
scrollToBottom()
</script>

<template>
  <div class="messages-container" ref="messagesContainer">
    <ChatMessage
      v-for="message in messages"
      :key="message.id"
      :message="message"
    />
  </div>
</template>

<style scoped>
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-lg);
  background-color: transparent;
  scroll-behavior: smooth;
}

/* Webkit (Chrome, Safari, Edge) scrollbar styles */
.messages-container::-webkit-scrollbar {
  width: 8px;
  background: transparent;
}

.messages-container::-webkit-scrollbar-track {
  background: rgba(245, 222, 179, 0.05);
  border-radius: 4px;
}

.messages-container::-webkit-scrollbar-thumb {
  background: rgba(245, 222, 179, 0.2);
  border-radius: 4px;
  border: 2px solid transparent;
  background-clip: padding-box;
  transition: background-color 0.2s ease;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: rgba(245, 222, 179, 0.3);
  border: 2px solid transparent;
  background-clip: padding-box;
}

/* Firefox scrollbar styles */
.messages-container {
  scrollbar-width: thin;
  scrollbar-color: rgba(245, 222, 179, 0.2) rgba(245, 222, 179, 0.05);
}

/* When scrolling */
.messages-container:active::-webkit-scrollbar-thumb {
  background: rgba(245, 222, 179, 0.4);
}
</style>
<template>
  <div class="messages-wrapper" ref="messagesContainer">
    <div class="messages-container">
      <ChatMessage v-for="message in messages" :key="message.id" :message="message" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAutoScroll } from '../../composables/effects/useAutoScroll'
import type { Message } from '../../types'
import ChatMessage from './ChatMessage.vue'

// props //
const props = defineProps<{
  messages: Message[]
}>()

// refs //
const messagesContainer = ref<HTMLDivElement | null>(null)

// composables //
const { setupAutoScroll } = useAutoScroll(messagesContainer)

// init //
setupAutoScroll(() => props.messages)
</script>

<style scoped lang="css">
.messages-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  flex: 1;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.messages-container {
  width: 100%;
  max-width: 900px;
  height: max-content;
  padding: var(--spacing-lg);
  background-color: transparent;
}
</style>

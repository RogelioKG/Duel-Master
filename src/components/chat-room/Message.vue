<script setup lang="ts">
import type { Message } from '../../types'
import Avatar from '../common/Avatar.vue'
import { formatTime } from '../../utils/chat-room/date'

defineProps<{
  message: Message
}>()
</script>

<template>
  <div class="message" :class="{ 'message-own': message.sender === 'You' }">
    <Avatar v-if="message.sender !== 'You'" :name="message.sender" :src="message.avatar" size="md"
      class="message-avatar" />
    <div class="message-content">
      <div class="message-header">
        <span class="sender">{{ message.sender }}</span>
        <span class="timestamp">{{ formatTime(message.timestamp) }}</span>
      </div>
      <p class="message-text" v-html="message.text.replace(/\n/g, '<br>')"></p>
      <div v-if="message.file" class="file-info">
        <img v-if="message.file.isImage" :src="message.file.url" :alt="message.file.name" class="message-image"
          @click="window.open(message.file.url, '_blank')" />
        <a v-else :href="message.file.url" target="_blank" class="file-link">
          {{ message.file.name }}
        </a>
      </div>
    </div>
    <Avatar v-if="message.sender === 'You'" :name="message.sender" :src="message.avatar" size="md"
      class="message-avatar" />
  </div>
</template>

<style scoped>
.message {
  margin: var(--spacing-sm);
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  animation: message-appear 0.3s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes message-appear {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-content {
  background-color: rgba(255, 255, 255, 0.15);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  max-width: 70%;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(245, 222, 179, 0.6);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.message-content:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.message-own {
  justify-content: flex-end;
}

.message-own .message-content {
  background-color: rgba(245, 222, 179, 0.2);
  border-color: rgba(249, 189, 77, 0.6);
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-xs);
  font-size: 0.8em;
}

.sender {
  font-weight: bold;
  color: var(--primary-color);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.timestamp {
  color: rgba(245, 222, 179, 0.8);
  margin-left: var(--spacing-sm);
}

.message-text {
  margin: 0;
  word-wrap: break-word;
  color: var(--primary-color);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  line-height: 1.5;
}

.message-avatar {
  margin-top: var(--spacing-xs);
  animation: avatar-appear 0.3s ease-out forwards;
  opacity: 0;
  transform: scale(0.8);
}

@keyframes avatar-appear {
  from {
    opacity: 0;
    transform: scale(0.8);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.file-info {
  margin-top: var(--spacing-sm);
  padding-top: var(--spacing-sm);
  border-top: 1px solid rgba(245, 222, 179, 0.3);
}

.message-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.message-image:hover {
  transform: scale(1.02);
}

.file-link {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 0.9em;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.file-link:hover {
  opacity: 1;
  text-decoration: underline;
}
</style>

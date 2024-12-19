<script setup lang="ts">
import { ref } from 'vue'
import type { Conversation } from '../../types'
import { formatTime } from '../../utils/chat-room/date'

const props = defineProps<{
  conversations: Conversation[]
  currentConversation: Conversation
}>()

const emit = defineEmits<{
  (e: 'select', conversationId: string): void
  (e: 'new'): void
}>()

const isOpen = ref(false)

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const getPreviewText = (conversation: Conversation) => {
  const lastMessage = conversation.messages[conversation.messages.length - 1]
  return lastMessage ? lastMessage.text : 'No messages'
}
</script>

<template>
  <div class="sidebar-wrapper">
    <button v-show="!isOpen" class="open-button" @click="toggleSidebar" aria-label="Open chat history">
      <div class="hamburger-icon">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </button>

    <div class="sidebar-container" :class="{ open: isOpen }">
      <div class="sidebar-header">
        <h2>Chat History</h2>
        <div class="header-actions">
          <button class="new-chat-button" @click="emit('new')" aria-label="New chat">
            <span class="plus-icon"></span>
          </button>
          <button class="close-button" @click="toggleSidebar" aria-label="Close chat history">
            <span class="close-icon"></span>
          </button>
        </div>
      </div>

      <div class="sidebar-content">
        <div class="history-list">
          <div v-for="(conversation, index) in conversations" :key="conversation.id" class="history-item" :class="{
            active: currentConversation.id === conversation.id,
            'slide-in': isOpen
          }" :style="{
              '--delay': `${index * 0.05}s`,
              '--distance': `${(index + 1) * 10}px`
            }" @click="emit('select', conversation.id)">
            <div class="history-item-header">
              <span class="history-title">{{ conversation.title }}</span>
              <span class="history-time">{{ formatTime(conversation.timestamp) }}</span>
            </div>
            <p class="history-preview">{{ getPreviewText(conversation) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 1000;
}

.open-button {
  position: fixed;
  left: 20px;
  top: 20px;
  background: rgba(245, 222, 179, 0.15);
  border: 1px solid rgba(245, 222, 179, 0.4);
  border-radius: var(--border-radius-sm);
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(0);
  opacity: 1;
}

.open-button:hover {
  background: rgba(245, 222, 179, 0.25);
  transform: translateX(5px);
}

.hamburger-icon {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
}

.hamburger-icon span {
  display: block;
  width: 16px;
  height: 2px;
  background-color: var(--primary-color);
  transition: transform 0.3s ease;
}

.open-button:hover .hamburger-icon span {
  background-color: var(--primary-active-color);
}

.open-button:hover .hamburger-icon span:first-child {
  transform: translateY(1px);
}

.open-button:hover .hamburger-icon span:last-child {
  transform: translateY(-1px);
}

.sidebar-container {
  position: fixed;
  top: 0;
  left: -300px;
  height: 100vh;
  width: 300px;
  background-color: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-right: 1px solid rgba(245, 222, 179, 0.2);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
}

.sidebar-container.open {
  transform: translateX(300px);
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  border-bottom: 1px solid rgba(245, 222, 179, 0.2);
  background: rgba(245, 222, 179, 0.05);
}

.header-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.sidebar-header h2 {
  color: var(--primary-color);
  margin: 0;
  font-size: 1.2em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transform: translateY(-10px);
  animation: slide-down 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  animation-delay: 0.1s;
}

@keyframes slide-down {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.new-chat-button,
.close-button {
  background: transparent;
  border: none;
  width: 32px;
  height: 32px;
  cursor: pointer;
  position: relative;
  opacity: 0;
  transform: scale(0.8);
  animation: pop-in 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.new-chat-button {
  animation-delay: 0.2s;
}

.close-button {
  animation-delay: 0.3s;
}

@keyframes pop-in {
  to {
    opacity: 0.8;
    transform: scale(1);
  }
}

.new-chat-button:hover,
.close-button:hover {
  opacity: 1;
}

.plus-icon::before,
.plus-icon::after {
  content: '';
  position: absolute;
  background-color: var(--primary-color);
}

.plus-icon::before {
  width: 16px;
  height: 2px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.plus-icon::after {
  width: 2px;
  height: 16px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.close-icon::before,
.close-icon::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 16px;
  height: 2px;
  background-color: var(--primary-color);
  transition: transform 0.3s ease;
}

.close-icon::before {
  transform: translate(-50%, -50%) rotate(45deg);
}

.close-icon::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.close-button:hover .close-icon::before {
  transform: translate(-50%, -50%) rotate(135deg);
}

.close-button:hover .close-icon::after {
  transform: translate(-50%, -50%) rotate(45deg);
}

.sidebar-content {
  padding: var(--spacing-lg);
  height: calc(100% - 70px);
  overflow-y: auto;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.history-item {
  padding: var(--spacing-md);
  background-color: rgba(245, 222, 179, 0.1);
  border-radius: var(--border-radius-md);
  border: 1px solid rgba(245, 222, 179, 0.2);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  transform: translateX(-20px);
}

.history-item.slide-in {
  animation: slide-in 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  animation-delay: var(--delay);
}

@keyframes slide-in {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }

  60% {
    transform: translateX(var(--distance));
  }

  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.history-item:hover {
  background-color: rgba(245, 222, 179, 0.15);
  transform: translateX(5px);
}

.history-item.active {
  background-color: rgba(245, 222, 179, 0.2);
  border-color: var(--primary-active-color);
}

.history-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xs);
}

.history-title {
  font-size: 0.9em;
  color: var(--primary-color);
  font-weight: bold;
}

.history-time {
  font-size: 0.7em;
  color: rgba(245, 222, 179, 0.6);
}

.history-preview {
  color: rgba(245, 222, 179, 0.8);
  font-size: 0.8em;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Scrollbar styles */
.sidebar-content::-webkit-scrollbar {
  width: 6px;
  background: transparent;
}

.sidebar-content::-webkit-scrollbar-track {
  background: rgba(245, 222, 179, 0.05);
}

.sidebar-content::-webkit-scrollbar-thumb {
  background: rgba(245, 222, 179, 0.2);
  border-radius: 3px;
}

.sidebar-content::-webkit-scrollbar-thumb:hover {
  background: rgba(245, 222, 179, 0.3);
}
</style>

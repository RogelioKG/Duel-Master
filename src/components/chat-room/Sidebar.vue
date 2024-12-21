<template>
  <div class="sidebar-wrapper">
    <button
      v-show="!isOpen"
      class="open-button"
      @click="toggleSidebar"
      aria-label="Open chat history"
    >
      <MenuIcon />
    </button>
    <div class="sidebar-container" :class="{ open: isOpen }" ref="sidebarRef">
      <SidebarHeader @new="emit('new')" @close="toggleSidebar" />
      <div class="sidebar-content">
        <div class="history-list">
          <SidebarItem
            v-for="(conversation, index) in conversations"
            :key="conversation.id"
            :conversation="conversation"
            :is-active="currentConversation.id === conversation.id"
            :is-open="isOpen"
            :index="index"
            @select="emit('select', conversation.id)"
            @delete="emit('delete', conversation.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { ref, useTemplateRef } from 'vue'
import type { Conversation } from '../../types'
import MenuIcon from '../lordicon/MenuIcon.vue'
import SidebarHeader from './SidebarHeader.vue'
import SidebarItem from './SidebarItem.vue'

// props //
defineProps<{
  conversations: Conversation[]
  currentConversation: Conversation
}>()

// emit //
const emit = defineEmits<{
  (e: 'select', id: string): void
  (e: 'new'): void
  (e: 'delete', id: string): void
}>()

// ref //
const sidebarRef = useTemplateRef('sidebarRef')

// composables //
// 點到 sidebar 以外的地方，則關閉 sidebar
onClickOutside(sidebarRef, () => {
  if (isOpen.value) {
    isOpen.value = false
  }
})

// ref //
const isOpen = ref(false)

// methods //
const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}
</script>

<style scoped lang="css">
.sidebar-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 10000;
}

.open-button {
  position: absolute;
  top: 18px;
  left: 15px;
  width: 40px;
  height: 40px;
  background: var(--primary-color-shadowy);
  border: 1px solid var(--primary-color-bright);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);
}

.open-button:hover {
  background: var(--primary-color-dim);
}

.sidebar-container {
  position: fixed;
  top: 0;
  left: -300px;
  width: 300px;
  height: 100vh;
  background: var(--gray-color);
  backdrop-filter: blur(50px);
  border-right: 1px solid var(--primary-color-dim);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
}

.sidebar-container.open {
  transform: translateX(300px);
}

.sidebar-content {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  padding: var(--spacing-md);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}
</style>

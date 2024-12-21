<template>
  <div class="sidebar-header">
    <h2>Chat History</h2>
    <div class="header-actions">
      <button class="new-chat-button" @click="emit('new')" aria-label="New chat">
        <PlusIcon style="color: var(--primary-color)" />
      </button>
      <button class="close-button" @click="emit('close')" aria-label="Close chat history">
        <ChevronLeftIcon style="color: var(--primary-color)" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import PlusIcon from '../icon/AddIcon.vue'
import ChevronLeftIcon from '../icon/ChevronLeftIcon.vue'

// emit //
const emit = defineEmits<{
  (e: 'new'): void
  (e: 'close'): void
}>()
</script>

<style scoped lang="css">
.sidebar-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--primary-color-dim);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-header h2 {
  font-family: 'Matrix II Bold', sans-serif;
  font-size: 1.3em;
  margin: 0;
  color: var(--primary-color);
}

.header-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.new-chat-button,
.close-button {
  width: 32px;
  height: 32px;
  background: transparent;
  border: 1px solid var(--primary-color-bright);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.new-chat-button:hover,
.close-button:hover {
  background: rgba(245, 222, 179, 0.1);
}
</style>

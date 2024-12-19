<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  title: string;
}>();

const emit = defineEmits<{
  (e: 'update:title', value: string): void;
}>();

const isEditing = ref(false);
const editableTitle = ref(props.title);

const startEditing = () => {
  editableTitle.value = props.title;
  isEditing.value = true;
};

const saveTitle = () => {
  if (editableTitle.value.trim()) {
    emit('update:title', editableTitle.value.trim());
  } else {
    editableTitle.value = props.title;
  }
  isEditing.value = false;
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    saveTitle();
  } else if (e.key === 'Escape') {
    isEditing.value = false;
    editableTitle.value = props.title;
  }
};
</script>

<template>
  <div class="chat-header">
    <div v-if="isEditing" class="title-edit">
      <input
        v-model="editableTitle"
        type="text"
        @blur="saveTitle"
        @keydown="handleKeydown"
        ref="titleInput"
        class="title-input"
        placeholder="Enter chat title"
        maxlength="50"
        autofocus
      />
    </div>
    <h1 v-else @click="startEditing" class="title-display">
      {{ title }}
      <span class="edit-icon">✎</span>
    </h1>
  </div>
</template>

<style scoped>
.chat-header {
  padding: var(--spacing-lg);
  background-color: rgba(245, 222, 179, 0.15);
  color: var(--primary-color);
  text-align: center;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-bottom: 2px solid var(--primary-active-color);
}

.title-display {
  margin: 0;
  font-size: 1.5em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.edit-icon {
  font-size: 0.7em;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.title-display:hover .edit-icon {
  opacity: 0.7;
}

.title-edit {
  display: flex;
  justify-content: center;
  align-items: center;
}

.title-input {
  background-color: rgba(255, 255, 255, 0.15);
  border: 1px solid var(--primary-active-color);
  border-radius: var(--border-radius-sm);
  color: var(--primary-color);
  font-size: 1.5em;
  padding: var(--spacing-sm) var(--spacing-md);
  text-align: center;
  width: 80%;
  max-width: 400px;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.title-input:focus {
  outline: none;
  background-color: rgba(255, 255, 255, 0.2);
}

.title-input::placeholder {
  color: rgba(245, 222, 179, 0.6);
}
</style>
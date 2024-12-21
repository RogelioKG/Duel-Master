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
      <span class="edit-icon">
        <PenIcon />
      </span>
    </h1>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PenIcon from '../lordicon/PenIcon.vue'

// props //
const props = defineProps<{
  title: string
}>()

// emit //
const emit = defineEmits<{
  (e: 'update:title', value: string): void
}>()

// ref //
const isEditing = ref(false)
const editableTitle = ref(props.title)

// methods //
const startEditing = () => {
  editableTitle.value = props.title
  isEditing.value = true
}

const saveTitle = () => {
  if (editableTitle.value.trim()) {
    emit('update:title', editableTitle.value.trim())
  } else {
    editableTitle.value = props.title
  }
  isEditing.value = false
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    saveTitle()
  } else if (e.key === 'Escape') {
    isEditing.value = false
    editableTitle.value = props.title
  }
}
</script>

<style scoped lang="css">
@import url('../../styles/css/breathing.css');

.chat-header {
  font-family: 'Matrix II Bold', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-lg);
  background-color: var(--secondary-color);
  color: var(--primary-color);
  border-bottom: 2px solid var(--primary-active-color);
  animation: breathing-border 3s ease-in-out infinite;
}

.title-display {
  position: relative;
  margin: 0;
  font-size: 1.5em;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-xs);
}

.edit-icon {
  position: absolute;
  right: -2em;
  font-size: 0.7em;
  opacity: 0;
  transition: opacity 0.2s ease;
  display: inline-flex;
}

.title-display:hover .edit-icon {
  opacity: 0.7;
}

.title-edit {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  max-width: 300px;
}

.title-input {
  font-family: inherit;
  background-color: var(--input-unfocused);
  border: 1px solid var(--primary-color);
  border-radius: var(--border-radius-sm);
  color: var(--primary-color);
  font-size: 1.5em;
  padding: 7px var(--spacing-md);
  text-align: center;
  width: 100%;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.title-input:focus {
  outline: none;
  border-color: var(--primary-active-color);
  background-color: var(--input-focused);
}

.title-input::placeholder {
  color: var(--placeholder-color);
}
</style>

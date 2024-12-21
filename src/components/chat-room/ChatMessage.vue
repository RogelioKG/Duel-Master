<template>
  <div class="message" :class="{ 'message-own': message.sender === 'You' }">
    <Avatar
      v-if="message.sender !== 'You'"
      :name="message.sender"
      :src="message.avatar"
      size="md"
      class="message-avatar"
    />
    <div class="message-content">
      <div class="message-header">
        <span class="sender">{{ message.sender }}</span>
        <span class="timestamp">{{ formatTime(message.timestamp) }}</span>
      </div>
      <p class="message-text" v-html="sanitizedMessageText"></p>
      <div v-if="message.block?.kind === 'file'" class="block-info">
        <img
          v-if="message.block.data.isImage"
          :src="message.block.data.url"
          :alt="message.block.data.name"
          class="message-image"
        />
        <a v-else :href="message.block.data.url" target="_blank" class="file-link">
          {{ message.block.data.name }}
        </a>
      </div>
      <div v-else-if="message.block?.kind === 'card'" class="block-info">
        <CanvasCard
          ref="canvasCardRef"
          :front-card-data="message.block.data.frontCardData"
          :back-card-data="message.block.data.backCardData"
          :is-tilt="true"
          @click="showCard"
        />
      </div>
    </div>
    <Avatar
      v-if="message.sender === 'You'"
      :name="message.sender"
      :src="message.avatar"
      size="md"
      class="message-avatar"
    />
  </div>
  <Teleport to="body">
    <CardModal
      v-if="message.block?.kind === 'card'"
      ref="cardModalRef"
      :card-info="message.block?.data"
      :max-size="LARGE_CARD_BP.maxSize"
      :breakpoint-map="LARGE_CARD_BP.breakpointMap"
    >
    </CardModal>
  </Teleport>
</template>

<script setup lang="ts">
import DOMPurify from 'dompurify'
import { computed, onMounted, useTemplateRef } from 'vue'
import { useResponsiveCard } from '../../composables/canvas-card/useResponsiveCard'
import { LARGE_CARD_BP, SMALL_CARD_BP } from '../../config'
import type { Message } from '../../types'
import { formatTime } from '../../utils/misc/date'
import CanvasCard from '../canvas-card/CanvasCard.vue'
import Avatar from '../misc/Avatar.vue'
import CardModal from '../modal/CardModal.vue'

// props //
const props = defineProps<{
  message: Message
}>()

// template ref //
const canvasCardRef = useTemplateRef('canvasCardRef')
const cardModalRef = useTemplateRef('cardModalRef')

// computed //
// 防止 XSS 攻擊
const sanitizedMessageText = computed(() => {
  return DOMPurify.sanitize(props.message.text.replace(/\n/g, '<br>'))
})

// composables //
const { initResponsive } = useResponsiveCard(
  canvasCardRef,
  SMALL_CARD_BP.breakpointMap,
  SMALL_CARD_BP.maxSize,
)

// methods //
const showCard = async () => {
  await cardModalRef.value?.showModal()
  cardModalRef.value?.flipCard('front')
}

// life cycle //
onMounted(() => {
  if (canvasCardRef.value) {
    canvasCardRef.value?.setSize(SMALL_CARD_BP.maxSize)
    initResponsive()
    canvasCardRef.value?.flip('front')
    canvasCardRef.value?.enableClickFlip(false)
  }
  cardModalRef.value?.resultObtained()
})
</script>

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
  max-width: 60%;
  backdrop-filter: blur(1px);
  border: 1px solid var(--primary-color-brighter);
}

.message-own {
  justify-content: flex-end;
}

.message-own .message-content {
  background-color: var(--primary-color-dim);
  border-color: var(--primary-active-color-brighter);
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: var(--spacing-xs);
}

.sender {
  font-size: 1.1em;
  font-weight: bold;
  color: var(--primary-color);
}

.timestamp {
  font-size: 0.8em;
  color: var(--primary-color-bright);
  margin-left: var(--spacing-sm);
}

.message-text {
  font-size: 1.1em;
  font-weight: 300;
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

.block-info {
  margin-top: var(--spacing-sm);
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--primary-color-dim);
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

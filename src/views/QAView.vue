<template>
  <main>
    <div class="jagged-bg"></div>
    <div class="qa">
      <div class="chatroom">
        <Message v-for="(message, index) in messages" :key="index" :userImage="message.avatar" :userName="message.name"
          :userType="message.isLocal ? 'local' : 'remote'">
          {{ message.text }}
        </Message>
        <Message userType="local" userName="Junko Yagami" userImage="https://picsum.photos/200/200/?random=20">
          <CanvasCard ref="cardRef" :front-card-data="frontCardData" :back-card-data="backCardData" :is-tilt="true">
          </CanvasCard>
        </Message>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import Message from '@/components/chat/Message.vue'
import CanvasCard from '@/components/canvas-card/CanvasCard.vue'
import { createFrontCardData, createBackCardData } from '@/utils/canvas-card/cardCreation'
import yugiohExample from '@/assets/example/yugioh'
import yugiohBackExample from '@/assets/example/yugiohBack'

const cardRef = useTemplateRef('cardRef')
const frontCardData = createFrontCardData(yugiohExample, { width: 200 })
const backCardData = createBackCardData(yugiohBackExample, { width: 200 })

interface Message {
  avatar: string;
  name: string;
  text: string;
  isLocal: boolean;
}

// constants //
const msgs = [
  {
    avatar: 'https://picsum.photos/200/200/?random=20',
    name: 'Junko Yagami',
    text: 'あなたは　ムーンライト',
    isLocal: true,
  },
  {
    avatar: 'https://picsum.photos/200/200/?random=10',
    name: 'Backup Singer',
    text: '指輪だけじゃ足りないもの',
    isLocal: false,
  },
  {
    avatar: 'https://picsum.photos/200/200/?random=20',
    name: 'Junko Yagami',
    text: 'シャイブライト',
    isLocal: true,
  },
  {
    avatar: 'https://picsum.photos/200/200/?random=10',
    name: 'Backup Singer',
    text: 'あなたならば知ってること',
    isLocal: false,
  },
  {
    avatar: 'https://picsum.photos/200/200/?random=20',
    name: 'Junko Yagami',
    text: '目立つひとじゃないけど',
    isLocal: true,
  },
]

// ref //
const messages = ref<Message[]>(msgs)

// setInterval(() => {
//   messages.value.push(msgs[0])
// }, 3700)

// setInterval(() => {
//   messages.value.push(msgs[1])
// }, 4300)
</script>

<style scoped lang="css">
@import url("../assets/css/jagged-bg.css");

.qa {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chatroom {
  height: 80%;
  width: 90%;
  padding: 20px;
  max-width: 1000px;
  margin-top: 50px;
  box-shadow: 0 0 10px var(--primary-color);
  border: 1px solid var(--primary-color);
  border-radius: 5px;
  background-color: #f5deb310;
  color: #ccc;
  overflow-y: auto;
}

.chatroom::-webkit-scrollbar {
  width: 5px;
  /* 鉛直粗度 */
  height: 5px;
  /* 水平粗度 */
}

.chatroom::-webkit-scrollbar-track {
  background-color: transparent;
  border-radius: 10px;
}

.chatroom::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: var(--primary-color);
}
</style>

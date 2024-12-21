<template>
  <div class="chat-container">
    <ChatSidebar
      :conversations="conversations"
      :currentConversation="currentConversation"
      @select="selectConversation"
      @new="createNewConversation"
      @delete="deleteConversation"
    />
    <div class="chat-main">
      <ChatHeader :title="currentConversation.title" @update:title="updateConversationTitle" />
      <ChatMessageList :messages="currentConversation.messages" />
      <ChatInput @send="handleMessageSend" @upload="handleFileUpload" />
    </div>
  </div>
  <Teleport to="body">
    <CardModal
      ref="cardModalRef"
      :card-info="cardInfo"
      :max-size="LARGE_CARD_BP.maxSize"
      :breakpoint-map="LARGE_CARD_BP.breakpointMap"
    >
    </CardModal>
  </Teleport>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { questionAPI } from '../../api/question'
import { translateAPI } from '../../api/translation'
import { useConversation } from '../../composables/chat-room/useConversation'
import { LARGE_CARD_BP } from '../../config'
import YugiohCard from '../../example/yugioh'
import YugiohBackCard from '../../example/yugiohBack'
import {
  createCardMessage,
  createFileMessage,
  createSimpleMessage,
} from '../../utils/chat-room/createMessage'
import { sleep } from '../../utils/misc/methods'
import CardModal from '../modal/CardModal.vue'
import ChatHeader from './ChatHeader.vue'
import ChatInput from './ChatInput.vue'
import ChatMessageList from './ChatMessageList.vue'
import ChatSidebar from './Sidebar.vue'

// variables //
const cardInfo = { frontCardData: YugiohCard, backCardData: YugiohBackCard }

// template ref //
const cardModalRef = useTemplateRef('cardModalRef')

// composables //
const {
  conversations,
  currentConversation,
  createNewConversation,
  selectConversation,
  deleteConversation,
  updateConversationTitle,
} = useConversation()

// 問答模式 //
const handleMessageSend = async (text: string) => {
  // Your message
  const userMessage = createSimpleMessage('You', text)
  currentConversation.value.messages.push(userMessage)

  // System message
  await sleep(500)
  const { data } = await questionAPI(text)
  if (data.success) {
    const systemMessage = createSimpleMessage('System', data.answer)
    currentConversation.value.messages.push(systemMessage)
  }
}

// 翻譯模式 //
const handleFileUpload = async (file: File) => {
  // Your message
  const fileMessage = await createFileMessage('You', file, '可以幫我翻譯這張卡片嗎🥺？')
  currentConversation.value.messages.push(fileMessage)

  // System message
  const translatePromise = translateAPI(file)
  await sleep(500)
  const systemMessage = createSimpleMessage('System', '好的，沒有問題🫡')
  currentConversation.value.messages.push(systemMessage)
  await sleep(500)
  await cardModalRef.value?.showModal()
  await sleep(500)
  await cardModalRef.value?.cardLeaving()
  cardModalRef.value?.setCardInfo({ frontCardData: { password: '14558127' } }) // ! 測試用
  const { data } = await translatePromise
  if (data.success) {
    cardModalRef.value?.setCardInfo({ frontCardData: data.frontCardData })
    cardModalRef.value?.resultObtained()
  }
  await cardModalRef.value?.cardEntering()
  if (data.success) {
    const card = cardModalRef.value?.getCardInfo()
    if (card) {
      const systemMessage = createCardMessage('System', card, '翻譯結果出爐辣🔥')
      currentConversation.value.messages.push(systemMessage)
    }
  }
}
</script>

<style scoped>
.chat-container {
  position: relative;
  height: 100%;
  width: 100%;
}

.chat-main {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0 auto;
  background-color: transparent;
  z-index: 1;
}
</style>

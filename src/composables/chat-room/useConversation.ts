import { ref } from 'vue'
import type { Conversation } from '../../types'
import { createSimpleMessage } from '../../utils/chat-room/createMessage'

export function useConversation() {
  const conversations = ref<Conversation[]>([
    {
      id: '1',
      title: 'Welcome Chat',
      timestamp: new Date(),
      messages: [createSimpleMessage('System', '嗨，今天想要問點啥？')],
    },
  ])

  const currentConversation = ref<Conversation>(conversations.value[0])

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: `Chat ${conversations.value.length + 1}`,
      timestamp: new Date(),
      messages: [],
    }
    conversations.value.unshift(newConversation)
    currentConversation.value = newConversation
  }

  const deleteConversation = (id: string) => {
    const index = conversations.value.findIndex((c) => c.id === id)
    if (index !== -1) {
      conversations.value.splice(index, 1)
      // If we deleted the current conversation, switch to the first available one
      if (currentConversation.value.id === id) {
        if (conversations.value.length > 0) {
          currentConversation.value = conversations.value[0]
        } else {
          createNewConversation()
        }
      }
    }
  }

  const selectConversation = (id: string) => {
    const conversation = conversations.value.find((c) => c.id === id)
    if (conversation) {
      currentConversation.value = conversation
    }
  }

  const updateConversationTitle = (title: string) => {
    currentConversation.value.title = title
  }

  return {
    conversations,
    currentConversation,
    createNewConversation,
    deleteConversation,
    selectConversation,
    updateConversationTitle,
  }
}

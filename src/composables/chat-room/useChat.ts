import { ref } from 'vue'
import type { Conversation } from '../../types'
import { createMessage, createFileMessage } from '../../utils/chat-room/message'

export function useChat() {
  const conversations = ref<Conversation[]>([
    {
      id: '1',
      title: 'Welcome Chat',
      timestamp: new Date(),
      messages: [createMessage('Welcome to the chat room!', 'System')],
    },
  ])

  const currentConversation = ref<Conversation>(conversations.value[0])

  const addMessage = (text: string) => {
    // Add user message
    const userMessage = createMessage(text, 'You')
    currentConversation.value.messages.push(userMessage)

    // RogelioKG : 在這裡處理使用者輸入
    // Add system echo message
    setTimeout(() => {
      const systemMessage = createMessage(`You said: "${text}"`, 'System')
      currentConversation.value.messages.push(systemMessage)
    }, 500) // Add a small delay to make it feel more natural
  }

  const handleFileUpload = async (file: File) => {
    // Add file message
    const fileMessage = await createFileMessage(file)
    currentConversation.value.messages.push(fileMessage)

    // Add system acknowledgment
    setTimeout(() => {
      const systemMessage = createMessage(
        `You uploaded: ${file.name} (${formatFileSize(file.size)})`,
        'System',
      )
      currentConversation.value.messages.push(systemMessage)
    }, 500)
  }

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: `Chat ${conversations.value.length + 1}`,
      timestamp: new Date(),
      messages: [],
    }
    conversations.value.push(newConversation)
    currentConversation.value = newConversation
  }

  const selectConversation = (conversationId: string) => {
    const conversation = conversations.value.find((c) => c.id === conversationId)
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
    addMessage,
    handleFileUpload,
    createNewConversation,
    selectConversation,
    updateConversationTitle,
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

import { ref } from 'vue'
import type { Message } from '../../types'
import { AVATAR_URLS } from '../../constants/avatars'

export function useMessage() {
  const messages = ref<Message[]>([
    {
      id: '1',
      text: 'Welcome to the chat room!',
      sender: 'System',
      timestamp: new Date(),
      avatar: AVATAR_URLS.System,
    },
  ])

  const addMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'You',
      timestamp: new Date(),
      avatar: AVATAR_URLS.You,
    }
    messages.value.push(newMessage)
  }

  return {
    messages,
    addMessage,
  }
}

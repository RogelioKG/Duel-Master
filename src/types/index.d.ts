import CanvasCard from '@/components/canvas-card/CanvasCard.vue'

export type CanvasCardType = InstanceType<typeof CanvasCard>

export interface FileInfo {
  name: string
  size: number
  type: string
  url: string
  isImage?: boolean
}

export interface Message {
  id: string
  text: string
  sender: string
  timestamp: Date
  avatar?: string
  file?: FileInfo
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  timestamp: Date
}

export interface User {
  id: string
  name: string
  avatar: string
}

export type AvatarSize = 'sm' | 'md' | 'lg'

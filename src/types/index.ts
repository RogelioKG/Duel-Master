import type { BackCardData, FrontCardData } from 'yugioh-card'
import CanvasCard from '../components/canvas-card/CanvasCard.vue'

// * API Response * //
export type TranslateAPIResponse =
  | { success: true; frontCardData: Partial<FrontCardData> }
  | { success: false; errMessage: string }

export type QuestionAPIResponse =
  | { success: true; answer: string }
  | { success: false; errMessage: string }

// * Other Types * //
export type CanvasCardType = InstanceType<typeof CanvasCard>

export type DataTypesChecker = string[] | ((types: readonly string[]) => boolean)

export type Dimension = { width: number; height?: never } | { height: number; width?: never }

export type Sender = 'System' | 'You'

export interface FileInfo {
  name: string
  size: number
  type: string
  url: string
  isImage?: boolean
}

export interface CardInfo {
  frontCardData: Partial<FrontCardData>
  backCardData: Partial<BackCardData>
}

export interface Message {
  id: string
  text: string
  sender: Sender
  timestamp: Date
  avatar?: string
  block?: { kind: 'file'; data: FileInfo } | { kind: 'card'; data: CardInfo }
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

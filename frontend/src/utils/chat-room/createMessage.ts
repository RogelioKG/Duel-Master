import type { CardInfo, Message, Sender } from '../../types'
import { AVATAR_URLS } from '../../config'
import { fileToBase64 } from '../misc/file'

export function createSimpleMessage(sender: Sender, text: string): Message {
  return {
    id: Date.now().toString(),
    text,
    sender,
    timestamp: new Date(),
    avatar: AVATAR_URLS[sender],
  }
}

export async function createFileMessage(
  sender: Sender,
  file: File,
  text: string,
): Promise<Message> {
  const isImage = file.type.startsWith('image/')
  return {
    id: Date.now().toString(),
    text,
    sender,
    timestamp: new Date(),
    avatar: AVATAR_URLS.You,
    block: {
      kind: 'file',
      data: {
        name: file.name,
        size: file.size,
        type: file.type,
        url: await fileToBase64(file), // * Base64 encoded image
        isImage,
      },
    },
  }
}

export function createCardMessage(sender: Sender, card: CardInfo, text: string): Message {
  return {
    id: Date.now().toString(),
    text,
    sender,
    timestamp: new Date(),
    avatar: AVATAR_URLS[sender],
    block: {
      kind: 'card',
      data: {
        frontCardData: card.frontCardData,
        backCardData: card.backCardData,
      },
    },
  }
}

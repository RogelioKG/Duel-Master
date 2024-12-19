import type { Message } from '../../types'
import { AVATAR_URLS } from '../../constants/avatars'

export function createMessage(text: string, sender: 'System' | 'You'): Message {
  return {
    id: Date.now().toString(),
    text,
    sender,
    timestamp: new Date(),
    avatar: AVATAR_URLS[sender],
  }
}

export async function createFileMessage(file: File): Promise<Message> {
  const isImage = file.type.startsWith('image/')
  const text = isImage
    ? `Uploaded image: ${file.name}`
    : `Uploaded file: ${file.name} (${formatFileSize(file.size)})`

  return {
    id: Date.now().toString(),
    text,
    sender: 'You',
    timestamp: new Date(),
    avatar: AVATAR_URLS.You,
    file: {
      name: file.name,
      size: file.size,
      type: file.type,
      url: await createObjectURL(file),
      isImage,
    },
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

function createObjectURL(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.readAsDataURL(file)
  })
}

import type { AxiosResponse } from 'axios'
import type { TranslateAPIResponse } from '../types'
import { yugiohAImodelAPI } from './getAxios'

export function translateAPI(uploadedFile: File): Promise<AxiosResponse<TranslateAPIResponse>> {
  const formData = new FormData()
  formData.append('image', uploadedFile)
  return yugiohAImodelAPI.post('/api/translate', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

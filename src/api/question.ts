import type { AxiosResponse } from 'axios'
import type { QuestionAPIResponse } from '../types'
import { yugiohAImodelAPI } from './getAxios'

export function questionAPI(text: string): Promise<AxiosResponse<QuestionAPIResponse>> {
  return yugiohAImodelAPI.post('/api/question', text, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}

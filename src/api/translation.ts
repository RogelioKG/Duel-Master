import type { AxiosResponse } from 'axios'
import type { FrontCardData } from 'yugioh-card'
import { yugiohAImodelAPI } from './getAxios'

type TranslateAPIResponse =
  | { success: true; frontCardData: Partial<FrontCardData> }
  | { success: false; errMessage: string }

export function translateAPI(uploadedFile: File): Promise<AxiosResponse<TranslateAPIResponse>> {
  const formData = new FormData()
  formData.append('...', uploadedFile) // formData 應該要送進 request
  return yugiohAImodelAPI.get('/translate')
}

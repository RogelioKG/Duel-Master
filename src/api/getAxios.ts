import axios from 'axios'
import { API } from '../config'

export const yugiohImageAPI = axios.create({
  baseURL: API.YUGIOH_IMAGE,
})

export const yugiohAImodelAPI = axios.create({
  baseURL: API.YUGIOH_AI_MODEL,
})

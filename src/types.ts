import CanvasCard from '@/components/canvas-card/CanvasCard.vue'

export type CanvasCardType = InstanceType<typeof CanvasCard>


export interface Message {
  avatar: string;
  name: string;
  text: string;
  isLocal: boolean;
}

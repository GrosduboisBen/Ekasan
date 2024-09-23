import type { I_File } from '@/stores/fileStore'

export interface I_Agent {
  name: string
  description: string
  instructions: string
  fileList?: I_File[]
  isDefault?: boolean
}

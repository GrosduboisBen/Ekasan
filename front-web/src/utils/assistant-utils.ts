export interface APIAssistant {
  id: string
  name: string
  description: string | null
  instructions: string
  store_id?: string
}

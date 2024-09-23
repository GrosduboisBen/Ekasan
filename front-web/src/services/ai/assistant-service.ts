import { aiApiClient } from '../utils'
import type { APIAssistant } from '@/utils/assistant-utils'

export function apiAssistantToTInterface(response: any): APIAssistant {
  return {
    id: response.id,
    name: response.name,
    description: response.description,
    instructions: response.instructions,
    store_id: response.tool_resources.file_search.vector_store_ids[0],
  } as APIAssistant
}

export class AssistantService {
  constructor() {}

  public getAllAssistant() {
    return aiApiClient.get('/get_all_assistant')
  }

  public getAssistantById(assistant_id: string) {
    return aiApiClient.get('get_assistant', { assistant_id })
  }

  public getVectorAssistants(vector_id: string) {
    return aiApiClient.get('get_vector_assistants', { vector_id })
  }

  public createAssistant(assistant: APIAssistant) {
    return aiApiClient.post('add_assistant/', {
      name: assistant.name,
      instructions: assistant.instructions,
      description: assistant.description,
      store_id: assistant.store_id,
    },
    undefined,
    true)
  }

  public updateAssistant(assistant: APIAssistant) {
    return aiApiClient.post('update_assistant/', {
      assistant_id: assistant.id,
      name: assistant.name,
      instructions: assistant.instructions,
      description: assistant.description,
      vector_id: assistant.store_id,
    },
    undefined,
    true)
  }
}

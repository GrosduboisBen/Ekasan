import { aiApiClient } from '../utils'

export class ChatService {
  constructor() {}

  public sendMessage(
    vector_id: string,
    assistant_id: string,
    instruction: string,
    message: string,

  ) {
    return aiApiClient.post('ask_assistant/', {
      store_id: vector_id,
      assistant_id,
      instruction,
      content: message,
    },
    undefined,
    undefined,
    true,
    )
  }
}

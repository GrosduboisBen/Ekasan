import { defineStore } from 'pinia'
import { uniqueId } from 'lodash'
import { ChatMessageEmitter, createEmptyMessage } from '@/utils/chatUtils'
import type { Chat, ChatContact, ChatMessage, QuoteModel } from '@/utils/chatUtils'
import { CHATBOT_ANSWER_PLACEHOLDER_ID, replaceObjectInArray } from '@/utils/constants'
import { ChatService } from '@/services/ai/chat-service'

// TODO: remove this models when these can be imported from the API client

const chatService = new ChatService()

export const useChatStore = defineStore('chat', {
  state: () => ({
    user: undefined as ChatContact | undefined,
    activeChat: undefined as Chat | undefined,
    botIsThinking: false,
    botIsAnswering: false,
    selectedVectorId: undefined as string | undefined,
  }),
  actions: {

    async fetchChat() {
      this.activeChat = defineChatSession(ChatMessageEmitter.EkasanDefaultBot)
    },
    addMessage(content: string, emitter: ChatMessageEmitter) {
      this.activeChat?.messages.push({
        emitter,
        message: content,
        id: uniqueId(),
      })
    },

    async sendMsgToBot(
      vector_id: string,
      assistant_id: string,
      instruction: string,
      messageTxt: ChatMessage['message'],
    ) {
      const message = { message: messageTxt, emitter: ChatMessageEmitter.User } as ChatMessage
      if (!this.activeChat)
        throw new Error('Chat not found')
      this.activeChat.messages.push(message)

      this.botIsAnswering = true

      const emptyMessage = createEmptyMessage(this.activeChat.chatBot.id)

      this.activeChat.messages.push(emptyMessage)
      this.botIsThinking = true
      await chatService.sendMessage(
        vector_id,
        assistant_id,
        instruction,
        messageTxt,
      )
        .then(response => {
          this.botIsAnswering = true

          const answer = response.answer

          const finalAnswerMessageWithoutQuote = {
            message: answer,
            emitter: this.activeChat?.chatBot.id,

            // id: tmpId,
            id: CHATBOT_ANSWER_PLACEHOLDER_ID,
          } as ChatMessage

          this.activeChat.messages = replaceObjectInArray(this.activeChat.messages as any[], '0', finalAnswerMessageWithoutQuote) as ChatMessage[]
          this.botIsThinking = false
          this.botIsAnswering = false
        })
        .catch (error => {
          console.error(error)
          this.botIsThinking = false
          this.botIsAnswering = false

          // this.activeChat.messages.splice(
          //   this.activeChat.messages.findIndex((m: ChatMessage) => m.id === (waitingForCurrentQuote ? tmpId : 0)),
          //   1,
          // )
        })
    },

    abortResponse() {
    },
  },
  getters: {},
})

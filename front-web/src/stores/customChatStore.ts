import { defineStore } from 'pinia'
import { uniqueId } from 'lodash'
import { ChatMessageEmitter, createEmptyMessage } from '@/utils/chatUtils'
import type { Chat, ChatContact, ChatMessage } from '@/utils/chatUtils'
import { CHATBOT_ANSWER_PLACEHOLDER_ID, replaceObjectInArray } from '@/utils/constants'

// TODO: remove this models when these can be imported from the API client

export const useCustomChatStore = defineStore('chatStore', {
  state: () => ({
    selectedVectorId: undefined as string | undefined
    botIsThinking: false,

  }),
  actions: {

    async fetchChat() {
      // const chatHistory = await this._chatAPI.getChatHistoryExplorerHistoryGet(
      //   tenderId,
      //   userId,
      //   ChatMessageEmitter.TfExplorerBot,
      // )
      this.activeChat = defineChatSession(ChatMessageEmitter.EkasanDefaultBot)
      console.log('activeChat', this.activeChat)
    },
    addMessage(content: string, emitter: ChatMessageEmitter) {
      // const chatHistory = await this._chatAPI.getChatHistoryExplorerHistoryGet(
      //   tenderId,
      //   userId,
      //   ChatMessageEmitter.TfExplorerBot,
      // )
      this.activeChat?.messages.push({
        emitter,
        message: content,
        id: uniqueId(),
      })
    },

    async openNewChatSession(tenderId: string, userId: string) {
      // if (!this.activeChat)
      //   throw new Error('Chat not found')

      // await this._chatAPI.clearChatHistoryExplorerClearGet(
      //   tenderId,
      //   userId,
      //   this.activeChat.chatBot.id,
      // )
    },

    async sendMsgToBot(messageTxt: ChatMessage['message']) {
      const message = { message: messageTxt, emitter: ChatMessageEmitter.User } as ChatMessage
      const waitingForCurrentQuote: boolean = false
      const streamEnded: boolean = false

      const tmpId = `front-${uniqueId()}`

      if (!this.activeChat)
        throw new Error('Chat not found')
      this.activeChat.messages.push(message)

      this.botIsAnswering = true

      const emptyMessage = createEmptyMessage(this.activeChat.chatBot.id)

      this.activeChat.messages.push(emptyMessage)
      this.botIsThinking = true

      this.abortingController = new AbortController()

      const signal = this.abortingController.signal

      try {
        // const response = await fetch(
        //   `${import.meta.env.VITE_API_BASE_URL}/explorer/?tender_id=${tenderId}&user_id=${userId}&question=${messageTxt}&ai_chat_engine=${this.activeChat.chatBot.id}`,
        //   {
        //     method: 'GET',
        //     headers,
        //     signal,
        //   } as RequestInit)

        // const reader = response.body!.getReader()

        this.botIsAnswering = true

        const answer = 'This is My Answer'

        // const text = new TextDecoder().decode(value)

        const finalAnswerMessageWithoutQuote = {
          message: answer,
          emitter: this.activeChat?.chatBot.id,

          // id: tmpId,
          id: CHATBOT_ANSWER_PLACEHOLDER_ID,
        } as ChatMessage

        this.activeChat.messages = replaceObjectInArray(this.activeChat.messages as any[], '0', finalAnswerMessageWithoutQuote) as ChatMessage[]
        this.botIsThinking = false
        this.botIsAnswering = false
      }
      catch (error) {
        console.error(error)
        this.botIsThinking = false
        this.botIsAnswering = false

        this.activeChat.messages.splice(
          this.activeChat.messages.findIndex((m: ChatMessage) => m.id === (waitingForCurrentQuote ? tmpId : 0)),
          1,
        )
      }
    },

    abortResponse() {
      // this.abortingController!.abort()
      // this.abortingController = null
    },
  },
  getters: {},
})

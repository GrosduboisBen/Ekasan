import { random } from 'lodash'
import chatBotAvatar from '@images/ekasan-logo.svg'

export interface ChatSession {
  chat: Chat
  name: string
  isActive: boolean
}

export enum E_ChatSettingsOption {
  ASSISTANT = 'Assistants',
  STORE = 'Vector store associé',
  CREATE = 'Ajouter un chat',
  DELETE = 'Supprimer le chat',
}

export enum ChatMessageEmitter {
  EkasanDefaultBot = 'EKASAN_DEFAULT_BOT',
  EkasanCustomBot = 'EKASAN_CUSTOM_BOT',
  User = 'USER',
}

export interface QuoteModel {
  quote: string
  documentId: string
  pageNumber: number
}

export interface ChatContact {
  id: ChatMessageEmitter
  fullName: string
  avatar: string
}

export interface ChatMessage {
  message: string
  emitter: ChatMessageEmitter
  id?: string
  time?: Date
  quotes?: QuoteModel[]
}

export interface Chat {
  id: string
  chatBot: ChatContact
  messages: ChatMessage[]
}

export function createEmptyMessage(emitter: ChatMessageEmitter): ChatMessage {
  return {
    id: '0',
    message: '',
    time: new Date(),
    emitter,
  }
}

// export function createEmptyMessage(emitter: ChatMessageEmitter): ChatMessage {
//   return {
//     id: CHATBOT_ANSWER_PLACEHOLDER_ID,
//     message: '',
//     time: new Date(),
//     emitter,
//   }
// }

export function defineChatSession(bot: ChatMessageEmitter): Chat {
//   return {
//     id: currentSession.id,
//     chatBot: {
//       id: currentSession.bot,
//       fullName: currentSession.bot,
//       avatar: chatBotAvatar,
//     },
//     messages: currentSession.chatMessages!.map(msg => ({
//       id: msg.id,
//       message: msg.message,
//       time: msg.createdAt,
//       emitter: msg.emitter,
//       quotes: msg.quotes,
//     } as ChatMessage)).sort((msgA, msgB) => msgA.time!.getTime() - msgB.time!.getTime()), // Temporary fix to keep chat timeline
//   } as Chat
// }
// else
// {
  return {
    id: random().toString(),
    chatBot: {
      id: bot,
      fullName: 'Ekasan AI',
      avatar: chatBotAvatar,
    },
    messages: [],
  } as Chat
}

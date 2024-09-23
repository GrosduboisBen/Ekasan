/* stylelint-disable scss/no-global-function-names */
<script lang="ts" setup>
import { parse } from 'marked'
import { VCardTitle, VDivider, VLabel, VListItem } from 'vuetify/lib/components/index.mjs'
import ekasan from '@images/ekasan-logo-white.svg'
import { useChatStore } from '@/stores/chatStore'
import { useFileStore } from '@/stores/fileStore'
import { FileService, vectorAPIToCustom } from '@/services/main/file-service'
import { AssistantService, apiAssistantToTInterface } from '@/services/ai/assistant-service'
import { I_Agent } from '@/utils/agents'
import type { APIAssistant } from '@/utils/assistant-utils'

const loadingVector = ref(false)

const fileService = new FileService()
const assistantService = new AssistantService()
const chatStore = useChatStore()
const fileStore = useFileStore()

const vectorStores = await fileService.getVectorStore().catch(() => { return [] })

interface I_VectorInfo {
  id: string
  name: string
}

const vectorList = ref([] as I_VectorInfo[])
const vectorOptions = ref([] as string[])
const selectedVectorName = ref(null as null | string)
const selectedVectorId = ref(undefined as string | undefined)

const assistantList = ref([] as APIAssistant[])
const assistantOptions = ref([] as string[])
const selectedAssistantName = ref(null as null | string)
const selectedAssistantId = ref(undefined as string | undefined)
const selectedAssistantInstruction = ref(undefined as string | undefined)

vectorStores.forEach(vs => {
  const formated = vectorAPIToCustom(vs)

  fileStore.addFolder(formated)

  vectorList.value.push({
    id: formated.id,
    name: formated.name,
  })
  vectorOptions.value.push(formated.name)
})

selectedVectorName.value = vectorOptions.value[0]
selectedVectorId.value = vectorList.value[0].id

/**
 * Fetch associated assistant for a given vector store.
 * @param {string} vector_id
 * @returns {void}
 */
async function fetchVectorAssistant(vector_id: string) {
  await assistantService.getVectorAssistants(vector_id)
    .then((list: any[]) => {
      const optionList: string[] = []

      const formatedList = list.map((raw: any) => {
        const formated = apiAssistantToTInterface(raw)

        optionList.push(formated.name)

        return formated
      })

      assistantList.value = formatedList
      assistantOptions.value = optionList
      if (assistantList.value.length > 0) {
        selectedAssistantName.value = assistantOptions.value[0]
        selectedAssistantId.value = findAssistantByName(selectedAssistantName.value).id
        selectedAssistantInstruction.value = findAssistantByName(selectedAssistantName.value).instructions
      }
      else {
        selectedAssistantName.value = undefined
        selectedAssistantId.value = undefined
        selectedAssistantInstruction.value = undefined
      }
    })
}

function findStoreByName(vector_name: string) {
  return vectorList.value.find((vs: I_VectorInfo) => {
    return vs.name === vector_name
  })
}

function findAssistantByName(assistant_name: string) {
  return assistantList.value.find(el => {
    return el.name === assistant_name
  })
}

await fetchVectorAssistant(vectorList.value[0].id)

const settingsList = Object.values(E_ChatSettingsOption).map(option => {
  return { title: option, value: option }
})

const questionChatLogPS = ref()
const chatLogQuestion = ref()
const msg = ref('')

await chatStore.fetchChat()

chatStore.addMessage('Test message', ChatMessageEmitter.EkasanDefaultBot)
chatStore.addMessage('User Message', ChatMessageEmitter.User)

const scrollChat = () => {
  if (questionChatLogPS.value != null)
    questionChatLogPS.value.$el.scrollTo(0, chatLogQuestion.value.$el.nextSibling.clientHeight + 1000)
}

function isSendEnabled() {
  return (
    selectedAssistantId.value
    && selectedVectorId.value
    && selectedAssistantInstruction.value
  )
}

async function sendMessageToBot() {
  if (!msg.value || chatStore.botIsAnswering || chatStore.botIsThinking)
    return
  await chatStore.sendMsgToBot(
    selectedVectorId.value,
    selectedAssistantId.value,
    selectedAssistantInstruction.value,
    msg.value,
  )
    .then(() => {
      scrollChat()
    })

  // Reset message input
  msg.value = ''
  nextTick().then(() => {
    scrollChat()
  })
}

watch(selectedVectorName, async () => {
  console.log('watching vector')
  loadingVector.value = true
  selectedVectorId.value = findStoreByName(selectedVectorName.value).id
  await fetchVectorAssistant(selectedVectorId.value)
  loadingVector.value = false
})

watch(selectedAssistantName, async () => {
  if (!loadingVector.value) {
    console.log('watching assistant')
    selectedAssistantId.value = findAssistantByName(selectedAssistantName.value).id
    selectedAssistantInstruction.value = findAssistantByName(selectedAssistantName.value).instructions
  }
})
</script>

<template>
  <VCard class="chatbot-container">
    <div class="chat-log pa-5 chatbot-content">
      <VCardTitle class="chatbot-card-title">
        <span>
          Chatbot
        </span>
        <VSelect
          v-model="selectedVectorName"
          :items="vectorOptions"
          variant="plain"
          class="vector-selector"
        />
        <VSelect
          v-if="assistantList.length > 0"
          v-model="selectedAssistantName"
          :items="assistantOptions"
          variant="plain"
          class="vector-selector"
        />
        <VLabel v-else>
          No Assistant found
        </VLabel>
        <VMenu nav>
          <template #activator="{ props }">
            <VBtn
              variant="plain"
              v-bind="props"
            >
              <VIcon
                class="setting-dots"
                icon="tabler-dots"
              />
            </VBtn>
          </template>
          <!-- Vector Selector -->
          <VList>
            <VListItem
              v-for="item in settingsList"
              :key="item.title"
              :value="item.value"
            >
              {{ item.title }}
            </VListItem>
          </VList>
        </VMenu>
      </VCardTitle>
      <VDivider class="chatbot-divider" />
      <!-- CONTENT BOX -->
      <div
        v-for="(message, index) in chatStore.activeChat?.messages"
        :key="message.emitter + String(index)"
        class="chat-group d-flex align-start"
        :class="[{
          'flex-row-reverse': message.emitter !== chatStore.activeChat?.chatBot.id,
        }]"
      >
        <!-- CHAT ICON -->
        <div
          class="chat-avatar"
          :class="message.emitter !== chatStore.activeChat?.chatBot.id ? 'ms-4' : 'me-4'"
        >
          <VAvatar
            size="32"
            :style="{
              'background-color': !(message.emitter === chatStore.activeChat?.chatBot.id) ? 'rgb(var(--v-theme-primary))' : 'rgb(255 255 255)',
              'padding': !(message.emitter === chatStore.activeChat?.chatBot.id) ? '5px' : '0px',
            }"
          >
            <VImg :src="message.emitter === chatStore.activeChat?.chatBot.id ? chatStore.activeChat?.chatBot.avatar : chatStore.user?.avatar" />
          </VAvatar>
        </div>
        <!-- CHAT MESSAGE -->
        <div
          class="chat-body d-inline-flex flex-column"
          :class="message.emitter !== chatStore.activeChat?.chatBot.id ? 'align-end' : 'align-start'"
        >
          <p
            class="chat-content py-2 pl-6 pr-4 elevation-1 mb-1"
            style=" position: relative; background-color: rgb(255 255 255); color: black; text-align: justify;"
            :class="[
              message.emitter === chatStore.activeChat?.chatBot.id ? 'chat-left' : 'bg-primary text-white chat-right',
            ]"
          >
            <!-- LOADER -->
            <!-- TODO Adapt -->
            <span v-if="chatStore.botIsThinking && message.id === '0'">
              <VProgressCircular indeterminate />
            </span>
            <span
              v-else
              style="position: relative;"
            >
              <div v-html="parse(message.message)" />
            </span>
          </p>
        </div>
      </div>
    </div>
    <!-- BOTTOM BAR -->
    <VForm
      class="chat-log-message-form mb-5 mx-5"
      @submit.prevent="sendMessageToBot"
    >
      <div style=" display: flex; flex-direction: row; align-items: center; gap: 0.5rem; inline-size: 100%">
        <div
          v-bind="props"
          style="inline-size: 100%"
        >
          <!-- TEXT INPUT -->
          <VTextField
            :key="chatStore.activeChat?.chatBot.id"
            v-model="msg"
            variant="solo"
            placeholder="Chatbot text"
            density="default"
            autofocus
          />
        </div>
        <!-- SEND BUTTON -->
        <div v-bind="props">
          <VBtn
            :disabled="!isSendEnabled()"
            icon="tabler-send"
            @click="sendMessageToBot"
          />
        </div>
        <!-- LOADER / STOP BUTTON -->
        <VBtn
          v-if="chatStore.botIsThinking || chatStore.botIsAnswering"
          :disabled="chatStore.botIsThinking"
          icon="tabler-player-stop"
          @click="() => { console.log('click ') }"
        />
      </div>
    </VForm>
  </VCard>
</template>

<style lang=scss>
@import '/src/assets/styles/styles';

.chat-log {
  .chat-content {
    border-end-end-radius: 6px;
    border-end-start-radius: 6px;

    &.chat-left {
      border-start-end-radius: 6px;
    }

    &.chat-right {
      border-start-start-radius: 6px;
    }

  }

  .chatbot-header{
    display: flex;
    border-radius: 0.8em;
    background-color: rgb(0 0 0 / 16%);
    color: map-get($custom-colors, 'ekasan-yellow' );
    margin-block-end: 1em;
  }

  .chatbot-divider{
    margin-block-end: 1em;
  }

  .chat-body {
    max-inline-size: 80%;
  }

  .chat-group {
    margin-block-end: 1.25rem;
  }
}

.chatbot-card-title{
  display: flex;
  justify-content: space-between;
  color: map-get($custom-colors, 'ekasan-yellow' );
  margin-block-end: 1em;
  align-items:center;
}

.chatbot-container{
  block-size: 100%;
}

.setting-dots{
  color: map-get($custom-colors, 'ekasan-yellow' );

}

.chatbot-content {
  min-block-size: 76vh;
}

.chat-btns {
  border-radius: 0.25rem;

  // background-color: rgba(11,117,229, 20%) !important;
  box-shadow: none;
}

.vector-selector{
  max-width: max-content;
  position: relative;
  bottom: 0.6em;
}
</style>

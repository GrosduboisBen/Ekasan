<script setup lang="ts">
import CreateAssistant from './createAssistant.vue'
import EditAssistant from './editAssistant.vue'
import { AssistantService, apiAssistantToTInterface } from '@/services/ai/assistant-service'
import { useAssistantStore } from '@/stores/assistantStore'
import type { APIAssistant } from '@/utils/assistant-utils'

const props = defineProps(['files'])
const assistantStore = useAssistantStore()

const assistantService = new AssistantService()

await assistantService.getAllAssistant()
  .then((list: any[]) => {
    const formatedList = list.map((raw: any) => {
      return apiAssistantToTInterface(raw)
    })

    assistantStore.refreshAssistants(formatedList)

    return formatedList
  }) as APIAssistant[]

const assistantList = ref(assistantStore.getAssistants)

const addAssistantDialogEnable = ref(false)
const editAssistantDialogEnable = ref(false)

watch(assistantStore, () => {
  if (addAssistantDialogEnable.value !== assistantStore.getDialogStatus)
    addAssistantDialogEnable.value = assistantStore.getDialogStatus

  if (editAssistantDialogEnable.value !== assistantStore.getEditStatus)
    editAssistantDialogEnable.value = assistantStore.getEditStatus

  assistantList.value = assistantStore.getAssistants
})

function createAssistant() {
  assistantStore.openAddModal()
}

function editAssistant(assistant) {
  assistantStore.openEditModal(assistant)
}

function closeAddModal() {
  assistantStore.closeAdd()
}

function closeEditModal() {
  assistantStore.closeEdit()
}
</script>

<template>
  <VCard>
    <VCardTitle>Assistants</VCardTitle>
    <VCardItem>
      <div
        v-for="assistant in assistantList"
        :key="assistant"
      >
        <VCard class="agent-card">
          <div class="mt-3">
            <VCardTitle class="agent-title">
              {{ assistant.name }}
              <VCardActions>
                <VBtn>
                  <VIcon
                    color="error"
                    icon="tabler-trash"
                  />
                </VBtn>
              </VCardActions>
            </VCardTitle>
            <VDivider />
            <VDialog
              v-model="editAssistantDialogEnable"
              width="1000"
            >
              <template #activator="{ editProps }">
                <VBtn
                  class="start-button"
                  color="#e9ba2b"
                  variant="outlined"
                  style="margin-left: 1em"
                  v-bind="editProps"
                  @click="editAssistant(assistant)"
                >
                  <VIcon
                    icon="tabler-edit"
                    start
                  />
                  Edit
                </VBtn>
              </template>

              <!-- Dialog close btn -->
              <DialogCloseBtn @click="closeEditModal" />
              <EditAssistant />
            </VDialog>
          </div>
          <VRow>
            <VCol>
              <VCardText class="agent-card-section-title">
                Description :
              </VCardText>
            </VCol>
            <VCol>
              <VCardText>{{ assistant.description }}</VCardText>
            </VCol>
          </VRow>
          <VRow>
            <VCol>
              <VCardText class="agent-card-section-title">
                Assistant Instruction :
              </VCardText>
            </VCol>
            <VCol>
              <VCardText>{{ assistant.instructions }}</VCardText>
            </VCol>
          </VRow>
        </VCard>
      </div>
    </VCardItem>
    <VDialog
      v-model="addAssistantDialogEnable"
      width="1000"
    >
      <template #activator="{ props }">
        <VBtn
          color="#e9ba2b"
          v-bind="props"
          @click="createAssistant"
        >
          <VIcon
            icon="tabler-plus"
            start
          />
          Create Agent
        </VBtn>
      </template>

      <!-- Dialog close btn -->
      <DialogCloseBtn @click="closeAddModal" />
      <CreateAssistant />
    </VDialog>
  </VCard>
</template>

<style>
.agent-title{
  display: flex;
  justify-content: space-between;
  color: #e9ba2b;
  margin-inline-start: 1em;
}

.agent-card {
  background-color: #5146373b;
  margin-block-end: 1em;
}

.agent-card-section-title {
  font-size: 1.2em;
  font-weight: bold;
}

.start-button{
  margin-block-start: 1em;
}

.file-chip{
  margin-inline-start: 1em;
}
</style>

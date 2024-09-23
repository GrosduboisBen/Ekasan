<script setup lang="ts">
import { VCardItem, VForm, VProgressCircular } from 'vuetify/lib/components/index.mjs'
import { useAssistantStore } from '@/stores/assistantStore'
import { type I_File, useFileStore } from '@/stores/fileStore'
import type { I_Agent } from '@/utils/agents'
import type { APIVectorStore } from '@/services/main/file-service'
import { FileService } from '@/services/main/file-service'
import type { APIAssistant } from '@/services/ai/assistant-service'
import { AssistantService } from '@/services/ai/assistant-service'

const fileService = new FileService()
const assistantService = new AssistantService()
const loadingStatus = ref(true as boolean)

const vectorStores = ref([] as APIVectorStore[])

const assistantStore = useAssistantStore()
const refForm = ref<VForm>()

const selectedAssistant = ref(assistantStore.getSelectedAssistant as APIAssistant)
const id = selectedAssistant.value.id
const name = selectedAssistant.value.name
const vectorId = selectedAssistant.value.store_id
const description = selectedAssistant.value.description
const instructions = selectedAssistant.value.instructions

function findVectorByName(name: string) {
  return vectorStores.value.find(vs => vs.name === name)
}

function findVectorById(id: string) {
  return vectorStores.value.find(vs => vs.id === id)
}

const assistantName = ref(name)
const promptInstruction = ref(instructions)
const assistantDescription = ref(description)
const selectedStore = ref('')

const vectorStoreOptions = ref(vectorStores.value.map(vs => {
  return vs.name
}))

onMounted(async () => {
  await fileService.getVectorStore()
    .then(list => {
      vectorStores.value = list
      vectorStoreOptions.value = vectorStores.value.map(vs => {
        return vs.name
      })
      selectedStore.value = findVectorById(vectorId)?.name
      loadingStatus.value = false
    })
    .catch(() => { return [] })
})

function clearForm() {
  assistantName.value = name
  promptInstruction.value = instructions
  assistantDescription.value = description
  selectedStore.value = vectorId
}

async function updateAssistant(event: any) {
  const newAssistant = {
    id,
    name: assistantName.value,
    instructions: promptInstruction.value ?? '',
    description: assistantDescription.value ?? '',
    store_id: findVectorByName(selectedStore.value ?? '')?.id,
  } as APIAssistant

  await assistantService.updateAssistant(
    newAssistant,
  )

  assistantStore.updateAssistant(newAssistant)

  //   const refreshedAsssistant = assistantStore.getAssistants

  //   refreshedAsssistant.push(newAssistant)
  //   assistantStore.refreshAssistants(refreshedAsssistant)
  clearForm()

  assistantStore.closeEdit()
}
</script>

<template>
  <VCard v-if="!loadingStatus">
    <VCardTitle>
      Edit : {{ name }} : {{ id }}
    </VCardTitle>
    <VForm
      ref="refForm"
      @submit.prevent="updateAssistant"
    >
      <VCardItem>
        <AppTextField
          id="name"
          v-model="assistantName"
          clearable
          clear-icon="tabler-circle-x"
          label="Name"
          placeholder="Assistant Name"
        />
        <AppTextField
          id="decription"
          v-model="assistantDescription"
          clearable
          clear-icon="tabler-circle-x"
          label="Description"
          placeholder="Role Description"
        />
        <AppTextarea
          id="instruction"
          v-model="promptInstruction"
          clearable
          clear-icon="tabler-circle-x"
          label="Instructions"
          placeholder="Assistant prompt instructions"
        />
        <AppSelect
          v-model="selectedStore"
          label="Vector Store"
          :items="vectorStoreOptions"
        />
      </VCardItem>
      <VBtn
        color="#e9ba2b"
        type="submit"
      >
        Add
      </VBtn>
    </VForm>
  </VCard>
  <VCard v-else>
    <VCardItem class="loader-container">
      <VProgressCircular
        size="large"
        indeterminate
      />
    </VCardItem>
  </VCard>
</template>

<style lang="scss">
.loader-container{
  min-height: 25em;
  display: flex;
  justify-content: center;
}
</style>

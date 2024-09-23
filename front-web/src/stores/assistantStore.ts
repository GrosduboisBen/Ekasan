import { defineStore } from 'pinia'
import type { APIAssistant } from '@/utils/assistant-utils'

export const useAssistantStore = defineStore('assistantStore', {
  state: () => ({
    assistants: [] as APIAssistant[],
    dialogStatus: false as boolean,
    editStatus: false as boolean,
    selectedAssistant: undefined as APIAssistant | undefined,
  }),
  actions: {
    refreshAssistants(assistants: APIAssistant[]) {
      this.assistants = assistants.sort((a, b) => {
        if (a.name < b.name)
          return -1

        if (a.name > b.name)
          return 1

        return 0
      })
    },
    addAssistant(assistant: APIAssistant) {
      this.assistants.push(assistant)
    },
    removeAssistant(assistant: APIAssistant) { // TODO Use Agent ID when connected.
      this.assistants.filter(el => {
        return el.name !== assistant.name
      })
    },
    selectAssistant(assistant: APIAssistant | undefined) {
      this.selectedAssistant = assistant
    },
    openAddModal() {
      this.dialogStatus = true
    },
    closeAdd() {
      this.dialogStatus = false
    },
    openEditModal(assistant: APIAssistant) {
      this.selectedAssistant = assistant
      this.editStatus = !this.editStatus
    },
    closeEdit() {
      this.selectedAssistant = undefined
      this.editStatus = false
    },
    findAssistant(assistantId: string) {
      this.assistants.find(el => {
        return el.id === assistantId
      })
    },
    updateAssistant(assistant: APIAssistant) {
      const updatedList = this.assistants.map(el => {
        if (el.id === assistant.id)
          el = assistant

        return el
      })

      this.refreshAssistants(updatedList)
    },
  },
  getters: {
    getAssistants: state => {
      return state.assistants
    },
    getSelectedAssistant: state => {
      return state.selectedAssistant
    },
    getDialogStatus: state => {
      return state.dialogStatus
    },
    getEditStatus: state => {
      return state.editStatus
    },
  },
})

import { defineStore } from 'pinia'
import type { I_Category } from './categoryStore'
import type { I_VectorStore } from '@/services/main/file-service'

export interface I_File {
  name: string
  type: string
  vector_id: string
  file_id: string
  extension: string
  categories?: I_Category[]
}
export const useFileStore = defineStore('fileStore', {
  state: () => ({
    allFiles: [] as I_File[],
    rootFiles: [] as I_File[],
    allFolders: [] as I_VectorStore[],
    selectedFolder: undefined as I_VectorStore | undefined,
  }),
  actions: {
    addFile(file: I_File) {
      this.selectedFolder ? this.selectedFolder.content.push(file) : this.rootFiles.push(file)
      this.allFiles.push(file)
    },
    fillFolders(file: I_File) {
      const vectorStore = this.allFolders.find(vs => vs.id === file.vector_id)
      if (vectorStore)
        vectorStore.content.push(file)

      // this.allFiles.push(file)

      // else this.rootFiles.push(file)
    },
    addFolder(folder: I_VectorStore) {
      this.allFolders.push(folder)
    },
    removeFile(file: I_File) {
      // this.files.splice(index, 1)
      if (this.selectedFolder) {
        const selectedFile = this.selectedFolder.content.find(el => el === file)

        this.selectedFolder.content = this.selectedFolder.content.filter(el => el !== selectedFile)
      }
      else {
        const selectedFile = this.rootFiles.find(el => el === file)

        this.rootFiles = this.rootFiles.filter(el => el !== selectedFile)
      }
    },
    filterFolder(selectedFolder: I_VectorStore) {
      const selected = this.allFolders.find(folder => folder === selectedFolder)

      this.selectedFolder = selected
    },
    removeFolder(folder: I_VectorStore) {
      const selectedFolder = this.allFolders.find(el => el === folder)

      this.allFolders = this.allFolders.filter(el => el !== selectedFolder)
    },
    selectFolder(folder: I_VectorStore) {
      this.selectedFolder = folder
    },
    backOnRoot() {
      this.selectedFolder = undefined
    },
    findFileByName(name: string) {
      return this.allFiles.find(el => {
        return el.name === name
      }) as I_File
    },
    resetStore() {
      this.allFolders = []
      this.allFiles = []
      this.selectedFolder = undefined
    },

  },
  getters: {
    getList: state => {
      if (state.selectedFolder)
        return state.selectedFolder.content

      else
        return state.rootFiles
    },

    getFolders: state => {
      return state.allFolders
    },

    getSelectedFolder: state => {
      return state.selectedFolder
    },

    getAllFolders: state => {
      return state.allFolders
    },
    getAllFiles: state => {
      return state.allFiles
    },
    getFirstRootFile: state => {
      return state.rootFiles[0]
    },
  },
})

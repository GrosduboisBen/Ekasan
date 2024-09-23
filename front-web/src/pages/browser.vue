<script setup lang="ts">
import type { APIDocument } from '@/services/main/file-service'
import { FileService, vectorAPIToCustom } from '@/services/main/file-service'
import type { I_File, I_Folder } from '@/stores/fileStore'
import { useFileStore } from '@/stores/fileStore'
import { useGlobalStore } from '@/stores/globalStore'

const fileStore = useFileStore()
const globalStore = useGlobalStore()
const fileService = new FileService()

const documents = ref([] as APIDocument[])

const selectedStoreId = ref(undefined as undefined | string)
const isRefreshing = ref(false)
let selectedFile: File | undefined | null
const files = ref(fileStore.getList)
const folders = ref(fileStore.getFolders)
const isFolderDialogVisible = ref(false)
const newFolderName = ref('')

// Fetch vector stores from AI.

fileStore.resetStore()

const vectorStores = await fileService.getVectorStore().catch(() => { return [] })

// Empty fileStore for reload.

// Format vector Stores infos for front store interface and folder creation.
vectorStores.forEach(vs => {
  const formated = vectorAPIToCustom(vs)

  fileStore.addFolder(formated)
  folders.value = ref(fileStore.getFolders)
})

if (!isEmpty(fileStore.getAllFolders)) {
  fileStore.selectFolder(fileStore.getAllFolders[0])
  selectedStoreId.value = fileStore.getSelectedFolder?.id
}

/**
 * Get database documents for first vector store (selected by default).
 * @returns {void}
 */
async function fetchFilteredDocuments() {
  documents.value = await fileService.getVectorById(fileStore.selectedFolder!.id)
    .then(async vector => {
      return await fileService.getFiles({ vector_id: vector.id })
    })

  if (fileStore.getSelectedFolder && isEmpty(fileStore.getSelectedFolder.content)) {
    documents.value.forEach(doc => {
      const [fileName, extension] = doc.name.split('.')

      fileStore.fillFolders(
        {
          name: fileName,
          type: extension,
          extension,
          file_id: doc.file_id,
          vector_id: doc.vector_id,
        })
    })
  }
  if (!fileStore.getSelectedFolder)
    fileStore.selectFolder(fileStore.getAllFolders[0])

  files.value = fileStore.getList
}

await fetchFilteredDocuments()

const toUpdateDocuments = ref([] as I_File[])

async function getAsyncFilesFromStore() {
  await fileService.getVectorFiles(fileStore.getSelectedFolder!.id).then(list => {
    toUpdateDocuments.value = getUnsavedFileFromVector(
      fileStore.getSelectedFolder!.id,
      list,
      globalStore.getUser!.id,
      fileStore.getList.map(el => {
        return fileToBaseDocument(el, globalStore.getUser!.id)
      }),
    ) as I_File[]
  })
}

await getAsyncFilesFromStore()

/**
 * Add file in both database and AI store.
 * @returns {void}
 */
async function addFile() {
  if (selectedFile
    && fileStore.getSelectedFolder
    && globalStore.getUser
  ) {
    const [fileName, extension] = selectedFile.name.split('.')

    await fileService.addFileToVector(selectedFile, fileStore.getSelectedFolder!.id)
      .then(async resp => {
        const formatedFile: I_File = {
          name: fileName,
          type: getFileExtension(selectedFile),
          extension,
          vector_id: fileStore.getSelectedFolder!.id,
          file_id: resp.id,
        }

        fileStore.addFile(formatedFile)
        await fileService.addDocument(formatedFile, globalStore.getUser!.id)
      })
  }
}

async function syncFileFromStore(vector_id: string) {
  if (toUpdateDocuments.value.length > 0) {
    await fileService.getVectorFiles(vector_id)
      .then(() => {
        toUpdateDocuments.value.forEach(async document => {
          await fileService.addDocument(document, globalStore.getUser!.id)
        })
      })
    await fetchFilteredDocuments()
  }
}

// TODO add vector store creation to this.
const addFolder = (event: any) => {
  const folder: I_Folder = {
    name: event.target[0].value,
    content: [],
    folders: [],
    parent: fileStore.selectedFolder ? fileStore.selectedFolder : undefined,
  }

  fileStore.addFolder(folder)
  isFolderDialogVisible.value = false
}

const goBack = () => {
  fileStore.backOnRoot()
}

const handleFileChange = (event: any) => {
  selectedFile = event.target.files[0]
}

watch(fileStore, async () => {
  if (!isRefreshing)
    await getAsyncFilesFromStore()

  if (fileStore.getSelectedFolder && selectedStoreId.value !== fileStore.getSelectedFolder?.id) {
    selectedStoreId.value = fileStore.getSelectedFolder?.id
    await fetchFilteredDocuments()
  }
})
</script>

<template>
  <div>
    <VCard v-if="fileStore.getSelectedFolder">
      <div class="selected-folder-header">
        <VCardTitle class="folder-title">
          <VIcon icon="tabler-folder-open" />
          {{ fileStore.getSelectedFolder.name }}
        </VCardTitle>
        <div>
          <VBtn
            v-if="fileStore.getSelectedFolder"
            variant="tonal"
            color="#999696"
            class="mr-6"
          >
            Edit Store
          </VBtn>
          <VBtn
            color="warning"
            variant="outlined"
            class="mr-6"
            @click="goBack"
          >
            Back
          </VBtn>
        </div>
      </div>
    </VCard>
    <VCard
      class="mb-6"
      title="Add some files to your project"
    >
      <form @submit.prevent="addFile">
        <VCardItem class="file-input-bar">
          <VFileInput
            type="file"
            @change="handleFileChange"
          />
        </VCardItem>
        <VCardItem>
          <VBtn
            color="#e9ba2b"
            type="submit"
          >
            Add File
          </VBtn>
        </VCardItem>
      </form>
    </VCard>
    <VCard>
      <VCardTitle>
        Vector Stores
      </VCardTitle>
      <FolderList
        class="mb-6"
        :folders="folders"
      />
      <VDialog
        v-model="isFolderDialogVisible"
        width="500"
      >
        <template #activator="{ props }">
          <VBtn
            class="folder-dialog-button mb-6"
            color="#e9ba2b"
            v-bind="props"
          >
            Add Vector Store
          </VBtn>
        </template>

        <!-- Dialog close btn -->
        <DialogCloseBtn @click="isFolderDialogVisible = !isFolderDialogVisible" />

        <!-- Dialog Content -->
        <VForm @submit.prevent="addFolder">
          <AppTextField
            id="folder"
            v-model="newFolderName"
            clearable
            clear-icon="tabler-circle-x"
            label="Add Folder"
            placeholder="My Folder Name"
          />
          <VBtn
            color="#e9ba2b"
            type="submit"
          >
            Add
          </VBtn>
        </VForm>
      </VDialog>
    </VCard>
    <VCard />
    <VDivider class="mb-6" />
    <VCard v-if="fileStore.getSelectedFolder">
      <VCardTitle>
        Files
      </VCardTitle>
      <FileList
        class="mb-6"
        :files="files"
      />
    </VCard>
    <VAlert
      v-if="toUpdateDocuments.length > 0"
      :icon="false"
      class="async-store-alert"
      type="warning"
    >
      <div class="alert-container">
        Store is not synchronized !
        <VBtn
          v-if="!isRefreshing"
          variant="outlined"
          class="sync-button"
          @click="syncFileFromStore(fileStore.getSelectedFolder!.id)"
        >
          <VIcon
            start
            icon="tabler-refresh"
          />
          Fetch files
        </VBtn>
      </div>
    </VAlert>
    <VCard />
  </div>
</template>

<style>
.file-input-card{
  display: flex;
}

.file-input-bar{
  max-inline-size: 35vw;
}

.folder-dialog-button{
  margin-inline-start: 1.5em;
}

.folder-title {
  color: #ff9f43;
  font-size: large;
  font-weight: 500;
}

.async-store-alert{
  margin-block-start: 5em;
}

.alert-container{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.1em
}

.sync-button{
  background-color: #4f545c;
  color: white;
}

.selected-folder-header{
  display: flex;
  justify-content: space-between;
  background-color: #1f252f
}
</style>

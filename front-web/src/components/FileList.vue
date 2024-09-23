<!-- src/components/FileList.vue -->
<script setup lang="ts">
import { useCategoryStore } from '@/stores/categoryStore'
import { I_File, useFileStore } from '@/stores/fileStore'

// const props = defineProps(['files'])

// fileDirectory.getDirectory()
const fileStore = useFileStore()
const categoryStore = useCategoryStore()
const fileList = ref(fileStore.getList as I_File[])
const isEditDialogVisible = ref(false)
const newFolderName = ref('')
const selectedCategory = ref([])

const removeFile = (file: I_File) => {
  fileStore.removeFile(file)
}

const categoryOptions = categoryStore.getCategoriesAsOptions

watch(fileStore, () => {
  fileList.value = fileStore.getList
})
</script>

<template>
  <VRow class="document-container-row">
    <VCol
      v-for="file in fileList"
      :key="file"
      class="document-container"
    >
      <VDialog
        v-model="isEditDialogVisible"
        fullscreen
        class="edit-file-dialog"
        transition="dialog-bottom-transition"
      >
        <template #activator="{ props }">
          <VBadge>
            <template #badge>
              <VIcon
                icon="tabler-x"
                @click="removeFile(file)"
              />
            </template>
            <VAvatar
              v-bind:="props"
              :size="80"
              color="#c5ac64"
              icon="tabler-file-type-pdf"
            />
          </VBadge>
          <span style="max-width: min-content; text-align: center;">
            {{ file.name }}{{ file.type }}
          </span>
        </template>

        <!-- Dialog close btn -->
        <DialogCloseBtn @click="isEditDialogVisible = !isEditDialogVisible" />

        <!-- Dialog Content -->
        <VCard class="file-edit-container">
          <div>
            <VCardTitle class="edit-title">
              {{ `File Edit : ${file.name}${file.type}` }}
            </VCardTitle>
            <VCardItem>
              <VRow class="mb-6">
                <VCol>
                  <VForm @submit.prevent="{}">
                    <AppTextField
                      id="name"
                      v-model="file.name"
                      clearable
                      clear-icon="tabler-circle-x"
                      label="File"
                      :placeholder="file.name"
                    />
                    <AppSelect
                      v-model="selectedCategory"
                      label="Categories"
                      chips
                      multiple
                      closable-chips
                      :items="categoryOptions"
                    />
                  </VForm>
                </VCol>
              </VRow>
              <FileOptionsModal />
            </VCardItem>
          </div>
          <div class="action-button">
            <VBtn type="submit">
              Add
            </VBtn>
            <VBtn @click="isEditDialogVisible = !isEditDialogVisible">
              Cancel
            </VBtn>
          </div>
        </VCard>
      </VDialog>
    </VCol>
  </VRow>
</template>

<style>
.action-button{
  display: flex;
  gap: 1em;
  margin-left: 4em;
}

.document-container-row{
  width: fit-content;
  align-items: center;
  gap: 1.5em;

}
.document-container{
  display: flex;
  flex-grow: 0;
  flex-basis: unset;
  flex-direction: column;
  align-items: center;
  width: max-content !important;
}
.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: transform 0.2s ease-in-out;
}

.file-edit-container{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.edit-title{
  background-color: #1f252f;
  color: #ff9f43;

}
.edit-file-dialog{
  /* background-color: #fff; */
  opacity: 1 !important;
}
.full-screen-dialog-list{
  .v-list-item[tabindex="-2"].v-list-item--active{
    .v-list-item-action{
      .v-icon{
        color: #fff;
      }
    }
  }

}
</style>

<!-- src/components/FileList.vue -->
<script setup lang="ts">
import { useFileStore } from '@/stores/fileStore'

const props = defineProps(['folders'])

// fileDirectory.getDirectory()
const fileStore = useFileStore()
const folders = ref(props.folders)

const removeFolder = (index: number) => {
  fileStore.removeFolder(index)
}

watch(fileStore, () => {
  folders.value = fileStore.getFolders
})
</script>

<template>
  <VRow class="document-container-row">
    <VCol
      v-for="folder in folders"
      :key="folder"
      class="document-container"
    >
      <VBadge>
        <template #badge>
          <VIcon
            icon="tabler-x"
            @click="removeFolder(folder)"
          />
        </template>
        <VAvatar
          :size="80"
          variant="outlined"
          color="#e9ba2b"
          icon="tabler-folders"
          @click="fileStore.selectFolder(folder)"
        />
      </VBadge>
      <span class="vector-store-title">
        {{ folder.name }}
      </span>
    </VCol>
  </VRow>
</template>

<style>
.document-container-row{
  width: fit-content;
  align-items: center;
  gap: 1.5em;
  margin-left: 0.5em;
  margin-top: 0.5em;

}
.document-container{
  display: flex;
  flex-grow: 0;
  flex-basis: unset;
  flex-direction: column;
  align-items: center;
  width: max-content !important;

}
.vector-store-title {
  color: #ff9f43;
}
</style>

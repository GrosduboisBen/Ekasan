<script setup lang="ts">
import type { I_Category } from '@/stores/categoryStore'
import { useCategoryStore } from '@/stores/categoryStore'

const categoryStore = useCategoryStore()
const categories = ref(categoryStore.getCategories)

const categoryName = ref('')
const categoryExtensions = ref([])
const categoryKeywords = ref([])
const categoryType = ref([])
const categorySignature = ref(false)

const refForm = ref<VForm>()
const extensionRowCounter = ref(1)
const keywordsRowCounter = ref(1)
const typeRowCounter = ref(1)

const isCategoryFormVisible = ref(false)

const toogleVisible = () => {
  isCategoryFormVisible.value = !isCategoryFormVisible.value
}

const clearForm = () => {
  categoryName.value = ''
  categoryExtensions.value = []
  categoryKeywords.value = []
  categoryType.value = []
  categorySignature.value = false
}

const removeExtensionRow = (index: number) => {
  categoryExtensions.value.splice(index, 1)
  extensionRowCounter.value = extensionRowCounter.value - 1
}

const removeKeywordsRow = (index: number) => {
  categoryKeywords.value.splice(index, 1)
  keywordsRowCounter.value = keywordsRowCounter.value - 1
}

const removeTypeRow = (index: number) => {
  categoryType.value.splice(index, 1)
  typeRowCounter.value = typeRowCounter.value - 1
}

const addExtensionRow = () => {
  extensionRowCounter.value = extensionRowCounter.value + 1
  console.log(extensionRowCounter)
}

const addKeywordRow = () => {
  keywordsRowCounter.value = keywordsRowCounter.value + 1
  console.log(keywordsRowCounter)
}

const addTypeRow = () => {
  typeRowCounter.value = typeRowCounter.value + 1
  console.log(typeRowCounter)
}

const addCategory = (event: any) => {
  console.log('EVENT', event)

  const category: I_Category = {
    name: categoryName.value,
    extensions: categoryExtensions.value,
    keywords: categoryKeywords.value,
    types: categoryType.value,
    signature: categorySignature.value,
  }

  clearForm()
  categoryStore.addCategory(category)
  console.log(category)
  toogleVisible()
}

const removeCategory = (category: I_Category) => {
  categoryStore.removeCategory(category)
}

watch(categoryStore, () => {
  categories.value = categoryStore.getCategories
})
</script>

<template>
  <VCard title="Categories">
    <VCardSubtitle>Add and configure you categories !</VCardSubtitle>
  </VCard>
  <VCard
    title="My Categories"
    class="mb-6"
  >
    <VRow class="category-container-row">
      <VCol
        v-for="category in categories"
        :key="category"
        class="category-container"
      >
        <VBadge>
          <template #badge>
            <VIcon
              icon="tabler-x"
              @click="removeCategory(category)"
            />
          </template>
          <VAvatar
            :size="80"
            color="#c5ac64"
            icon="tabler-file-type-pdf"
          />
        </VBadge>
        <span>
          {{ category.name }}
        </span>
      </VCol>
    </VRow>
  </VCard>
  <VCard>
    <VDialog
      v-model="isCategoryFormVisible"
      width="1000"
    >
      <template #activator="{ props }">
        <VBtn
          color="#e9ba2b"
          v-bind:="props"
        >
          Add Category
        </VBtn>
      </template>

      <!-- Dialog close btn -->
      <DialogCloseBtn @click="toogleVisible" />

      <!-- Dialog Content -->
      <VCard title="Add Category">
        <VForm
          ref="refForm"
          @submit.prevent="addCategory"
        >
          <VCardItem>
            <AppTextField
              id="folder"
              v-model="categoryName"
              clearable
              clear-icon="tabler-circle-x"
              label="Name"
              placeholder="Category Name"
            />
          </VCardItem>
          <VCardItem>
            <VExpansionPanels>
              <!-- EXTENSIONS PANNELS -->
              <VExpansionPanel>
                <VExpansionPanelTitle>Extensions</VExpansionPanelTitle>
                <VExpansionPanelText>
                  <div
                    v-for="(n, index) in extensionRowCounter"
                    :key="index"
                    class="extension-row"
                  >
                    <AppTextField
                      id="folder"
                      v-model="categoryExtensions[index]"
                      clearable
                      clear-icon="tabler-circle-x"
                      :label="`Extensions ${index}`"
                      placeholder="Category extensions"
                    />
                    <VBtn
                      size="x-small"
                      variant="outlined"
                      icon="tabler-x"
                      color="error"
                      @click="removeExtensionRow(index)"
                    />
                  </div>
                  <div class="add-row-button-container">
                    <VBtn
                      class="add-form-field"
                      size="x-small"
                      color="success"
                      variant="outlined"
                      icon="tabler-plus"
                      @click="addExtensionRow"
                    />
                  </div>
                </VExpansionPanelText>
              </VExpansionPanel>
              <!-- KEYWORDS PANNELS -->
              <VExpansionPanel>
                <VExpansionPanelTitle>Keywords</VExpansionPanelTitle>
                <VExpansionPanelText>
                  <div
                    v-for="(n, index) in keywordsRowCounter"
                    :key="index"
                    class="extension-row"
                  >
                    <AppTextField
                      id="folder"
                      v-model="categoryKeywords[index]"
                      clearable
                      clear-icon="tabler-circle-x"
                      :label="`Keyword ${index}`"
                      placeholder="Category Keyword"
                    />
                    <VBtn
                      size="x-small"
                      variant="outlined"
                      icon="tabler-x"
                      color="error"
                      @click="removeKeywordsRow(index)"
                    />
                  </div>
                  <div class="add-row-button-container">
                    <VBtn
                      class="add-form-field"
                      size="x-small"
                      color="success"
                      variant="outlined"
                      icon="tabler-plus"
                      @click="addKeywordRow"
                    />
                  </div>
                </VExpansionPanelText>
              </VExpansionPanel>
              <VExpansionPanel>
                <VExpansionPanelTitle>Custom Types</VExpansionPanelTitle>
                <VExpansionPanelText>
                  <div
                    v-for="(n, index) in typeRowCounter"
                    :key="index"
                    class="extension-row"
                  >
                    <AppTextField
                      id="folder"
                      v-model="categoryType[index]"
                      clearable
                      clear-icon="tabler-circle-x"
                      :label="`Type ${index}`"
                      placeholder="Category Type"
                    />
                    <VBtn
                      size="x-small"
                      variant="outlined"
                      icon="tabler-x"
                      color="error"
                      @click="removeTypeRow(index)"
                    />
                  </div>
                  <div class="add-row-button-container">
                    <VBtn
                      class="add-form-field"
                      size="x-small"
                      color="success"
                      variant="outlined"
                      icon="tabler-plus"
                      @click="addTypeRow"
                    />
                  </div>
                </VExpansionPanelText>
              </VExpansionPanel>
            </VExpansionPanels>
          </VCardItem>
          <VBtn
            class="mb-6 ml-6"
            type="submit"
          >
            Add Category
          </VBtn>
        </VForm>
      </VCard>
    </VDialog>
  </VCard>
</template>

<style>
.add-row-button-container{
  display: flex;
  justify-content: end;
}
.extension-row{
  display: flex;
  gap:1em;
  align-items:center
}
.file-input-card{
  display: flex;
}
.file-input-bar{
  max-width: 35vw;
}

.add-form-field {
  margin-top: 1em;
}
.category-container-row{
  width: fit-content;
  align-items: center;
  gap: 1.5em;

}
.category-container{
  display: flex;
  flex-grow: 0;
  flex-basis: unset;
  flex-direction: column;
  align-items: center;
  width: max-content !important;
}
</style>

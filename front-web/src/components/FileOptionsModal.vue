<script setup lang="ts">

// const props = defineProps(['files'])
const assiocationOptions = ref([])
const openedPanels = ref<number[]>([0])
</script>

<template>
  <VCard title="Actions">
    <VCardItem>
      <VRow>
        <VCol>
          <VAlert
            color="warning"
            variant="tonal"
          >
            Generate report for this file. This can take a while.
          </VAlert>
        </VCol>
        <VCol>
          <VBtn
            variant="outlined"
            color="warning"
          >
            Summary Report
          </VBtn>
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <VAlert
            color="info"
            variant="tonal"
          >
            Associate this files in folder and / or categories according to its content and extension.
          </VAlert>
        </VCol>
        <VCol class="association-action">
          <VBtn
            variant="outlined"
            color="info"
          >
            Auto-Association
          </VBtn>
          <div class="ml-6">
            <VCheckbox
              v-model="assiocationOptions"
              label="Folders"
              value="Folders"
              color="info"
            />

            <VCheckbox
              v-model="assiocationOptions"
              label="Categories"
              color="info"
              value="Categories"
            />
          </div>
        </VCol>
      </VRow>
      <VDivider class="mt-6" />
      <VExpansionPanels v-model="openedPanels">
        <VExpansionPanel>
          <VExpansionPanelTitle>Summary</VExpansionPanelTitle>
          <VExpansionPanelText>
            <VCard title="Summary process">
              <VCardItem>
                <VTimeline
                  truncate-line="both"
                  align="start"
                  side="end"
                  line-color="primary"
                  density="compact"
                  class="v-timeline-density-compact"
                >
                  <VTimelineItem
                    dot-color="primary"
                    size="x-small"
                  >
                    <div class="d-flex justify-space-between align-center">
                      <div class="app-timeline-title">
                        Extracting Data
                      </div>
                      <p class="app-timeline-text mb-0">
                        Complete
                      </p>
                    </div>
                  </VTimelineItem>
                  <VTimelineItem
                    dot-color="primary"
                    size="x-small"
                  >
                    <div class="d-flex justify-space-between align-center">
                      <div class="app-timeline-title">
                        Analysing
                      </div>
                      <p class="app-timeline-text mb-0">
                        Complete
                      </p>
                    </div>
                  </VTimelineItem>

                  <VTimelineItem
                    dot-color="primary"
                    size="x-small"
                  >
                    <div class="d-flex justify-space-between align-center">
                      <span class="app-timeline-title">Writing</span>
                      <p class="app-timeline-text mb-0">
                        Report Complete
                      </p>
                    </div>
                  </VTimelineItem>
                </VTimeline>
              </VCardItem>
            </VCard>
          </VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>
    </VCardItem>
  </VCard>
</template>

<style>
.association-action{
  display: flex;
  align-items: baseline;
}
</style>

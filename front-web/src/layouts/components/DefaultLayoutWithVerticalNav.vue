<script lang="ts" setup>
import { VerticalNavLayout } from '@layouts'
import navItems from '@/navigation/vertical'

// Components
import Footer from '@/layouts/components/Footer.vue'

// @layouts plugin
import { useGlobalStore } from '@/stores/globalStore'
import { upperFirst } from 'lodash';

// SECTION: Loading Indicator
const isFallbackStateActive = ref(false)
const refLoadingIndicator = ref<any>(null)
const globalStore = useGlobalStore()

// watching if the fallback state is active and the refLoadingIndicator component is available
watch([isFallbackStateActive, refLoadingIndicator], () => {
  if (isFallbackStateActive.value && refLoadingIndicator.value)
    refLoadingIndicator.value.fallbackHandle()

  if (!isFallbackStateActive.value && refLoadingIndicator.value)
    refLoadingIndicator.value.resolveHandle()
}, { immediate: true })
// !SECTION
</script>

<template>
  <VerticalNavLayout :nav-items="navItems">
    <!-- 👉 navbar -->

    <AppLoadingIndicator ref="refLoadingIndicator" />

    <!-- 👉 Pages -->
    <span
      v-if="globalStore.getUser"
      style="color: #e9ba2b;"
    >
      {{ upperFirst(globalStore.getUser.first_name) }} {{ upperFirst(globalStore.getUser.last_name) }}
    </span>
    <RouterView v-slot="{ Component }">
      <Suspense
        :timeout="0"
        @fallback="isFallbackStateActive = true"
        @resolve="isFallbackStateActive = false"
      >
        <Component :is="Component" />
      </Suspense>
    </RouterView>

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>

    <!-- 👉 Customizer -->
    <!-- <TheCustomizer /> -->
  </VerticalNavLayout>
</template>

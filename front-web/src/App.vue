<script setup lang="ts">
import { useTheme } from 'vuetify'
import ScrollToTop from '@core/components/ScrollToTop.vue'
import initCore from '@core/initCore'
import { initConfigStore, useConfigStore } from '@core/stores/config'
import { hexToRgb } from '@layouts/utils'
import { useCookies } from 'vue3-cookies'
import { useFileStore } from './stores/fileStore'
import { useGlobalStore } from './stores/globalStore'
import { BaseService } from './services/main/base-service'

const { global } = useTheme()

// ℹ️ Sync current theme with initial loader theme
initCore()
initConfigStore()

const globalStore = useGlobalStore()
const configStore = useConfigStore()

const baseService = new BaseService()

// Fetch Token
onMounted(async () => {
  // Fetch users
  if (localStorage.getItem(E_LocalStorageKeys.TOKEN) !== null && localStorage.getItem(E_LocalStorageKeys.USERID)) {
    globalStore.setToken(localStorage.getItem(E_LocalStorageKeys.TOKEN))  
    await baseService.getUser(localStorage.getItem(E_LocalStorageKeys.USERID)!).then(resp => {
      globalStore.setUser(resp)
    })
  }
})
</script>


<template>
  <VLocaleProvider :rtl="configStore.isAppRTL">
    <!-- ℹ️ This is required to set the background color of active nav link based on currently active global theme's primary -->
    <VApp :style="`--v-global-theme-primary: ${hexToRgb(global.current.value.colors.primary)}`">
      <RouterView />

      <ScrollToTop />
    </VApp>
  </VLocaleProvider>
</template>

<script setup lang="ts">
import { router } from '@/plugins/1.router'
import { BaseService } from '@/services/main/base-service'
import { useGlobalStore } from '@/stores/globalStore'
import { dateToString } from '@/utils/base-utils'
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import authV2LoginIllustrationBorderedDark from '@images/pages/auth-v2-login-illustration-bordered-dark.png'
import authV2LoginIllustrationBorderedLight from '@images/pages/auth-v2-login-illustration-bordered-light.png'
import authV2LoginIllustrationDark from '@images/pages/auth-v2-login-illustration-dark.png'
import authV2LoginIllustrationLight from '@images/pages/auth-v2-login-illustration-light.png'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { VForm } from 'vuetify/lib/components/index.mjs'

definePage({
  meta: {
    layout: 'blank',
  },
})

const baseService = new BaseService()
const globalStore = useGlobalStore()


const refForm = ref<VForm>()
const customRequiredValidator = (value: unknown) => {
if (isNullOrUndefined(value) || isEmptyArray(value) || value === false)
  return 'Vous devez entrer une valeur.'

return !!String(value).trim().length || 'Vous devez entrer une valeur.'
}
const form = ref({
  userName: '',
  password: '',
  remember: false,
})

const isPasswordVisible = ref(false)

const authThemeImg = useGenerateImageVariant(
  authV2LoginIllustrationLight,
  authV2LoginIllustrationDark,
  authV2LoginIllustrationBorderedLight,
  authV2LoginIllustrationBorderedDark,
  true)

const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)

async function login() {
  const formValid = (await refForm?.value?.validate()).valid
  if(formValid){
    await baseService.verifyCreds(form.value.userName,form.value.password)
    .then(async (user) => {
      console.log(user)
      globalStore.setUser(user.user)
      await baseService.getToken()
      .then(resp => {
        globalStore.setToken(resp.access_token)
        localStorage.setItem(E_LocalStorageKeys.TOKEN, resp.access_token)
        localStorage.setItem(E_LocalStorageKeys.USERID, user.user.id)
        localStorage.setItem(E_LocalStorageKeys.EXPIRES,dateToString(new Date()))
      })
      // await baseService.getUser().then(resp => {
      //   globalStore.setUser(resp[1])
      // })
      router.push('browser')
    })
    .catch((error) => {
      console.log('Error : ',error)
    })
  }
}
</script>

<template>
  <VRow
    no-gutters
    class="auth-wrapper bg-surface"
  >
    <VCol
      md="8"
      class="d-none d-md-flex"
    >
      <div class="position-relative bg-background rounded-lg w-100 ma-8 me-0">
        <div class="d-flex align-center justify-center w-100 h-100">
          <VImg
            max-width="505"
            :src="authThemeImg"
            class="auth-illustration mt-16 mb-2"
          />
        </div>

        <VImg
          class="auth-footer-mask"
          :src="authThemeMask"
        />
      </div>
    </VCol>

    <VCol
      cols="12"
      md="4"
      class="auth-card-v2 d-flex align-center justify-center"
    >
      <VCard
        flat
        :max-width="500"
        class="mt-12 mt-sm-0 pa-4"
      >
        <VCardText>
          <VNodeRenderer
            :nodes="themeConfig.app.logo"
            class="mb-6"
          />
          <h4 class="text-h4 mb-1">
            Welcome to <span class="text-capitalize">{{ themeConfig.app.title }}</span> ! 
          </h4>
          <p class="mb-0">
            Please sign-in to your account.
          </p>
        </VCardText>
        <VCardText>
          <VForm 
            ref="refForm"
            @submit.prevent="login"
          >
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.userName"
                  autofocus
                  label="Username"
                  type="text"
                  placeholder=""
                  :rules="[customRequiredValidator]"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.password"
                  label="Password"
                  placeholder="············"
                  :rules="[customRequiredValidator]"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <!-- <div class="d-flex align-center flex-wrap justify-space-between mt-2 mb-4"> -->
                  <!-- <VCheckbox
                    v-model="form.remember"
                    label="Remember me"
                  />
                  <a
                    class="text-primary ms-2 mb-1"
                    href="#"
                  >
                    Forgot Password?
                  </a>
                </div> -->

                <VBtn
                  block
                  type="submit"
                >
                  Login
                </VBtn>
              </VCol>

              <!-- create account -->
              <!-- <VCol
                cols="12"
                class="text-center text-base"
              >
                <span>New on our platform?</span>

                <a
                  class="text-primary ms-2"
                  href="#"
                >
                  Create an account
                </a>
              </VCol>

              <VCol
                cols="12"
                class="d-flex align-center"
              >
                <VDivider />

                <span class="mx-4">or</span>

                <VDivider />
              </VCol> -->

              <!-- auth providers -->
              <!-- <VCol
                cols="12"
                class="text-center"
              >
                <AuthProvider />
              </VCol> -->
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

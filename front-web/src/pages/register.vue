<script setup lang="ts">
import { router } from '@/plugins/1.router';
import { BaseService } from '@/services/main/base-service'

const baseService = new BaseService()
const username = ref('')
const first_name = ref('')
const last_name = ref('')
const password = ref('')
async function register() {
  await baseService.register(
    username.value,
    first_name.value,
    last_name.value,
    password.value,
  )
  router.push('login')
}

const isPasswordVisible = ref(false)
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <div class="position-relative my-sm-16">
      <!-- 👉 Top shape -->
      <!-- 👉 Auth card -->
      <VCard
        class="auth-card pa-4"
        max-width="448"
        title="Register"
      >
        <VCardText>
          <VForm @submit.prevent="register">
            <VRow>
              <!-- Username -->
              <VCol cols="12">
                <AppTextField
                  v-model="username"
                  autofocus
                  label="Username"
                  placeholder="Johndoe"
                />
              </VCol>
              <!-- email -->
              <VCol cols="12">
                <AppTextField
                  v-model="first_name"
                  label="First Name"
                  placeholder="John"
                />
              </VCol>
              <VCol cols="12">
                <AppTextField
                  v-model="last_name"
                  label="Last Name"
                  placeholder="Doe"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <AppTextField
                  v-model="password"
                  label="Password"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <VBtn
                  block
                  type="submit"
                >
                  Sign up
                </VBtn>
              </VCol>

              <!-- login instead -->
              <VCol
                cols="12"
                class="text-center text-base"
              >
                <span>Already have an account?</span>
                <RouterLink
                  class="text-primary ms-2"
                  :to="{ name: 'login' }"
                >
                  Sign in instead
                </RouterLink>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </div>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

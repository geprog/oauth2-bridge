<template>
  <div class="flex flex-col justify-center h-screen">
    <h1 class="text-center font-bold text-2xl cursor-pointer">
      OAuth2 Bridge
    </h1>
    <PageContent title="Sign in to your account">
      <UForm
        :state="state"
        class="space-y-2 text-center"
        @submit="login"
      >
        <UInput
          v-model="state.password"
          color="primary"
          variant="outline"
          type="password"
          placeholder="Your authentication token"
          size="lg"
        />

        <UButton
          type="submit"
          class="text-center"
        >
          Login
        </UButton>
      </UForm>
    </PageContent>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: false })
const state = reactive({ password: '' })

async function login() {
  await $fetch('/api/auth/login', {
    method: 'POST',
    body: state,
  })
  await navigateTo('/')
}
</script>

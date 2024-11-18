<template>
  <main class="m-4">
    <div class="relative">
      <h1
        class="text-center font-bold text-2xl cursor-pointer"
        @click="navigateTo('/')"
      >
        OAuth2 Bridge
      </h1>
      <UButton
        class="absolute top-0 right-0"
        @click="logout"
      >
        Logout
      </UButton>
    </div>
    <slot />
  </main>
</template>

<script setup lang="ts">
async function logout() {
  window.location.href = '/api/auth/logout'
}
</script>

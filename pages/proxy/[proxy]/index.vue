<template>
  <PageContent title="Proxy details">
    <LoadingAnimation v-if="status === 'pending'" />
    <ProxyForm
      v-else-if="proxy"
      v-model:proxy="proxy"
      read
      class="w-full"
      @submit="navigateTo(`/proxy/${proxy.name}/edit`)"
      @cancel="navigateBack"
    />
  </PageContent>
</template>

<script setup lang="ts">
import LoadingAnimation from '~/components/LoadingAnimation.vue'

const route = useRoute()

const { data: proxy, status } = await useLazyFetch(`/api/proxies/${route.params.proxy}`)

async function navigateBack() {
  await navigateTo('/')
}
</script>

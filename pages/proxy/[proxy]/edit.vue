<template>
  <PageContent title="Proxy details">
    <LoadingAnimation v-if="status === 'pending'" />
    <ProxyForm
      v-else-if="proxy"
      v-model:proxy="proxy"
      class="w-full"
      @cancel="navigateBack"
      @submit="save"
    />
  </PageContent>
</template>

<script setup lang="ts">
import LoadingAnimation from '~/components/LoadingAnimation.vue'
import type { FormSubmitEvent } from '#ui/types'
import type { Proxy } from '~/model/proxy'

const route = useRoute()
const proxyName = route.params.proxy

const { data: proxy, status } = await useLazyFetch(`/api/proxies/${proxyName}`)

async function navigateBack() {
  await navigateTo(proxy.value ? `/proxy/${proxy.value.name}` : '/')
}

const saving = ref(false)

async function save(event: FormSubmitEvent<Proxy>) {
  try {
    saving.value = true
    await $fetch(`/api/proxies/${proxyName}`, { method: 'POST', body: event.data })
    useToast().add({
      title: 'Proxy updated',
    })
    await navigateBack()
    saving.value = false
  }
  catch (error) {
    console.error('Error at updating proxy', error)
    useToast().add({
      title: 'Updating proxy failed',
      description: error instanceof Error ? error.message : `${error}`,
    })
  }
}
</script>

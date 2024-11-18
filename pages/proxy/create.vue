<template>
  <PageContent title="Create new proxy">
    <ProxyForm
      v-model:proxy="proxy"
      class="w-full"
      :submitting="saving"
      @submit="save"
      @cancel="navigateBack"
    />
  </PageContent>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import type { Proxy } from '~/model/proxy'

const proxy = ref<Proxy>({
  name: '',
  authorizationUri: '',
  tokenUri: '',
  allowedRedirectUris: [],
})

async function navigateBack() {
  await navigateTo('/')
}

const saving = ref(false)

async function save(event: FormSubmitEvent<Proxy>) {
  try {
    saving.value = true
    const savedProxy = await $fetch('/api/proxies', { method: 'POST', body: event.data })
    useToast().add({
      title: 'Proxy created',
    })
    await navigateTo(`/proxy/${savedProxy.name}`)
    saving.value = false
  }
  catch (error) {
    console.error('Error at creating proxy', error)
    useToast().add({
      title: 'Creating proxy failed',
      description: error instanceof Error ? error.message : `${error}`,
    })
  }
}
</script>

<template>
  <PageContent title="Proxies">
    <UButton to="/proxy/create">
      New proxy
    </UButton>
    <UTable
      class="w-full"
      :columns
      :rows="proxies || []"
      :loading="proxiesStatus === 'pending'"
      @select="openProxy"
    />
  </PageContent>
</template>

<script setup lang="ts">
import type { Proxy } from '~/model/proxy'

const { data: proxies, status: proxiesStatus } = useLazyFetch('/api/proxies')

const columns = [{ key: 'name', label: 'Name' }]

async function openProxy(proxy: Proxy) {
  await navigateTo(`/proxy/${proxy.name}`)
}
</script>

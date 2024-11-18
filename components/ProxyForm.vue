<template>
  <UForm
    :schema
    :state="proxy"
    class="space-y-4"
    @submit="$emit('submit', $event)"
  >
    <UFormGroup
      label="Name"
      name="name"
    >
      <UInput
        v-if="!read"
        :model-value="proxy.name"
        @update:model-value="$emit('update:proxy', { ...proxy, name: $event })"
      />
      <div v-else>
        {{ proxy.name }}
      </div>
    </UFormGroup>

    <UFormGroup
      label="Authorization URI"
      name="authorizationUri"
    >
      <UInput
        v-if="!read"
        :model-value="proxy.authorizationUri"
        type="url"
        @update:model-value="$emit('update:proxy', { ...proxy, authorizationUri: $event })"
      />
      <div v-else>
        {{ proxy.authorizationUri }}
      </div>
    </UFormGroup>

    <UFormGroup
      label="Token URI"
      name="tokenUri"
    >
      <UInput
        v-if="!read"
        :model-value="proxy.tokenUri"
        type="url"
        @update:model-value="$emit('update:proxy', { ...proxy, tokenUri: $event })"
      />
      <div v-else>
        {{ proxy.tokenUri }}
      </div>
    </UFormGroup>

    <UFormGroup
      label="Allowed Redirect-URIs"
    >
      <div class="space-y-2">
        <template
          v-for="(allowedRedirectUri, index) of proxy.allowedRedirectUris"
          :key="index"
        >
          <div
            v-if="!read"
            class="flex w-full gap-2"
          >
            <div>{{ index + 1 }}:</div>
            <UInput
              :model-value="allowedRedirectUri"
              type="url"
              class="flex-grow"
              @update:model-value="updateRedirectUri(index, $event)"
            />
            <UButton @click="deleteRedirectUri(index)">
              Löschen
            </UButton>
          </div>
          <div v-else>
            {{ index + 1 }}: {{ allowedRedirectUri }}
          </div>
        </template>
        <UButton
          v-if="!read"
          @click="addRedirectUri"
        >
          Add Redirect-URI
        </UButton>
      </div>
    </UFormGroup>

    <UAlert
      v-if="read"
      color="yellow"
      variant="subtle"
      title="API-Token"
      :description="apiToken
        ? `Your API-Token is '${apiToken}'. This is the only time it is visible so make sure to save it somewhere safe.`
        : 'API-Token not visible. If you lost your API-Token generate a new one. This makes the previous existing one obsolete.'"
      :actions="[
        { label: '(Re-)Generate API-Token', color: 'orange', variant: 'solid', click: generateApiToken, loading: apiTokenStatus === 'pending' },
      ]"
    />

    <div class="flex justify-between">
      <UButton
        :disabled="submitting"
        @click="$emit('cancel')"
      >
        {{ read ? 'Back' : 'Cancel' }}
      </UButton>
      <UButton
        type="submit"
        :loading="submitting"
      >
        {{ read ? 'Edit' : 'Submit' }}
      </UButton>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import { Proxy as schema } from '~/model/proxy'
import type { Proxy } from '~/model/proxy'
import type { FormSubmitEvent } from '#ui/types'

const proxy = defineModel<Proxy>('proxy', { required: true })

defineProps<{ submitting?: boolean, read?: boolean }>()

const emit = defineEmits<{ 'submit': [FormSubmitEvent<Proxy>], 'cancel': [], 'update:proxy': [Proxy] }>()

function addRedirectUri() {
  emit('update:proxy', {
    ...proxy.value,
    allowedRedirectUris: [...proxy.value.allowedRedirectUris, ''],
  })
}

function updateRedirectUri(index: number, redirectUri: string) {
  emit('update:proxy', {
    ...proxy.value,
    allowedRedirectUris: [
      ...proxy.value.allowedRedirectUris.slice(0, index),
      redirectUri,
      ...proxy.value.allowedRedirectUris.slice(index + 1),
    ],
  })
}

function deleteRedirectUri(index: number) {
  emit('update:proxy', {
    ...proxy.value,
    allowedRedirectUris: [
      ...proxy.value.allowedRedirectUris.slice(0, index),
      ...proxy.value.allowedRedirectUris.slice(index + 1),
    ],
  })
}

const { data: apiToken, status: apiTokenStatus, refresh: generateApiToken } = useFetch(`/api/proxies/${proxy.value.name}/apitoken`, { immediate: false })
</script>

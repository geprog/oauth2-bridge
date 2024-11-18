<template>
  <section class="flex flex-col gap-2 items-center w-full">
    <h2 class="font-bold text-lg">
      {{ title }}
    </h2>
    <slot />
  </section>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
</script>

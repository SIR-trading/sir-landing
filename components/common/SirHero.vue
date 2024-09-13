<script setup lang="ts">
  defineProps<{
    image?: string
  }>()
</script>

<template>
  <div>
    <div class="flex flex-col items-center justify-center p-0">
      <picture v-if="image">
        <img :src="image" alt="Hero Image">
      </picture>

        <h1 class="text-4xl title text-center">
          <slot name="title"/>
        </h1>
    </div>
  </div>
</template>

<style scoped></style>

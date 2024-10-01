<script setup lang="ts">
  defineProps<{
    image?: string
  }>()
</script>

<template>
  <div>
    <div class="flex flex-col items-center justify-center p-0">
      <picture v-if="image" class="p-0 w-full md:w-[760px]">
        <img :src="image" alt="Hero Image">
      </picture>
        <h1 class="text-4xl title text-center mt-3">
          <slot name="title"/>
        </h1>
    </div>
  </div>
</template>

<style scoped></style>

<script setup lang="ts">
  defineProps<{
    image?: string
  }>()
</script>

<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-center">
      <div class="col-span-2 flex flex-col md:flex md:gap-3">
        <h1 class="text-6xl title">
          <slot name="title"/>
        </h1>
        <h2 class="text-gray-400 subtitle">
          <slot name="description"/>
        </h2>
      </div>
      <picture v-if="image">
        <img :src="image" alt="">
      </picture>
    </div>
  </div>
</template>

<style scoped></style>

<script lang="ts" setup>
defineProps<{
  image?: string
  imageAlt?: string
}>()
</script>

<template>
 <div class="card">
   <div v-if="image">
     <img :src="image" class="rounded-lg" :alt="imageAlt"/>
   </div>
   <h4 class="mt-2"><slot name="header"/></h4>
   <div class="text-gray-500 mt-2 text-xl flex flex-col gap-3"><slot name="default"/></div>
   <div><slot name="footer"/></div>
 </div>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 400px;
}
</style>

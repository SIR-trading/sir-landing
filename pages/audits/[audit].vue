<script setup lang="ts">
const route = useRoute();

const audit = route.params?.audit;
</script>
<template>
  <div class="w-full px-[20px] py-[20px] h-full">
    <iframe class="rounded-lg w-full min-h-[65vh]" :src="`/${audit}.pdf`"></iframe>
  </div>
</template>

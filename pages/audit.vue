<script setup lang="ts">
const {data: pdf, status, refresh} = await useFetch<string>('/api/audit');
</script>

<template>
  <UContainer class="flex flex-col items-center p-[1rem] gap-12 w-full justify-center screen-90-percent bg-black-russian-950 rounded-lg">
    <div v-if="status === 'pending'">Loading...</div>
    <div v-else-if="status === 'error'">Error :(</div>
    <div v-else-if="status === 'success'" class="w-full p-12 screen-90-percent">
      <iframe class="rounded-lg w-full min-h-[700px] md:min-h-full" src="/SIR_Audit_Report.pdf" ></iframe>
    </div>
  </UContainer>
</template>

<style scoped>
.screen-90-percent {
  height: calc(90vh - 2rem);
}
</style>


<script setup lang="ts">
import audits from "@/assets/audits.json"
type AuditOption = {
  label: string;
  to: string;
}

onMounted(() => useRouter().push("/audits/".concat(audits[0].to)))

/* 
  const audits: AuditOption[] = [
  {
    label: "Pre-Exploit",
    to: "pre-exploit",
  },
  {
    label: "Syzygy",
    to: "syzygy",
  }
]*/

const { data: pdf, status, refresh } = await useFetch<string>('/api/audit');
</script>

<template>
  <UContainer
    class="flex flex-col items-center gap-12 w-full justify-center screen-90-percent bg-black-russian-950 rounded-lg">
    <div class="justify-center mt-12">
      <UHorizontalNavigation :links="audits as AuditOption[]" />
    </div>
    <NuxtPage />
  </UContainer>
</template>

<style scoped>
.screen-90-percent {
  height: calc(90vh - 2rem);
}
</style>

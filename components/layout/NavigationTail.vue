<script setup lang="ts">

</script>

<template>
  <div class="w-full flex flex-row gap-2 md:gap-6 justify-around">
    <div class="flex flex-row gap-2 sm:gap-3 md:gap-4 lg:gap-6 justify-around items-center">
      <a href="https://x.com/leveragesir" target="_blank">
        <UIcon name="simple-icons:x" dynamic size="20px" class="text-white"/>
      </a>
      <a href="https://discord.gg/M2SRBDPUR2" target="_blank">
        <UIcon name="simple-icons:discord" dynamic size="24px" class="text-white"/>
      </a>
      <a href="https://github.com/SIR-trading" target="_blank">
        <UIcon name="simple-icons:github" dynamic size="24px" class="text-white"/>
      </a>
    </div>
    <UButton color="robRoy" variant="outline" :disabled="false" :external="true"
             to="https://prototype.sir.trading/">
      <span class="font-sm font-semibold">Launch Prototype</span>
    </UButton>
  </div>
</template>

<style scoped>

</style>
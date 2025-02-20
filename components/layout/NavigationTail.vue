<script setup lang="ts"></script>

<template>
  <div class="flex flex-col gap-6 md:gap-4 md:flex-row-reverse justify-around md:items-center">
    <div>
      <UButton color="robRoy" variant="outline" :disabled="false" :external="true"
               to="https://prototype.sir.trading/">
        <span class="font-sm font-semibold whitespace-nowrap">Launch Prototype</span>
      </UButton>
    </div>
    <div class="flex flex-row gap-2 sm:gap-3 md:gap-4 lg:gap-6 justify-around md:justify-center items-center">
      <ULink class="flex justify-self-center" to="https://x.com/leveragesir" target="_blank">
        <UIcon name="simple-icons:x" dynamic size="20px" class="text-white"/>
      </ULink>
      <ULink class="flex justify-self-center" to="https://discord.gg/M2SRBDPUR2" target="_blank">
        <UIcon name="simple-icons:discord" dynamic size="24px" class="text-white"/>
      </ULink>
      <ULink class="flex justify-self-center" to="https://github.com/SIR-trading" target="_blank">
        <UIcon name="simple-icons:github" dynamic size="24px" class="text-white"/>
      </ULink>
    </div>
  </div>
</template>

<style scoped></style>

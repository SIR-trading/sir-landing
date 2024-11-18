<script setup lang="ts">
import Section from "~/components/common/Section.vue";
import countries from "@/assets/country_blocklist.json"

</script>

<template>
  <UContainer>
    <Section variant="background">
      <template #header>Your country is blacklisted</template>
      <div class="section-text-block">
        It appears that you are trying to access the sale from a prohibited country.
        <ul class="mt-4 italic">
          <li v-for="country in countries" :key="country.code" class="flex flex-inline items-center justify-start">
            <UIcon name="i-heroicons:x-mark-solid" class="text-red-500 mr-1" />
            {{country.name}}
          </li>
        </ul>
      </div>
      <div class="w-full flex justify-center mt-8">
        <div class="w-[200px]">
          <UButton size="lg" block to="/" color="robRoy" class="font-bold" >Go back</UButton>
        </div>
      </div>
    </Section>
  </UContainer>
</template>

<style scoped></style>

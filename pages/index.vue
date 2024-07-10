<script setup lang="ts">
import Hero from '@/components/common/Hero.vue'
import Section from '@/components/common/Section.vue'
import SirHero from "~/components/common/SirHero.vue";
const links = [
  {
    name: 'Mint',
    to: '/mint',
    variant: 'outline'
  }
]
</script>
<template>
  <UContainer>
    <SirHero image="logo_240x240.png">
      <template #title >
        Safer Leverage for
        <span class="text-yellow-400">Long-term</span> Investors
      </template>
      <template #description>
        Get X by doing Y. On Z
      </template>
    </SirHero>
    <Section class-name="p-6 ring-gray-100 dark:ring-gray-800" variant="ring">
      <h5>Section Component</h5>
      <div class="p-4">
        <ul class="list-disc indent-2">
          <li>Allow for variants</li>
          <li>Slot implemented</li>
          <li>Highly customizable</li>
        </ul>
      </div>
    </Section>
  </UContainer>
</template>

<style scoped></style>

<script lang="ts" setup>
import {useDevice} from "~/composables/useDevice";
import Connect from "~/components/wallet/Connect.vue";

const {isMobile, isTablet} = useDevice();
const links = [
  // {name: "About", to: '/about'},
  // {name: 'Fundraising', to: '/fundraising'},
  {name: 'Docs', to: 'https://docs.sir.trading/', target:"_blank", trailing: 'uil:arrow-up-right'},
  // {name: 'Roadmap', to: '/mint'},
  // {name: 'Whitepaper', to: '/mint'}
];

const isMenuOpen = ref(false);
const toggleMenu = () => isMenuOpen.value = !isMenuOpen.value;

const colorMode = useColorMode();
colorMode.value = 'dark';

const goTo = (path: string) => {
  useRouter().push(path)
}

</script>

<template>
  <header class="w-full p-6">
    <ClientOnly>
      <UContainer>
        <nav class="flex flex-col text-sm font-semibold w-full gap-6 items-center justify-between md:flex-row md:justify-center">
          <div class="w-full flex flex-between md:w-auto">
            <div @click="goTo('/')" class="cursor-pointer flex flex-row flex-auto w-full items-center justify-around lg:justify-start lg:w-50">
              <picture class="logo md:flex flex-start">
                <NuxtImg src="favicon-32x32.png" alt="Logo" width="32" height="32"/>
              </picture>
              <div class="inline-flex text-brand ml-1 text-sm text-white">SIR.TRADING</div>
              <UButton color="white" variant="ghost" size="xl" v-show="isMobile || isTablet" @click="toggleMenu">
                <UIcon :name="isMenuOpen ? 'ep:close':'fluent-mdl2:numbered-list-text-mirrored'" dynamic size="24"/>
              </UButton>
            </div>
          </div>
          <div v-if="!isTablet || isMenuOpen" class="flex flex-auto flex-col gap-6 items-center justify-between lg:flex-row ">
            <div class="flex gap-6 flex-col lg:flex-row">
              <ULink v-for="link in links" :key="link.to"
                     :to="link.to"
                     :target="link.target ? link.target : ''"
                     active-class="text-primary"
                     inactive-class="text-blue-bell-500 dark:text-blue-bell-500 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <span class="left-0 p-0 h-full">
                  {{ link.name }}
                  <UIcon class="top-0 h-full" v-if="link.trailing" :name="link.trailing" dynamic size="12"/>
                </span>
              </ULink>
            </div>
            <div class="flex gap-6 flex-col lg:flex-row items-center">
              <a href="https://x.com/leveragesir" target="_blank">
                <UIcon name="simple-icons:x" dynamic size="20px" class="text-white"/>
              </a>
              <a href="https://discord.gg/JpJtBFvQj8" target="_blank">
                <UIcon name="simple-icons:discord" dynamic size="24px" class="text-white"/>
              </a>
              <a href="https://github.com/SIR-trading" target="_blank">
                <UIcon name="simple-icons:github" dynamic size="24px" class="text-white"/>
              </a>
              <UButton color="gray" variant="outline" :disabled="true">
                <span class="font-sm font-semibold">Launch Prototype</span>
              </UButton>

            </div>
          </div>
        </nav>
      </UContainer>
    </ClientOnly>
  </header>
</template>

<style scoped>
connect {
  border-top: 1px solid white;
  display: flex;
  justify-self: flex-end;
  justify-content: flex-end;
}


</style>

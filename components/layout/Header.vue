<script lang="ts" setup>
import {useDevice} from "~/composables/useDevice";
import Connect from "~/components/wallet/Connect.vue";

const {isMobile, isTablet} = useDevice();

declare type Link = {
  name: string,
  to: string,
  trailing?: string,
}

const links: Array<Link> = [
  // {name: "About", to: '/about'},
  {name: 'Sale', to: '/sale'},
  {name: 'Docs', to: 'https://docs.sir.trading/', trailing: 'uil:arrow-up-right'},
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
  <header class="w-full px-6 mt-[24px] mb-[48px]">
    <ClientOnly>
      <UContainer>
        <nav class="flex flex-col text-sm font-semibold w-full gap-6 items-center justify-between md:flex-row md:justify-center">
          <div class="w-full flex flex-between md:w-auto">
            <div @click="goTo('/')" class="cursor-pointer flex flex-row flex-auto w-full items-center justify-around lg:justify-start lg:w-50">
              <picture class="logo md:flex flex-start">
                <NuxtImg src="logo.png" alt="Logo" width="32" height="32"/>
              </picture>
              <div class="inline-flex text-brand ml-1 text-sm text-white">SIR.TRADING</div>
              <UButton color="white" variant="ghost" size="xl" v-show="isMobile || isTablet" @click="toggleMenu">
                <UIcon :name="isMenuOpen ? 'ep:close':'fluent-mdl2:numbered-list-text-mirrored'" dynamic size="24"/>
              </UButton>
            </div>
          </div>
          <div v-if="!isTablet || isMenuOpen" class="flex flex-auto flex-col gap-6 items-center justify-between lg:flex-row ">
            <div class="flex gap-6 flex-col lg:flex-row lg:items-center">
              <ULink v-for="link in links" :key="link.to"
                     :to="link.to"
                     :target="link.target ? link.target : ''"
                     active-class="text-primary"
                     inactive-class="text-cameo-300 dark:text-cameo-300 hover:text-cameo-500 dark:hover:text-rob-roy-300"
              >
                <span class="left-0 p-0 h-full">
                  {{ link.name }}
                </span>
                <UIcon v-if="link.trailing" :name="link.trailing" dynamic size="12px" class="right-0 top-0"/>
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
              <UButton color="robRoy" variant="outline" :disabled="false" :external="true" to="https://prototype.sir.trading/">
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

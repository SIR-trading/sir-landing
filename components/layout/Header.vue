<script lang="ts" setup>
import { useDevice } from "~/composables/useDevice";
import Connect from "~/components/wallet/Connect.vue";

const {isMobile, isTablet} = useDevice();

declare type Link = {
  label: string,
  to: string,
  icon?: string,
}

const links: Array<any> = [
  // {name: "About", to: '/about'},
  {label: 'Sale', to: '/sale'},
  {label: 'Docs', to: 'https://docs.sir.trading/'},
  // {label: '', to: 'https://x.com/leveragesir', icon: 'i-simple-icons:x', type: 'social'},
  // {label: '', to: 'https://x.com/leveragesir', icon: 'i-simple-icons:discord', type: 'social'},
  // {label: '', to: 'https://x.com/leveragesir', icon: 'i-simple-icons:github', type: 'social'},
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
    <UContainer>
      <nav
          class="flex flex-col text-sm font-semibold w-full gap-6 items-center justify-start md:flex-row md:justify-center">
        <div class="w-full flex flex-between items-center justify-between md:w-auto">
          <div @click="goTo('/')"
               class="cursor-pointer flex flex-row flex-auto w-full items-center justify-around md:justify-start md:w-50">
            <picture class="logo md:flex flex-start">
              <img src="/logo.png" alt="Logo" size="24px" class="min-h-8 min-w-8 w-8 h-8"/>
            </picture>
            <div class="inline-flex text-brand ml-1 text-sm text-white">SIR.TRADING</div>
            <div class="block md:hidden rounded-lg" :class="{ 'bg-black-russian-950': isMenuOpen, 'bg-transparent': !isMenuOpen}">
              <UButton v-if="isMenuOpen" color="white" variant="link" @click="toggleMenu">
                <UIcon :name="'i-heroicons:x-mark'" dynamic class="w-6 h-6"/>
              </UButton>
              <UButton v-else color="white" variant="link" @click="toggleMenu">
                <UIcon :name="isMenuOpen ? 'i-heroicons:x-mark':'i-heroicons:bars-3-solid'" dynamic class="w-6 h-6"/>
              </UButton>
            </div>
          </div>
        </div>
        <div v-if="isMenuOpen"
             class="bg-black-russian-950 rounded-lg w-full p-4 flex flex-auto flex-col gap-4 items-center justify-between md:hidden ">
          <UVerticalNavigation
              :links="links"
              class="w-full flex justify-center"
              :ui="{
                  label: 'truncate relative text-2xl',
                  active: 'text-primary dark:text-primary before:bg-transparent dark:before:bg-transparent',
                  inactive: 'text-cameo-700 dark:text-cameo-300 hover:text-gray-900 dark:hover:text-white'
              }"
          >
            <template #default="{ link }">
              <span :class="{ 'text-white': link.type === 'social'}">
                {{ link.label }}

              </span>
            </template>

          </UVerticalNavigation>
          <LayoutNavigationTail />
        </div>
        <div class="w-full flex-row gap-6 items-center justify-between hidden md:flex">
          <UHorizontalNavigation :links="links" class="w-full" :ui="{
              label: 'truncate relative p-1 text-md',
              active: 'text-primary dark:text-primary before:bg-transparent dark:before:bg-transparent',
              after: '',
              inactive: 'text-cameo-700 dark:text-cameo-300 dark:hover:text-white'
          }">
            <template #icon="{ link }">
              <span :class="{ 'text-white': link.type === 'social'}">
              </span>
            </template>
          </UHorizontalNavigation>
          <LayoutNavigationTail />
        </div>
      </nav>
    </UContainer>
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

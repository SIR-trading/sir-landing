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
  {label: 'Sale', to: '/sale', icon: 'i-heroicons:arrow-trending-up', type: 'link'},
  {label: 'Docs', to: 'https://docs.sir.trading/', icon: 'i-heroicons:document-text', type: 'link'},
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
             class="bg-black-russian-950 rounded-lg w-full p-6 flex flex-auto flex-col gap-6 items-center justify-between md:hidden ">
          <UVerticalNavigation
              :links="links"
              class="w-full"
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
            <template #icon="{ link }">
              <span :class="{ 'text-white': link.type === 'social'}">
                <UIcon :name="link.icon" dynamic class="w-4 h-4 right-0 top-0"/>

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
          <!--          <div class="w-full p-6 flex gap-6 flex-col  lg:flex-row lg:items-center text-2xl lg:text-base">-->
          <!--            <UButton variant="link" v-for="link in links" :key="link.to"-->
          <!--                     :to="link.to"-->
          <!--                     active-class="text-primary"-->
          <!--                     inactive-class="text-cameo-300 dark:text-cameo-300 hover:text-cameo-500 dark:hover:text-rob-roy-300"-->
          <!--            >-->
          <!--              <template #default>-->
          <!--                {{ link.name }}-->
          <!--              </template>-->
          <!--              <template #trailing>-->
          <!--                <UIcon v-if="link.icon" :name="link.icon" dynamic class="w-3 h-3 right-0 top-0"/>-->
          <!--              </template>-->
          <!--            </UButton>-->
          <!--          </div>-->
          <!--          <div class="flex flex-col gap-6">-->
          <!--            <div class="flex flex-row  md:gap-4 lg:gap-6 justify-around items-center">-->
          <!--              <a href="https://x.com/leveragesir" target="_blank">-->
          <!--                <UIcon name="simple-icons:x" dynamic size="20px" class="text-white"/>-->
          <!--              </a>-->
          <!--              <a href="https://discord.gg/M2SRBDPUR2" target="_blank">-->
          <!--                <UIcon name="simple-icons:discord" dynamic size="24px" class="text-white"/>-->
          <!--              </a>-->
          <!--              <a href="https://github.com/SIR-trading" target="_blank">-->
          <!--                <UIcon name="simple-icons:github" dynamic size="24px" class="text-white"/>-->
          <!--              </a>-->
          <!--            </div>-->
          <!--            <UButton color="robRoy" variant="outline" :disabled="false" :external="true"-->
          <!--                     to="https://prototype.sir.trading/">-->
          <!--              <span class="font-sm font-semibold">Launch Prototype</span>-->
          <!--            </UButton>-->
          <!--          </div>-->
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

<script lang="ts" setup>
import {useDevice} from "~/composables/useDevice";
import Connect from "~/components/wallet/Connect.vue";

const {isMobile, isTablet} = useDevice();
const links = [
  {name: "About", to: '/about'},
  {name: 'Fundraising', to: '/fundraising'},
  {name: 'Docs', to: '/mint'},
  {name: 'Roadmap', to: '/mint'},
  {name: 'Whitepaper', to: '/mint'}
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
                <NuxtImg src="logo_base_64x64.png" alt="Logo" width="32" height="32"/>
              </picture>
              <div class="font-['Lora'] inline-flex ml-1 text-sm text-white">Sir.Trading</div>
              <button v-show="isMobile || isTablet" @click="toggleMenu">
                <UIcon :name="isMenuOpen ? 'ep:close':'fluent-mdl2:numbered-list-text-mirrored'" dynamic/>
              </button>
            </div>
          </div>
          <div v-if="!isTablet || isMenuOpen" class="flex flex-auto flex-col gap-6 items-center justify-between lg:flex-row ">
            <div class="flex gap-6 flex-col lg:flex-row">
              <ULink v-for="link in links" :key="link.to"
                     :to="link.to"
                     active-class="text-primary"
                     inactive-class="text-blue-bell-500 dark:text-blue-bell-500 hover:text-gray-700 dark:hover:text-gray-200"
              >{{ link.name }}
              </ULink>
            </div>
            <div class="flex gap-6 flex-col lg:flex-row items-center">
              <a href="https://twitter.com" target="_blank">
                <UIcon name="simple-icons:twitter" dynamic size="24px" class="text-white"/>
              </a>
              <a href="https://discord.gg/JpJtBFvQj8" target="_blank">
                <UIcon name="simple-icons:discord" dynamic size="24px" class="text-white"/>
              </a>
              <UButton color="white" variant="outline" :disabled="true">
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

.logo {
  display: flex;
  width: 100%;
  max-height: 75px;
  max-width: 75px;

  & img {
    width: 100%;
    height: 100%;
    border-radius: 5px;
  }
}
</style>

<script lang="ts" setup>
import Section from "~/components/common/Section.vue";
import Modal from "~/components/common/Modal.vue";
import type {TWalletCookie} from "~/types";

const isModalOpen: Ref<boolean> = ref(true)

import {useWallet} from "~/composables/useWallet";
const walletStore = useWallet()
const {isConnected, hasAgreed, address} = walletStore

const agreed = ref(null)

const toggleModal= () => {
  isModalOpen.value = !isModalOpen.value
}

const agreeToDisclaimer = () => {
  if(!isConnected.value) return;
  localStorage.setItem(`wallet-${address.value}`, JSON.stringify({at: new Date()}))
  isModalOpen.value = false
  console.log(isModalOpen.value)
}

</script>

<template>
  <Section variant="background">
    <Modal :is-visible="isModalOpen" @click="isModalOpen = false" @close="toggleModal">
      <div class="p-6 flex flex-col gap-3">
        <p class="">

          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
          dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
          ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
          anim id est laborum.
        </p>
        <p>

          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
          dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
          ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
          anim id est laborum.
        </p>
        <p>

          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
          dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
          ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
          anim id est laborum.
        </p>
        <p>

          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
          dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
          ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
          anim id est laborum.
        </p>
        <div class="flex flex-col gap-3">
          <UCheckbox v-model="agreed" name="disclaimerAgreement" label="I understand and agree." />
          <UButton @click="agreeToDisclaimer" :disabled="!agreed" label="Agree to Disclaimer" />

        </div>
      </div>
    </Modal>
  </Section>
</template>

<style scoped></style>

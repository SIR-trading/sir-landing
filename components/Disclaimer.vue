<script lang="ts" setup>
import Modal from "~/components/common/Modal.vue";

import {useWallet} from "~/composables/useWallet";

const emits = defineEmits(['statusChanged', 'close'])

const {isConnected, address} = useWallet()

const walletStore = useWalletStore()
const agreed = ref(null)

const hasAgreed = computed(() => {
  return walletStore.hasAgreed
})

const isModalOpen: Ref<boolean> = ref(!hasAgreed.value )

const toggleModal= () => {
  isModalOpen.value = !isModalOpen.value
  if(!isModalOpen.value) {
    emits('close');
  }
}

const agreeToDisclaimer = () => {
  if(!isConnected.value) return;
  localStorage.setItem(`wallet-${address.value}`, JSON.stringify({at: new Date()}))
  isModalOpen.value = false
  agreed.value = true
  emits('statusChanged')
}


</script>

<template>
    <Modal class-list="" :is-visible="isModalOpen" @click="isModalOpen = false" @close="toggleModal">

      <div class="modal-content text-center md:text-left p-6 flex flex-col gap-6 text-md max-w-[1000px]">
        <h1 class="text-[2.5rem] sir-text-shadow section-header mb-4">Disclaimer</h1>
        <p class="">
          By participating in the funding of SIR ("the Protocol"), you acknowledge and agree to the following terms:
        </p>
        <p class="flex flex-col">
          <span class="font-bold text-white">Trustless Launch:</span>
          <span>The Protocol will be launched in a trustless manner, meaning that once the launch has occurred, the token allocations are immutable and cannot be altered by the team or any other entity. This ensures a decentralized and transparent distribution process.</span>
        </p>
        <p class="flex flex-col">
          <span class="font-bold text-white">Risk of Bugs and Attacks:</span>
          <span>While the development team will make all reasonable efforts to minimize bugs and vulnerabilities through thorough testing and, where possible, independent audits, it is impossible to guarantee the complete absence of bugs or vulnerabilities. By participating, you acknowledge that the Protocol may be subject to bugs, vulnerabilities, or attacks that could result in partial or total loss of your funds. The development team, contributors, and associated parties shall not be held liable for any loss or damage arising from bugs, vulnerabilities, or attacks.</span>
        </p>
       <p class="flex flex-col">
          <span class="font-bold text-white">Value of Token SIR: </span>
          <span>The value of the token SIR is highly volatile and can be influenced by a variety of factors beyond the control of the development team, including market conditions, regulatory changes, and technological advancements. The development team does not guarantee any specific value of the token SIR and is not responsible for any loss of value or potential loss of funds associated with the token SIR.</span>
        </p>
       <p class="flex flex-col">
          <span class="font-bold text-white">Not financial advice:</span>
          <span>The information provided on the Protocol's website and in related materials is for informational purposes only and does not constitute financial, investment, or other professional advice. Participation in the funding of the Protocol should be based on your own research and assessment of the risks involved.</span>
        </p>
        <p class="flex flex-col">
          <span class="font-bold text-white">Legal Compliance:</span>
          <span>It is your responsibility to ensure that your participation in the funding of the Protocol complies with all applicable laws and regulations in your jurisdiction. The development team is not responsible for any legal consequences arising from your participation.
Acceptance of Risks: By participating in the funding of the Protocol, you accept all risks associated with your participation, including but not limited to financial loss, regulatory risk, and technical risks. You agree that you are participating at your own risk and that the development team, contributors, and associated parties shall not be held liable for any loss or damage arising from your participation.</span>
        </p>
        <p class="italic">
          By proceeding with the funding of SIR, you acknowledge that you have read, understood, and agreed to this disclaimer in its entirety.
        </p>
        <div class="flex flex-col gap-3">
          <UCheckbox v-model="agreed" name="disclaimerAgreement" label="I understand and agree." />
          <UButton
              @click="agreeToDisclaimer" :disabled="!agreed"
              color="robRoy" variant="solid"
          >
            Confirm
          </UButton>

        </div>
      </div>
    </Modal>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;


.modal-content {
  max-height: 70vh;
  overflow-y: auto;
}
.modal-content::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: radial-gradient(circle, rgba(155, 155, 155, 0.1) 0%, transparent 100%);
  border-radius: 8px;
  pointer-events: none;
}
@media (max-width: 1024px) {
  .modal-content {
    max-height: 60vh;
  }
}

@media (max-width: 768px) {
  .modal-content {
    max-height: 50vh;
  }
}

</style>

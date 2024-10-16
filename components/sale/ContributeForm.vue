<script setup lang="ts">
import { type Ref, ref, computed, onMounted } from 'vue';
import { type Token } from "@/types";
import { ethers } from "ethers";
import tokens from "@/assets/token_list.json";
import { useWallet } from "~/composables/useWallet";
import { useErc20 } from "~/composables/useErc20";
import { useEthClient } from "~/composables/useEthClient";
import { Stablecoin } from "@/types/data";
import { useNfts } from "~/composables/useNfts";
import { useSaleStore } from "~/stores/sale";
import { useWalletStore } from "~/stores/wallet";
import {asyncComputed} from "@vueuse/core";
import {useOnboard} from "@web3-onboard/vue";

const amount = ref(0);
const selected: Ref<Token> = ref(tokens[1]);

const blackRussian = {
  color: {
    blackRussian: {
      outline: 'shadow-sm bg-white dark:bg-black-russian-950 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400',
    }
  }
};

const erc20 = useErc20();
const { approveErc20, isErc20Approved, fetchBalance } = erc20;
const balance = ref(0);

const { address, isConnected } = useWallet();
const { checkAgreed } = useWalletStore();

/**
 * Handles change in selected token and updates the balance.
 */
const handleChange = async () => {
  if (isConnected.value && selected.value) {
    balance.value = await fetchBalance(selected.value, address.value).then((val) => {
      return ethers.formatUnits(val.toString(), selected.value.decimals);
    });
  }
};

/**
 * Sets the amount based on a percentage of the balance.
 * @param {number} percent - The percentage of the balance to set as the amount.
 */
const amountTo = (percent: number) => {
  amount.value = Math.round(balance.value * percent / 100);
};

const isApproved = ref(true);

/**
 * Checks whether the selected token amount is approved for the specified amount.
 */
const checkApproval = async () => {
  isApproved.value = await isErc20Approved(selected.value, amount.value);
};

const nfts = useNfts();
const { setApprovalForAll, isApprovedForAll } = nfts;

/**
 * Approves the selected ERC20 token.
 */
const approve = async () => {
  await approveErc20(selected.value, amount.value);
  await checkApproval();
};

const showModal: Ref<boolean> = ref(false);

const { depositAndLockNfts, lockNfts } = useEthClient();
const config = useRuntimeConfig().public;

const { buterinCards, minedJpeg } = config;
const saleStore = useSaleStore();


/**
 * Displays agreement modal.
 */
const getAgreement = () => {
  showModal.value = true;
}

const hasAgreed = computed(() => {
  return useWalletStore().hasAgreed;
})

const emit = defineEmits(['refresh']);

/**
 * Executes the contribution process.
 */
const contribute = async () => {
  console.log("contribute()");

  if (hasAgreed.value) {
    const coins = Stablecoin;
    // Approve Buterin Cards if not already approved
    const { address } = useWallet();
    if (saleStore.buterinCardsSelected.length > 0) {
      const isApproved = await isApprovedForAll(config.buterinCards, address.value);
      if (!isApproved) {
        await setApprovalForAll(buterinCards);
      }
    }
    // Approve Mined Jpegs if not already approved
    if (saleStore.minedJpegsSelected.length > 0) {
      const isApproved = await isApprovedForAll(config.minedJpeg, address.value);
      if (!isApproved) {
        await setApprovalForAll(minedJpeg);
      }
    }
    // Deposit and Lock
    await depositAndLockNfts(coins[selected.value.ticker], amount.value, saleStore.buterinCardsSelected, saleStore.minedJpegsSelected);
    setTimeout(() => {
      emit('refresh');
      saleStore.fetchWalletContributions(address.value);
    }, 2000);
  }
};

/**
 * Determines if NFTs should be locked.
 */
const showLockNfts = computed(() => amount.value === 0 && saleStore.selectedItems.length > 0);

/**
 * Locks the selected NFTs.
 */
const doLockNfts = async () => {
  // Approve Buterin Cards if not already approved
  const { address } = useWallet();
  if (saleStore.buterinCardsSelected.length > 0) {
    const isApproved = await isApprovedForAll(config.buterinCards, address.value);
    if (!isApproved) {
      await setApprovalForAll(buterinCards);
    }
  }
  // Approve Mined Jpegs if not already approved
  if (saleStore.minedJpegsSelected.length > 0) {
    const isApproved = await isApprovedForAll(config.minedJpeg, address.value);
    if (!isApproved) {
      await setApprovalForAll(minedJpeg);
    }
  }
  await lockNfts(saleStore.buterinCardsSelected, saleStore.minedJpegsSelected);
  setTimeout(() => {
    emit('refresh');
    saleStore.fetchWalletContributions(address.value);
  }, 2000);
};

/**
 * Lifecycle hook that runs when the component is mounted.
 */
onMounted(() => {
  handleChange();
});


</script>

<template>
  <div class="flex flex-col items-stretch p-4 w-full">
    <UFormGroup class="w-full">
      <div class="w-full flex flex-row gap-3 bg-softGray rounded-md p-3">
        <div class="flex flex-col gap-2">
          <UInput v-model="amount" type="number" label="Amount" placeholder="100" variant="none"
                  @input="checkApproval"
          />
        </div>
        <div class="flex flex-col gap-2 items-end w-full">
          <div class="flex flex-row gap-0 items-center justify-end bg-black-russian-950 rounded-md p-2">
            <picture>
              <NuxtImg v-if="selected" :src="selected.icon" width="32" height="32"/>
            </picture>
            <UInputMenu v-model="selected" :options="tokens" option-attribute="name" class="max-w-[150px]"
                        :uiMenu="{ background: 'bg-white dark:bg-black-russian-950' }"
                        :variant="'none'"
                        :ui="blackRussian"
                        @change="handleChange"
            >
              <template #option="{ option: token }">
                <NuxtImg :src="token.icon" width="16" height="16"/>
                <span class="truncate">{{ token.name }}</span>
              </template>
            </UInputMenu>
          </div>
          <div class="text-sm italic">Balance: {{
              new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(balance)
            }}
          </div>
          <div class="flex flex-row gap-1 text-cyan text-sm font-semibold">
            <div role="button" @click="amountTo(25)">25%</div>
            <div role="button" @click="amountTo(50)">50%</div>
            <div role="button" @click="amountTo(100)">Max</div>
          </div>
        </div>
      </div>
      <div class="flex w-full gap-3 mt-3 justify-center items-center">
        <div v-if="!hasAgreed.value" class="flex w-full gap-3 mt-3 justify-center items-center">
          <button @click="getAgreement"
                  class="bg-rob-roy-300 text-black font-semibold rounded-md px-4 py-2 w-full text-center">
            <span class="inline-block">Agree to Terms</span>
          </button>
        </div>
        <div class="flex w-full gap-3 mt-3 justify-center items-center" v-else>
          <button v-if="isApproved.value && !showLockNfts.value" @click="contribute" :disabled="amount.value === 0"
                  class="bg-rob-roy-300 text-black font-semibold rounded-md px-4 py-2 w-10/12 text-center disabled:bg-gray-suit-700">
            Add contribution
          </button>
          <button v-if="!isApproved.value && !showLockNfts.value" @click="approve"
                  class="bg-rob-roy-300 text-black font-semibold rounded-md px-4 py-2 w-10/12 text-center">
            Approve
          </button>
          <button v-if="showLockNfts.value" @click="doLockNfts"
                  class="bg-rob-roy-300 text-black font-semibold rounded-md px-4 py-2 w-10/12 text-center">
            Lock NFTS
          </button>
        </div>
      </div>
    </UFormGroup>
    <Disclaimer v-if="showModal" @status-changed="checkAgreed"/>
  </div>
</template>

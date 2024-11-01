<script setup lang="ts">
import {type Ref, ref, computed, onMounted} from 'vue';
import {ethers} from "ethers";
import {useWallet} from "~/composables/useWallet";
import {useErc20} from "~/composables/useErc20";
import {useEthClient} from "~/composables/useEthClient";
import {Stablecoin, type Contribution} from "@/types/data";
import {useNfts} from "~/composables/useNfts";
import {useSaleStore} from "~/stores/sale";
import {useWalletStore} from "~/stores/wallet";
import type {Token} from "~/types/data";

const amount: Ref<string | number> = ref(0);
const {tokenList} = useEnv();
const selected: Ref<Token> = ref(tokenList[0]);

/**
 * Converts string ticker to Stablecoin enum.
 * @param {string} ticker - The ticker string to convert.
 * @returns {Stablecoin} The corresponding Stablecoin enum value.
 */
function convertTickerToStablecoin(ticker: string): Stablecoin {
  return Stablecoin[ticker as keyof typeof Stablecoin];
}

const blackRussian = {
  color: {
    blackRussian: {
      outline: 'shadow-sm bg-white dark:bg-black-russian-950 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400',
    }
  }
};

const erc20 = useErc20();
const {fetchBalance, isERC20Approved, approveERC20} = erc20;
const balance: Ref<number|string> = ref(0);

const {address, isConnected} = useWallet();
const {checkAgreed} = useWalletStore();

const setBalance = async () => {
  const rawBal = await fetchBalance(selected.value, address.value as string) as bigint
  balance.value = ethers.formatUnits(
      rawBal.toString(),
      selected.value.decimals);

}

watch(address, async (address) => {
  if (address) {
    await setBalance();
  }
})

/**
 * Handles change in selected token and updates the balance.
 */
const handleChange = async () => {
  if (isConnected.value && selected.value) {
    await setBalance()
  }
};

const isApproved = ref(true);

/**
 * Checks whether the selected token amount is approved for the specified amount.
 */
const checkApproval = async () => {
  isApproved.value = await isERC20Approved(selected.value, amount.value as number);
};

/**
 * * @param {number} percent - The percentage of the balance to set as the amount.
 */
const amountTo = (percent: number) => {

  const amountLeft = 500000 - saleStore.saleState.totalContributions
  const calculatedAmount = Math.round(balance.value as number * percent / 100);
  amount.value = calculatedAmount > amountLeft ? amountLeft : calculatedAmount
  checkApproval()
};

const nfts = useNfts();
const {setApprovalForAll, isApprovedForAll} = nfts;

/**
 * Approves the selected ERC20 token.
 */
const approve = async () => {
  await approveERC20(selected.value, amount.value as number);
  await checkApproval();
};

const showModal: Ref<boolean> = ref(false);

const {depositAndLockNfts, lockNfts} = useEthClient();
const config = useRuntimeConfig().public;

const {buterinCards, minedJpeg} = config;
const saleStore = useSaleStore();


/**
 * Displays agreement modal.
 */
const getAgreement = () => {
  console.log("AGG", showModal.value)
  if (showModal.value) {
    showModal.value = false;
  }
  showModal.value = true;
}

const handleClose = () => {
  console.log("close");
  showModal.value = false;
}

const hasAgreed = computed(() => {
  useWalletStore().checkAgreed()
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
    const {address} = useWallet();
    if (saleStore.buterinCardsSelected.length > 0) {
      const isApproved = await isApprovedForAll(config.buterinCards, address.value as string);
      if (!isApproved) {
        await setApprovalForAll(buterinCards);
      }
    }
    // Approve Mined Jpegs if not already approved
    if (saleStore.minedJpegsSelected.length > 0) {
      const isApproved = await isApprovedForAll(config.minedJpeg, address.value as string);
      if (!isApproved) {
        await setApprovalForAll(minedJpeg);
      }
    }
    // Check ERC20 approved
    if(!isApproved.value) {
      await approve()
    }
    const stablecoin = convertTickerToStablecoin(selected.value.ticker);    // Deposit and Lock

    await depositAndLockNfts(stablecoin, amount.value as number, saleStore.buterinCardsSelected.map(Number), saleStore.minedJpegsSelected.map(Number));
    setTimeout(async () => {
      emit('refresh');
      await saleStore.fetchWalletContributions(address.value as string);
      await saleStore.fetchSaleState()
      await setBalance()
      amount.value = 0;
      saleStore.selectedItems = []
    }, 2000);
  }
};

/**
 * Determines if NFTs should be locked.
 */
const showLockNfts = computed(() => {
  return (amount.value === 0 || amount.value == null) && saleStore.selectedItems.length > 0
});

/**
 * Fetch contributions
 */
await saleStore.fetchWalletContributions(address.value as string);
const contributions: Ref<Contribution> = ref(saleStore.getWalletContributions);


/**
 * Locks the selected NFTs.
 */
const doLockNfts = async () => {
  // Approve Buterin Cards if not already approved
  const {address} = useWallet();
  if (saleStore.buterinCardsSelected.length > 0) {
    const isApproved = await isApprovedForAll(config.buterinCards, address.value as string);
    if (!isApproved) {
      await setApprovalForAll(buterinCards);
    }
  }
  // Approve Mined Jpegs if not already approved
  if (saleStore.minedJpegsSelected.length > 0) {
    const isApproved = await isApprovedForAll(config.minedJpeg, address.value as string);
    if (!isApproved) {
      await setApprovalForAll(minedJpeg);
    }
  }
  await lockNfts(saleStore.buterinCardsSelected.map(Number), saleStore.minedJpegsSelected.map(Number));
  setTimeout(() => {
    emit('refresh');
    saleStore.fetchWalletContributions(address.value as string);
    contributions.value = saleStore.getWalletContributions;
    saleStore.selectedItems = []
  }, 2000);
};


const lockMenuInput = computed(() => {
  return saleStore.contributions.timeLastContribution > 0
})

if (lockMenuInput.value) {
  selected.value = tokenList[contributions.value.stablecoin];
}

watch([isConnected, contributions], ([isConnected, contributions]) => {
  if (isConnected) {
    useWalletStore().checkAgreed()
  }

  if (contributions) {
    selected.value = tokenList[contributions.stablecoin];
  }
})

/**
 * Lifecycle hook that runs when the component is mounted.
 */
onMounted(() => {
  handleChange();
  const {$listen} = useNuxtApp();
  $listen('sale:update', async () => {
    await setBalance();
    await saleStore.fetchSaleState();
    await saleStore.fetchWalletContributions(useWallet().address.value as string);
    contributions.value = saleStore.getWalletContributions;
  })
});

const enoughBalance = computed((): boolean => {
  return balance.value >= amount.value;
})

</script>

<template>
  <div class="flex flex-col items-center w-full rounded-lg bg-[#ffffff15]">
    <UFormGroup class="w-full">
      <div class="w-full flex flex-row gap-3  rounded-md p-3">
        <div class="flex flex-col gap-2">
          <input v-model="amount" type="number" placeholder="0"
                 @input="checkApproval"
                 :class="[
                      !enoughBalance ? 'text-red-400' : '',
                      'no-arrows bg-transparent focus:outline-0 w-full text-lg p-3'
                  ]"
          />
          <div class="text-left text-sm text-red-400">
            <label class="p-3" v-if="!enoughBalance">Insuficent funds</label>
          </div>

        </div>
        <div class="flex flex-col gap-1 items-end w-full">
          <div class="flex flex-row gap-0 items-center justify-end bg-black-russian-950 rounded-md p-2">
            <picture>
              <NuxtImg v-if="selected" :src="selected.icon" width="32" height="32"/>
            </picture>
            <UTooltip
                text="Contributions must all use the same stablecoin."
                :prevent="!lockMenuInput" :popper="{ placement: 'top', offsetDistance: 16, arrow: true }"
            >
              <UInputMenu v-model="selected" :options="tokenList" option-attribute="name" class="max-w-[150px]"
                          :uiMenu="{ background: 'bg-white dark:bg-black-russian-950' }"
                          :variant="'none'"
                          :ui="blackRussian"
                          @change="handleChange"
                          :disabled="lockMenuInput"
                          :trailing-icon="!lockMenuInput ? 'i-heroicons-chevron-down-20-solid': 'i-heroicons-exclamation-circle-16-solid'"
              >
                <template #option="{ option: token }">
                  <NuxtImg :src="token.icon" width="16" height="16"/>
                  <span class="truncate">{{ token.name }}</span>
                </template>
              </UInputMenu>
            </UTooltip>
          </div>
          <div class="text-xs p-1 italic flex flex-inline gap-1 justify-center items-center">Balance: {{
              new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(balance as number).replace('$', '')
            }}
            <span>{{ selected.ticker }}</span>
          </div>
          <div class="flex flex-row gap-1 text-cyan text-sm font-semibold">
            <div role="button" @click="amountTo(25)">25%</div>
            <div role="button" @click="amountTo(50)">50%</div>
            <div role="button" @click="amountTo(100)">Max</div>
          </div>
        </div>
      </div>
      <div class="flex w-full flex-col gap-3 justify-center items-center p-3">
        <div v-if="!hasAgreed" class="flex w-full gap-3 mt-0 justify-center items-center">
          <button @click="getAgreement"
                  class="bg-rob-roy-300 text-black font-semibold rounded-md px-4 py-2 w-10/12 text-center">
            <span class="inline-block">Agree to Terms</span>
          </button>
        </div>
        <div v-else class="flex w-full gap-3 mt-3 justify-center items-center">
          <div v-if="showLockNfts" class="flex w-full gap-3 mt-0 justify-center items-center">
            <button @click="doLockNfts"
                    class="bg-rob-roy-300 text-black font-semibold rounded-md px-4 py-2 w-10/12 text-center">
              Lock NFTs
            </button>
          </div>
          <div v-else class="flex w-full gap-3 mt-0 justify-center items-center">
            <button @click="contribute" :disabled="!enoughBalance"
                    class="bg-rob-roy-300 text-black font-semibold rounded-md px-4 py-2 w-10/12 text-center disabled:bg-gray-suit-700">
              {{ saleStore.selectedItems.length > 0 ? 'Make contribution and lock NFTs' : "Make contribution" }}
            </button>
          </div>
        </div>
      </div>
    </UFormGroup>
    <Disclaimer v-if="showModal" @status-changed="checkAgreed" @close="handleClose"/>
  </div>
</template>

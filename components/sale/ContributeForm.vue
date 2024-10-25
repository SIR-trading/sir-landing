<script setup lang="ts">
import {type Ref, ref, computed, onMounted} from 'vue';
import {ethers} from "ethers";
import tokens from "@/assets/token_list.json";
import {useWallet} from "~/composables/useWallet";
import {useErc20} from "~/composables/useErc20";
import {useEthClient} from "~/composables/useEthClient";
import {Stablecoin} from "@/types/data";
import {useNfts} from "~/composables/useNfts";
import {useSaleStore} from "~/stores/sale";
import {useWalletStore} from "~/stores/wallet";

const amount: Ref<null | number> = ref(null);
const selected: Ref<Token> = ref(tokens[0]);

const blackRussian = {
  color: {
    blackRussian: {
      outline: 'shadow-sm bg-white dark:bg-black-russian-950 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400',
    }
  }
};

const erc20 = useErc20();
const {approveErc20, isErc20Approved, fetchBalance} = erc20;
const balance = ref(0);

const {address, isConnected} = useWallet();
const {checkAgreed} = useWalletStore();

const setBalance = async () => {
  balance.value = await fetchBalance(selected.value, address.value)
      .then((val) => {
        return ethers.formatUnits(val.toString(), selected.value.decimals);
      });
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

const amountLeft = computed(() => {
  return 500000 - saleStore.saleState.totalContributions;
})

/**
 * Sets the amount based on a percentage of the balance.
 * @param {number} percent - The percentage of the balance to set as the amount.
 */
const amountTo = (percent: number) => {
  const calculatedAmount = Math.round(balance.value * percent / 100);
  amount.value = calculatedAmount > amountLeft ? amountLeft.value : calculatedAmount
};

const isApproved = ref(true);

/**
 * Checks whether the selected token amount is approved for the specified amount.
 */
const checkApproval = async () => {
  const saleState = await useEthClient().state();
  const amountLeft = 500000 - saleState.totalContributions
  if (amount.value > amountLeft) {
    amount.value = amountLeft
  }
  isApproved.value = await isErc20Approved(selected.value, amount.value);
};

const nfts = useNfts();
const {setApprovalForAll, isApprovedForAll} = nfts;

/**
 * Approves the selected ERC20 token.
 */
const approve = async () => {
  await approveErc20(selected.value, amount.value);
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
    // Check amount
    const finalAmount = amount.value > amountLeft.value ? amountLeft.value : amount.value;
    // Deposit and Lock
    await depositAndLockNfts(coins[selected.value.ticker], finalAmount, saleStore.buterinCardsSelected, saleStore.minedJpegsSelected);
    setTimeout(async () => {
      emit('refresh');
      saleStore.fetchWalletContributions(address.value);
      saleStore.fetchSaleState()
      await setBalance()
      amount.value = 0;
    }, 2000);
  }
};

/**
 * Determines if NFTs should be locked.
 */
const showLockNfts = computed(() => {
  return (amount.value === 0 || amount.value == "" || amount.value == null) && saleStore.selectedItems.length > 0
});

/**
 * Fetch contributions
 */
await saleStore.fetchWalletContributions(address.value);
const contributions = ref(saleStore.getWalletContributions);
console.log("contributions::", contributions)


/**
 * Locks the selected NFTs.
 */
const doLockNfts = async () => {
  // Approve Buterin Cards if not already approved
  const {address} = useWallet();
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
    contributions.value = saleStore.getWalletContributions;
  }, 2000);
};


const lockMenuInput = computed(() => {
  console.log("Contribution::", saleStore.contributions, "locked?", saleStore.contributions.timeLastContribution > 0)
  return !!saleStore.contributions.timeLastContribution > 0;
})

if (lockMenuInput.value) {
  console.log("If menuInputLocked", selected.value, contributions.value.stablecoin, lockMenuInput.value);
  selected.value = tokens[contributions.value.stablecoin];
  console.log("after menuInputLocked", selected.value);
}

watch([isConnected, contributions], (isConnected, contributions) => {
  if (isConnected) {
    useWalletStore().checkAgreed()
    console.log("agreed!!!", useWalletStore().hasAgreed)
  }

  if (contributions) {
    console.log("watch", "CONTRIBUTIONS:", contributions, selected.value);
    selected.value = tokens[contributions.value.stablecoin];
  }
})

/**
 * Lifecycle hook that runs when the component is mounted.
 */
onMounted(() => {
  handleChange();
});

const enoughBalance = computed(() => {
  return balance.value >= amount.value;
})

</script>

<template>
  <div class="flex flex-col items-stretch p-4 w-full">
    <UFormGroup class="w-full">
      <div class="w-full flex flex-row gap-3 bg-softGray rounded-md p-3">
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
        <div class="flex flex-col gap-2 items-end w-full">
          <div class="flex flex-row gap-0 items-center justify-end bg-black-russian-950 rounded-md p-2">
            <picture>
              <NuxtImg v-if="selected" :src="selected.icon" width="32" height="32"/>
            </picture>
            <UTooltip
                text="Contributions must all use the same stablecoin."
                :prevent="!lockMenuInput" :popper="{ placement: 'top', offsetDistance: 16, arrow: true }"
            >
              <UInputMenu v-model="selected" :options="tokens" option-attribute="name" class="max-w-[150px]"
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
              }).format(balance).replace('$', '')
            }}
            <span>{{selected.ticker}}</span>
          </div>
          <div class="flex flex-row gap-1 text-cyan text-sm font-semibold">
            <div role="button" @click="amountTo(25)">25%</div>
            <div role="button" @click="amountTo(50)">50%</div>
            <div role="button" @click="amountTo(100)">Max</div>
          </div>
        </div>
      </div>
      <div class="flex w-full flex-col gap-3 mt-3 justify-center items-center">
        <div v-if="!hasAgreed" class="flex w-full gap-3 mt-3 justify-center items-center">
          <button @click="getAgreement"
                  class="bg-rob-roy-300 text-black font-semibold rounded-md px-4 py-2 w-full text-center">
            <span class="inline-block">Agree to Terms</span>
          </button>
        </div>
        <div v-else class="flex w-full gap-3 mt-3 justify-center items-center">
          <div v-if="showLockNfts" class="flex w-full gap-3 mt-3 justify-center items-center">
            <button @click="doLockNfts"
                    class="bg-rob-roy-300 text-black font-semibold rounded-md px-4 py-2 w-10/12 text-center">
              Lock NFTs
            </button>
          </div>
          <div v-else class="flex w-full gap-3 mt-3 justify-center items-center">
            <button v-if="isApproved" @click="contribute" :disabled="!enoughBalance"
                    class="bg-rob-roy-300 text-black font-semibold rounded-md px-4 py-2 w-10/12 text-center disabled:bg-gray-suit-700">
              {{ saleStore.selectedItems.length > 0 ? 'Make contribution and lock NFTs' : "Make contribution" }}
            </button>
            <button v-if="!isApproved" @click="approve" :disabled="!enoughBalance"
                    class="bg-rob-roy-300 text-black font-semibold rounded-md px-4 py-2 w-10/12 text-center disabled:bg-gray-suit-700">
              Approve
            </button>
          </div>
        </div>
      </div>
    </UFormGroup>
    <Disclaimer v-if="showModal" @status-changed="checkAgreed" @close="handleClose"/>
  </div>
</template>

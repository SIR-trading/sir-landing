<script setup lang="ts">
import {type Ref, ref, computed, onMounted, watch} from 'vue';
import {ethers} from "ethers";
import {Stablecoin, type Contribution} from "@/types/data";
import type {Token} from "~/types/data";

const amount: Ref<string> = ref("");
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
const balance: Ref<number | string> = ref(0);

const {address, isConnected} = useWallet();

const walletStore = useWalletStore();
const saleStore = usePresaleStore();

const setBalance = async () => {
  const rawBal = await fetchBalance(selected.value, address.value as string) as bigint;
  balance.value = ethers.formatUnits(
      rawBal.toString(),
      selected.value.decimals
  );
};


watch(useWallet().address, async (address) => {
  if (address) {
    console.log("CHANGE ADDRESS from CONTRIBUTE_FORM")
    await saleStore.fetchWalletContributions(address)
    selected.value = tokenList[saleStore.contributions.stablecoin]
    await setBalance();
  }
});

const handleChange = async () => {
  if (isConnected.value && selected.value) {
    await checkApproval();
    await setBalance();
  }
};

const isApproved = ref(false);

const checkDigit = (event: KeyboardEvent) => {
  if (event.key.length === 1 && isNaN(Number(event.key))) {
    event.preventDefault();
  }
};

/**
 * Checks whether the selected token amount is approved for the specified amount.
 */
const checkApproval = async () => {
  isApproved.value = await isERC20Approved(selected.value, Number(amount.value));
  console.log(isApproved.value);
};

const amountLeft = computed((): number => {
  return 500000 - saleStore.saleState.totalContributions;
});

/**
 * * @param {number} percent - The percentage of the balance to set as the amount.
 */
const amountTo = (percent: number) => {
  const calculatedAmount = Math.floor(Number(balance.value) * percent / 100);
  amount.value = (calculatedAmount > amountLeft.value ? amountLeft.value : calculatedAmount).toString();
  checkApproval();
};

const nfts = useNfts();
const {setApprovalForAll, isApprovedForAll} = nfts;

/**
 * Approves the selected ERC20 token.
 */
const approve = async () => {
  isTxHelperLoading.value = true;

  await approveERC20(selected.value, Number(amount.value));
  await checkApproval();
  isTxHelperLoading.value = false;
};

const showModal: Ref<boolean> = ref(false);

const {depositAndLockNfts, lockNfts} = usePreSaleClient();
const config = useRuntimeConfig().public;
const env = useEnv();
const {buterinCards, minedJpeg} = env;


/**
 * Displays agreement modal.
 */
const getAgreement = () => {
  if (showModal.value) {
    showModal.value = false;
  }
  showModal.value = true;
};

const handleClose = () => {
  console.log("close");
  showModal.value = false;
};


const emit = defineEmits(['refresh']);


/**
 * Executes the contribution process.
 */
const contribute = async () => {
  if (walletStore.hasAgreed) {
    console.log("here")
    const stablecoin = convertTickerToStablecoin(selected.value.ticker);
    isTxHelperLoading.value = true;
    await depositAndLockNfts(stablecoin, Number(amount.value), saleStore.buterinCardsSelected.map(Number), saleStore.minedJpegsSelected.map(Number)).then(() => {
      toast.update("contribute:erc20", {
        title: "Deposited and Locked",
        color: "harlequin",
        timeout: 5000,
      });
    });
    isTxHelperLoading.value = false;
    showTxHelper.value = false;
    setTimeout(async () => {
      emit('refresh');
      await saleStore.fetchWalletContributions(address.value as string);
      await saleStore.fetchSaleState();
      await setBalance();
      amount.value = '0';
      saleStore.selectedItems = [];
    }, 2000);
  }
};

/**
 * Determines if NFTs should be locked.
 */
const showLockNfts = computed(() => {
  return (Number(amount.value) === 0 || !amount.value) && saleStore.selectedItems.length > 0;
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
  isTxHelperLoading.value = true;
  console.log("After Approvals");
  await lockNfts(saleStore.buterinCardsSelected.map(Number), saleStore.minedJpegsSelected.map(Number));
  isTxHelperLoading.value = false;
  showTxHelper.value = false;
  setTimeout(() => {
    emit('refresh');
    saleStore.fetchWalletContributions(address.value as string);
    contributions.value = saleStore.getWalletContributions;
    saleStore.selectedItems = [];
  }, 2000);
};

const lockMenuInput = computed(() => {
  return saleStore.contributions.timeLastContribution > 0 && (saleStore.contributions.amountWithdrawableNoDecimals > 0 || saleStore.contributions.amountFinalNoDecimals > 0);
});

if (lockMenuInput.value) {
  selected.value = tokenList[saleStore.contributions.stablecoin];
}

watch([isConnected, contributions], ([isConnected, contributions]) => {
  if (isConnected) {
    useWalletStore().checkAgreed();
    checkNftsApprovals()
  }

  if (contributions) {
    selected.value = tokenList[contributions.stablecoin];
  }
});

const enoughBalance = computed((): boolean => {
  return Number(balance.value) >= Number(amount.value);
});

const hasOverflowOfDeposit = computed((): boolean => {
  return Number(amount.value) - amountLeft.value > 0;
});

const overflowOfDeposit = computed((): number => {
  return Number(amount.value) - amountLeft.value;
});

/**
 * MODAL
 */
const isTxHelperLoading: Ref<boolean> = ref(false);
const showTxHelper: Ref<boolean> = ref(false);
const handleTxHelperClose = () => {
  showTxHelper.value = false;
};

const isBtApproved: Ref<boolean> = ref(true);
const isMjpgApproved: Ref<boolean> = ref(true);

const checkNftsApprovals = async () => {
  const {address} = useWallet();
  isBtApproved.value = await isApprovedForAll(config.buterinCards, address.value as string);
  isMjpgApproved.value = await isApprovedForAll(config.minedJpeg, address.value as string);
};
await checkNftsApprovals();
console.log("check_nfts_approvals", {
  BT: isBtApproved.value,
  MJ: isMjpgApproved.value
})
const toast = useToast();

const approveNFTs = async () => {
  await checkNftsApprovals()
  console.log("approve_nfts")
  if (saleStore.buterinCardsSelected.length > 0 && !isBtApproved.value) {
    isTxHelperLoading.value = true;
    toast.add({
      id: "approve:bt",
      timeout: 15000,
      title: "Approving Buterin Cards",
      color: "blue-bell",
    });
    await setApprovalForAll(buterinCards);
    toast.remove("approve:bt");
    isTxHelperLoading.value = false;
  }
  if (saleStore.minedJpegsSelected.length > 0 && !isMjpgApproved.value) {
    isTxHelperLoading.value = true;
    toast.add({
      id: "approve:mj",
      timeout: 15000,
      title: "Approving Mined JPEGs",
      color: "blue-bell",
    });
    await setApprovalForAll(minedJpeg);
    toast.remove("approve:mj");
    isTxHelperLoading.value = false;
  }

  await checkNftsApprovals();
};

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
    await checkNftsApprovals();
  });
});


</script>

<template>
  <div class="flex flex-col items-center w-full flex-auto rounded-lg bg-[#ffffff15]">

    <UFormGroup class="w-full p-3">
      <div class="w-full flex flex-row gap-3 rounded-md p-3 bg-[#414158]">
        <div class="flex flex-col gap-2">
          <input v-model="amount" type="text" placeholder="0"
                 @input="checkApproval"
                 @keydown="checkDigit"
                 :class="[
              !enoughBalance ? 'text-red-400' : '',
              'no-arrows bg-transparent focus:outline-0 w-full text-lg p-3'
            ]"
          />
          <div class="text-left text-xs text-red-400">
            <label class="p-3" v-if="!enoughBalance">Insufficient funds</label>
            <div class="flex flex-wrap">
              <label class="p-1" v-if="hasOverflowOfDeposit && enoughBalance">
                Sale cap exceeded. {{ overflowOfDeposit }} {{ selected.ticker }} will be refunded.
              </label>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-1 items-end w-full">
          <div class="flex flex-row gap-0 items-center justify-end bg-black-russian-950 rounded-md p-2">
            <picture>
              <NuxtImg v-if="selected" :src="selected.icon" width="32" height="32"/>
            </picture>
            <UTooltip
                text="Contributions must all use the same stablecoin."
                :prevent="!lockMenuInput"
                :popper="{ placement: 'top', offsetDistance: 16, arrow: true }"
            >
              <UInputMenu v-model="selected" :options="tokenList" option-attribute="name" class="max-w-[150px]"
                          :uiMenu="{ background: 'bg-white dark:bg-black-russian-950' }"
                          :variant="'none'"
                          :ui="blackRussian"
                          @change="handleChange"
                          :disabled="lockMenuInput"
                          :trailing-icon="!lockMenuInput ? 'i-heroicons-chevron-down-20-solid' : 'i-heroicons-exclamation-circle-16-solid'"
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
        <div v-if="!walletStore.hasAgreed" class="flex w-full gap-3 mt-0 justify-center items-center">
          <button @click="getAgreement"
                  class="bg-rob-roy-300 text-black font-semibold rounded-md px-4 py-2 w-10/12 text-center">
            <span class="inline-block">Agree to Terms</span>
          </button>
        </div>
        <div v-else class="flex w-full gap-3 mt-3 justify-center items-center">
          <div v-if="showLockNfts" class="flex w-full gap-3 mt-0 justify-center items-center">
            <button @click="showTxHelper = true"
                    class="bg-rob-roy-300 text-black font-semibold rounded-md px-4 py-2 w-10/12 text-center">
              Lock NFTs
            </button>
          </div>
          <div v-else class="flex w-full gap-3 mt-0 justify-center items-center">
            <button @click="showTxHelper = true" :disabled="!enoughBalance || Number(amount) < 1"
                    class="bg-rob-roy-300 text-black font-semibold rounded-md px-4 py-2 w-10/12 text-center disabled:bg-gray-suit-700">
              {{ saleStore.selectedItems.length > 0 ? 'Make contribution and lock NFTs' : "Make contribution" }}
            </button>
          </div>
        </div>
      </div>
    </UFormGroup>
    <CommonModal :is-visible="showTxHelper" @close="handleTxHelperClose" modalBackgroundColor="bg-[#060113]">
      <div class="relative flex flex-col gap-3 justify-center items-center p-3 w-full md:w-[600px]">
        <div v-if="(!isBtApproved && saleStore.buterinCardsSelected.length > 0 ) || (!isMjpgApproved && saleStore.minedJpegsSelected.length > 0) "
             class="flex flex-col w-full gap-3 mt-3 justify-center items-left p-6"
        >
          <div class="p-6">
            <h2 class="section-header">Approve NFTs</h2>
            <div class="flex justify-start items-center gap-1 text-sm text-blue-100 ">
              <UIcon name="i-heroicons-exclamation-circle-16-solid" class="text-blue-400 w-5 h-5"/>
              <span class="italic text-sm">To transfer your NFTs to the sale contract, we need your approval.</span>
            </div>
          </div>
          <div class="flex w-full justify-center">
            <div class="w-2/3">
              <UButton size="lg" block class="font-bold" :loading="isTxHelperLoading"
                       color="robRoy" @click="approveNFTs"
              >
                Approve
              </UButton>
            </div>
          </div>
        </div>
        <div v-else class="flex w-full gap-3 mt-3 justify-center items-center p-6">
          <div v-if="showLockNfts" class="flex flex-col w-full gap-3 mt-0 justify-center items-center">
            <div class="flex flex-col w-full p-3 gap-3">
              <h2 class="section-header">Lock NFTs</h2>
              <div class="flex flex-inline gap-1 justify-start items-center text-sm text-red-100 ">
                <UIcon name="i-heroicons-exclamation-circle-16-solid" class="text-red-400"/>
                <span class="italic text-sm">Your NFTs will be locked for 1 year after the sale ends</span>
              </div>
              <PresaleDepositPreview :amount="!!amount? parseInt(amount ) : 0"/>
            </div>
            <div class="flex w-full justify-evenly">
              <div class="w-2/3">
                <UButton @click="doLockNfts"
                         :loading="isTxHelperLoading"
                         block
                         class="bg-rob-roy-300 text-black font-semibold rounded-md px-4 py-2 text-center">
                  Agree and Lock NFTs
                </UButton>
              </div>
            </div>
          </div>
          <div v-else class="flex w-full gap-6 mt-0 p-3 justify-center items-start flex-col">
            <div class="flex flex-col w-full p-3 gap-3">
              <h2 class="section-header">
                {{ saleStore.selectedItems.length > 0 ? "Lock NFTs and deposit" : `Deposit ${selected.ticker}` }}</h2>
              <div v-if="saleStore.selectedItems.length > 0"
                  class="flex flex-inline gap-1 justify-start items-center text-sm text-red-100 ">
                <UIcon name="i-heroicons-exclamation-circle-16-solid" class="text-red-400"/>
                <span class="italic text-sm">Your NFTs will be locked for 1 year after the sale ends</span>
              </div>
            </div>
            <PresaleDepositPreview :amount="parseInt(amount)"/>
            <div class="flex w-full justify-center items-center">
              <div class="w-2/3">
                <UButton size="lg" block class="font-bold w-[200px]" :loading="isTxHelperLoading" v-if="!isApproved"
                         color="robRoy" @click="approve">Approve {{ selected.name }}
                </UButton>
                <UButton size="lg" block v-else @click="contribute" :loading="isTxHelperLoading"
                         class="bg-rob-roy-300 text-black font-bold rounded-md px-4 py-2 disabled:bg-gray-suit-700">
                  {{ saleStore.selectedItems.length > 0 ? 'Make contribution and lock NFTs' : "Make contribution" }}
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CommonModal>
    <Disclaimer v-if="showModal" @close="handleClose"/>
  </div>
</template>
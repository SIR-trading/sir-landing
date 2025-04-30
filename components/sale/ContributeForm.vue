<script setup lang="ts">
import {type Ref, ref, computed, onMounted, watch} from 'vue';
import { ethers, isAddress } from "ethers";
import {useWallet} from "~/composables/useWallet";
import {useErc20} from "~/composables/useErc20";
import {useSaleClient} from "~/composables/useSaleClient";
import {Stablecoin, type Contribution} from "@/types/data";
import {useSaleStore} from "~/stores/sale";
import type {Token} from "~/types/data";
import Modal from "~/components/common/Modal.vue";
import DepositPreview from "~/components/sale/DepositPreview.vue";
import {useOnboard} from '@web3-onboard/vue';

const amount: Ref<string> = ref("");
const {tokenList} = await $fetch<{tokenList: Token[]}>("/api/erc20/tokens");
const defaultToken = tokenList[0];
const selected: Ref<Token> = ref(defaultToken);

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
const saleStore = useSaleStore();

const setBalance = async () => {
  if(!isConnected) {
    balance.value = 0;
    return;
  }
  const rawBal = await fetchBalance(selected.value, address.value as string) as bigint;
  balance.value = ethers.formatUnits(
      rawBal.toString(),
      selected.value.decimals
  );
};

const {connectWallet} = useOnboard();

const connect = async () => {
  await connectWallet()
}


watch(useWallet().address, async (address) => {
  if (address) {
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
  await checkApproval()
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
};

const saleCap = ref<boolean>(false);
const saleLimit =  inject<number>('saleLimit')
const amountLeft = computed((): number => {
  return saleLimit ? saleLimit - saleStore.saleState.totalContributions : 0;
});

/**
 * * @param {number} percent - The percentage of the balance to set as the amount.
 */
const amountTo = (percent: number) => {
  const calculatedAmount = Math.floor(Number(balance.value) * percent / 100);
  amount.value = (calculatedAmount > amountLeft.value ? amountLeft.value : calculatedAmount).toString();
  checkApproval();
};



/**
 * Approves the selected ERC20 token.
 */
const approve = async (): Promise<void> => {
  isTxHelperLoading.value = true;
  const approvalAmount = saleCap.value ? amountLeft.value : Number(amount.value);
  await approveERC20(selected.value, approvalAmount);
  await checkApproval();
  isTxHelperLoading.value = false;
};

const showModal: Ref<boolean> = ref(false);

const {deposit} = useSaleClient();
const config = useRuntimeConfig().public;




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
  showModal.value = false;
};


const emit = defineEmits(['refresh']);


/**
 * Executes the contribution process.
 */
const contribute = async () => {
  if (walletStore.hasAgreed) {
    const stablecoin = convertTickerToStablecoin(selected.value.ticker);
    isTxHelperLoading.value = true;
    await deposit(stablecoin, Number(amount.value)).then(() => {
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
      amount.value = '';
    }, 2000);
  }
};


/**
 * Fetch contributions
 */
if(isAddress(address.value)){
  await saleStore.fetchWalletContributions(address.value as string);
}

const contributions= ref<Contribution|null>(null);



const lockMenuInput = computed(() => {
  return saleStore.contributions.timeLastContribution > 0 && (saleStore.contributions.amountWithdrawableNoDecimals > 0 || saleStore.contributions.amountFinalNoDecimals > 0);
});

if (lockMenuInput.value) {
  selected.value = tokenList[saleStore.contributions.stablecoin];
}

watch([isConnected, contributions], ([isConnected, contributions]) => {
  if (isConnected) {
    walletStore.checkAgreed(address.value as string);
    walletStore.fetchTokenBalances(address.value);
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

const toast = useToast();


/**
 * Lifecycle hook that runs when the component is mounted.
 */
onMounted(async () => {
  await handleChange();
  const {$listen} = useNuxtApp();
  $listen('sale:update', async () => {
    await setBalance();
    await saleStore.fetchSaleState();
    if(isConnected) {
      await walletStore.fetchTokenBalances(address.value);
    }
    await saleStore.fetchWalletContributions(useWallet().address.value as string);
    if (lockMenuInput.value) {
      selected.value = tokenList[saleStore.contributions.stablecoin];
    }

  });
});


</script>

<template>
  <div class="flex flex-col items-center w-full flex-auto rounded-lg bg-[#ffffff15]">
    <ClientOnly>
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
          <div class="text-[12px] p-0 mr-1 italic flex flex-row flex-nowrap gap-1 justify-center items-center">
            <span>Balance: {{
                new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(balance as number).replace('$', '')
              }}</span>
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
        <button v-if="!isConnected"
          @click="connect"
          class="bg-rob-roy-300 text-black font-semibold rounded-md px-4 py-2 w-10/12 text-center">
          <span class="inline-block">Connect Wallet</span>
        </button>
        <div v-else-if="!walletStore.hasAgreed" class="flex w-full gap-3 mt-0 justify-center items-center">
          <button @click="getAgreement"
                  class="bg-rob-roy-300 text-black font-semibold rounded-md px-4 py-2 w-10/12 text-center">
            <span class="inline-block">Agree to Terms</span>
          </button>
        </div>
        <div v-else class="flex w-full gap-3 mt-3 justify-center items-center">

          <div class="flex w-full gap-3 mt-0 justify-center items-center">
            <button @click="showTxHelper = true" :disabled="!enoughBalance || Number(amount) < 1"
                    class="bg-rob-roy-300 text-black font-semibold rounded-md px-4 py-2 w-10/12 text-center disabled:bg-gray-suit-700">
              Make contribution
            </button>
          </div>
          <div v-if="showTxHelper" class="flex w-full gap-3 mt-0 justify-center items-center">
            show
          </div>
        </div>
      </div>
    </UFormGroup>
    <Modal :is-visible="showTxHelper" @close="handleTxHelperClose" modalBackgroundColor="bg-[#060113]">
      <div class="relative flex flex-col gap-3 justify-center items-center p-3 w-full md:w-[600px]">
        <div class="flex w-full gap-3 mt-3 justify-center items-center p-6">
          <div class="flex w-full gap-6 md:gap-12 mt-0 p-3 justify-center items-start flex-col">
            <div class="flex flex-col w-full gap-3">
              <h2 class="section-header">
                {{ `Deposit ${selected.ticker}` }}
              </h2>
            </div>
            <DepositPreview :amount="parseInt(amount)"/>
            <div class="flex w-full flex-col gap-1 justify-center items-center" :class="isApproved ?? 'items-start'">
              <div  :class="isApproved ? 'mx-auto' : 'ml-0'">
                <UButton size=sm block class="font-bold w-[200px]" :loading="isTxHelperLoading" v-if="!isApproved"
                         color="robRoy" @click="approve()">Approve {{ selected.name }}
                </UButton>
                <UButton size="sm" block v-else @click="contribute" :loading="isTxHelperLoading"
                         color="robRoy" class="font-bold w-[200px]">
                  Make contribution
                </UButton>
              </div>
              <div v-if="!isApproved" class="mt-4 md:mt-8 p-1 w-full flex justify-center">
                <UCheckbox v-model="saleCap">
                  <template #label>
                    <div>
                      <span>Approve maximum sale amount</span>
                      <span class="ml-1 text-xs text-gray-400 italic">({{
                          new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                          }).format(amountLeft).replace('$', '')
                        }} {{ selected.ticker }})</span>
                    </div>
                    <div class="text-xs text-gray-400 mt-1">
                      Check this to approve the maximum remaining sale amount instead of just your current contribution
                      amount
                    </div>
                  </template>
                </UCheckbox>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
    </ClientOnly>
    <Disclaimer v-if="showModal" @close="handleClose"/>
  </div>
</template>
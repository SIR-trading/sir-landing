<script setup lang="ts">
import {type Ref, ref} from 'vue'
import {type Token} from "@/types"
import {ethers} from "ethers";
import tokens from "@/assets/token_list.json"
import {useWallet} from "~/composables/useWallet";
import {useErc20} from "~/composables/useErc20";
import {useEthClient} from "~/composables/useEthClient";
import {Stablecoin} from "@/types/data"
import {useNfts} from "~/composables/useNfts";
import {useSaleStore} from "~/stores/sale";





const amount = ref(0)

const selected: Ref<Token> = ref(tokens[1])

const blackRussian = {
  color: {
    blackRussian: {
      outline: 'shadow-sm bg-white dark:bg-black-russian-950 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400',
    }
  }
}

const erc20 = useErc20()
const {approveErc20, isErc20Approved, fetchBalance} = erc20
const balance = ref(0)

const handleChange = async () => {
  const {address, isConnected} = useWallet()

  if (isConnected.value && selected.value) {
    balance.value = await fetchBalance(selected.value, address.value).then((val) => {
      return ethers.formatUnits(val.toString(), selected.value.decimals)
    })
  }
}


const amountTo = (percent: number) => {
  amount.value = Math.round(balance.value * percent / 100)
  amount.value = Math.round(balance.value * percent / 100)
}

const isApproved = ref(true)

const checkApproval =async  () => {
  isApproved.value = await isErc20Approved(selected.value, amount.value)
}
const nfts = useNfts()
const {setApprovalForAll, isApprovedForAll} = nfts

const approve = async () => {
  await approveErc20(selected.value, amount.value)
  await checkApproval()
}

const {depositAndLockNfts, lockNfts} = useEthClient()

const config = useRuntimeConfig().public
const {buterinCards, minedJpeg} = config

const saleStore = useSaleStore()
const {selectedItems} = saleStore

const contribute = async () => {

  const coins = Stablecoin;

  // Approve Buterin Cards if are not
  const {address} = useWallet()
  if(saleStore.buterinCardsSelected.length > 0) {
    const isApproved = await isApprovedForAll(config.buterinCards, address.value)
    if(!isApproved) {
      await setApprovalForAll(buterinCards)
    }
  }
  // Approve Mined Jpegs if are not
  if(saleStore.minedJpegsSelected.length > 0) {
    const isApproved = await isApprovedForAll(config.minedJpeg, address.value)
    if(!isApproved) {
      await setApprovalForAll(minedJpeg)
    }
  }

  // Deposit and Lock
  await depositAndLockNfts(coins[selected.value.ticker], amount.value, saleStore.buterinCardsSelected, saleStore.minedJpegsSelected)
}

// todo: fix bug on lockNFTS
const showLockNfts = computed(() => amount.value === 0 && saleStore.selectedItems.length > 0)
const doLockNfts = async () => {
  await lockNfts(saleStore.buterinCardsSelected, saleStore.minedJpegsSelected)
}
onMounted(() => {
  handleChange()
})
</script>

<template>
  <div class="flex flex-col items-stretch p-4 w-full">
    <UFormGroup class="w-full ">
      <div class="w-full flex flex-row gap-3 bg-softGray rounded-md p-3">
        <div class="flex flex-col gap-2">
          <UInput v-model="amount" type="number" label="Amount" placeholder="100" variant="none"
                  @input="checkApproval"
          />
        </div>
        <div class="flex flex-col gap-2 items-end w-full">
          <div class="flex flex-row gap-0  items-center justify-end bg-black-russian-950 rounded-md p-2">
            <picture>
              <NuxtImg v-if="selected" :src="selected.icon" width="32" height="32"/>
            </picture>
            <UInputMenu v-model="selected" :options="tokens" option-attribute="name" class="max-w-[150px]"
                        :uiMenu="{background: 'bg-white dark:bg-black-russian-950'}"
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
            <div role="button" @click="amountTo(25)">50%</div>
            <div role="button" @click="amountTo(100)">Max</div>
          </div>
        </div>
      </div>
      <div class="flex w-full gap-3 mt-3 justify-center items-center">
        <button v-if="isApproved && !showLockNfts" @click="contribute" :disabled="amount === 0"
             class="bg-rob-roy-300 text-black font-semibold rounded-md px-4 py-2 w-10/12 text-center disabled:bg-gray-suit-700">

          Add contribution
        </button>
        <button v-if="!isApproved && !showLockNfts" @click="approve"
             class="bg-rob-roy-300 text-black font-semibold rounded-md px-4 py-2 w-10/12 text-center">
           Approve
        </button>
        <button v-if="showLockNfts" @click="doLockNfts"
             class="bg-rob-roy-300 text-black font-semibold rounded-md px-4 py-2 w-10/12 text-center">
           Lock NFTS
        </button>
      </div>
    </UFormGroup>
  </div>
</template>

<style scoped>
/* Add your styles here */
</style>
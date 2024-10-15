<script setup lang="ts">
import {ref} from 'vue'
import {type Token} from "@/types"
import tokens from "@/assets/token_list.json"
import {useWallet} from "~/composables/useWallet";
import {useErc20} from "~/composables/useErc20";
import {SymbolKind} from "vscode-languageserver-types";
import {useEthClient} from "~/composables/useEthClient";

const props = defineProps({
  minedJpegs: Array<number>,
  buterinCards: Array<number>,
})

const amount = ref(0)
import Array = SymbolKind.Array;

const selected: Ref<Token> = ref(tokens[1])

const blackRussian = {
  color: {
    blackRussian: {
      outline: 'shadow-sm bg-white dark:bg-black-russian-950 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400',
    }
  }
}

const {fetchBalance} = useErc20()
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
}

const isApproved = ref(true)

const checkApproval =async  () => {
  const {isErc20Approved} = useErc20()
  isApproved.value = await isErc20Approved(selected.value, amount.value)
}

const {approveErc20,incrementUSDTAllowance, getAllowance } = useErc20()
const approve = async () => {
    await approveErc20(selected.value, amount.value)
  await checkApproval()
}
import {Stablecoin} from "@/types/data"
import {ethers} from "ethers";
const contribute = async () => {
  const {depositAndLockNfts} = useEthClient()
  const coins = Stablecoin;

  await depositAndLockNfts(coins[selected.value.ticker], amount.value, props.buterinCards, props.minedJpegs)
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
          {{ isApproved }}</div>
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
        <button @click="contribute" v-if="isApproved"
             class="bg-rob-roy-300 text-black font-semibold rounded-md px-4 py-2 w-10/12 text-center">
          Add contribution
        </button>
        <button v-if="!isApproved" @click="approve"
             class="bg-rob-roy-300 text-black font-semibold rounded-md px-4 py-2 w-10/12 text-center">
           Approve
        </button>
      </div>
    </UFormGroup>
  </div>
</template>

<style scoped>
/* Add your styles here */
</style>
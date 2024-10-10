<script setup lang="ts">
import {ref, reactive} from 'vue'
import {object, string, number, array, type InferType} from 'yup'
import SirButton from "~/components/common/SirButton.vue";
import {placeholder} from "@babel/types";

// Define schema
const schema = object({
  amount: number().min(1).max(100000).required('Required'),
  stablecoin: array().of(string()).required('Required')
})

type Schema = InferType<typeof schema>

const amount = ref(1)
import tokens from "@/assets/token_list.json"
import {useWallet} from "~/composables/useWallet";
import {useErc20} from "~/composables/useErc20";
import {formatNumber} from "chart.js/helpers";

const selected = ref(tokens[1])

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
  if(isConnected.value && selected.value) {
    balance.value = await fetchBalance(selected.value.address, address.value)
  }

}

const amountTo = (percent: number) => {
  amount.value = Math.round(balance.value * percent / 100)
}

onMounted(() => {
  handleChange()
})
</script>

<template>
  <div class="flex flex-col items-stretch p-4 w-full">
    <UFormGroup label="Contribute:" class="w-full ">
      <div class="w-full flex flex-row gap-3 bg-softGray rounded-md p-3">
        <div class="flex flex-col gap-2">
          <UInput :modelValue="amount" type="number" label="Amount" placeholder="100" variant="none"/>
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
          <div class="text-sm italic">Balance: ${{balance.toLocaleString('en-US')}}</div>
          <div class="flex flex-row gap-1 text-cyan text-sm font-semibold">
            <div role="button" @click="amountTo(25)">25%</div>
            <div role="button" @click="amountTo(25)">50%</div>
            <div role="button" @click="amountTo(100)">Max</div>
          </div>
        </div>
      </div>
      <div class="flex w-full gap-3 mt-3 justify-center items-center">
        <div role="button" class="bg-rob-roy-300 text-black font-semibold rounded-md px-4 py-2 w-10/12 text-center" >Add contribution</div>
      </div>
    </UFormGroup>
  </div>
</template>

<style scoped>
/* Add your styles here */
</style>
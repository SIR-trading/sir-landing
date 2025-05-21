<script setup lang="ts">
import data from "@/assets/new-allocations.json";
import { ethers } from "ethers";
import { boolean, object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'

type ValueType = number | string | `0x${string}` | boolean | bigint;
type FieldType = { label: string, value: ValueType };

const DIGITS: Record<string, number> = {
  "sir": 12,
  "eth": 18,
  "weth": 18,
  "wbtc": 8,
  "usdc": 6,
  "usdt": 6
}

const formatFieldData = (_key: string, _value: ValueType) => {
  let value: ValueType = '';
  ;

  if (typeof _value === 'number' || typeof _value === 'boolean' || ethers.isAddress(_value)) {
    value = _value;
  }
  else if (typeof _value === 'string') {
    const prefix = _key.split('_')[0].toLowerCase();
    const _v = (_value as string).replace(/,/g, '');
    value = DIGITS[prefix] ? ethers.formatUnits(BigInt(_v), DIGITS[prefix]) : _v;
  }
  return {
    label: _key
      .split('_')
      .map(w => w.charAt(0).toUpperCase() + w.substring(1).toLowerCase())
      .join(' '),
    value: value.toString()
  }
}

const formattedList = data.allocations.map(record => {
  // Extract keys and values from the record
  return Object.entries(record).map(([key, value]) =>
    formatFieldData(key, value)
  );
})

const filterOptions = data.allocations.map(record => record.address);
const schema = object({
  walletAddress: string().matches(/0x[a-fA-F0-9]{40}$/),
  showZeroValues: boolean().default(false)
})

type Schema = InferType<typeof schema>

const state = reactive<Schema>({
  walletAddress: undefined,
  showZeroValues: false
})

const EXCLUDED = [
  "Iscontract",
  "Allocation In Basis Points",
  "Address"
]
const foundRecord = computed(() => {
  return formattedList.find(record => record.find(field => field.label === "Address")?.value === state.walletAddress);
})


const removeExcluded = (value: FieldType, index: number, arr: Array<{ label: string, value: ValueType }>) => {
  return !EXCLUDED.includes(value.label)
}
const filterZeroValues = (value: FieldType, index: number, arr: Array<{ label: string, value: ValueType }>) => {
  console.log(value.label, ":", Number(value.value), Number(value.value) === 0)
  return Number(value.value) !== 0;
}
const record = computed(() => {
  const cleanRecord = foundRecord.value?.filter(removeExcluded)
  return state.showZeroValues ? cleanRecord : cleanRecord?.filter(filterZeroValues)
})


const { address, isConnected } = useWallet();
const setOnWalletChange = ref<boolean>(false);
const useConnectedWallet = () => {
  if (!isConnected.value) return;
  setOnWalletChange.value = true;
  state.walletAddress = address.value;
}

const isWalletConnected = computed(() => isConnected.value);
const connectedAddress = computed(() => address.value)

watch(connectedAddress, (_address) => {
  if (_address && setOnWalletChange) {
    state.walletAddress = _address;
  }
})

const handleConnectedWalletLink = () => {
  if (!isWalletConnected.value) return;

  setOnWalletChange.value = !setOnWalletChange.value;
  if (setOnWalletChange.value)
    state.walletAddress = connectedAddress.value;
}
</script>

<template>
  <div class="space-y-10 w-full lg:w-1/2">
    <UForm :state="state" :schema="schema" class="flex items-center justify-center w-full flex-col gap-2 py-2">

      <UFormGroup label="Filters" class="">
        <div class="w-md max-w-md min-w-md">
          <UInputMenu v-model="state.walletAddress" :options="filterOptions" placeholder="select or insert an address"
            variant="outline" color="primary" />

        </div>
        <div class="flex justify-around items-center max-w-md mt-3">

          <UCheckbox label="Show zero values" name="zero-values" v-model="state.showZeroValues" />
          <UButton v-if="isWalletConnected" size="xs" variant="link" color="gray"
            :label="setOnWalletChange ? 'dont use connected wallet' : 'use connected wallet'"
            :leading-icon="setOnWalletChange ? 'lucide:unlink' : 'lucide:link'" @click="handleConnectedWalletLink" />
        </div>
      </UFormGroup>
      <UFormGroup>
      </UFormGroup>
    </UForm>
    <div v-if="foundRecord" class="animated-height space-y-1 text-sm lg:min-w-xl">

      <div v-for="field in record" class="bg-white/5 p-2 rounded-lg">
        <div class="grid grid-cols-2 gap-2">
          <div class="text-left">{{ field.label }}</div>
          <div class="text-right">{{ field.value }}</div>

        </div>
      </div>
    </div>
    <div v-else>
      <div v-if="state.walletAddress === '' || state.walletAddress === undefined" class="py-4 lg:p-8">
        Select an address or {{ !isWalletConnected && 'connect and use wallet' }}
        <UButton v-if="isWalletConnected" variant="link" label="use connected wallet" @click="useConnectedWallet" />
        <span v-else class="flex justify-center mt-4">
          <WalletConnect />
        </span>
      </div>
      <div v-else>Wallet not found!
      </div>
    </div>
  </div>
</template>

<style>
.animated-height {
  transition: height 0.3s ease-in-out;
  overflow: hidden;
  /* Ensures content doesn't overflow during transition */
}
</style>

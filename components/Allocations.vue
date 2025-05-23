<script setup lang="ts">
import data from "@/assets/new-allocations.json";
import { ethers } from "ethers";
import { boolean, object, string, type InferType } from 'yup';
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

const LABELS: Record<string, string> = {
  sir_balance:              'SIR Balance',
  sir_liquidity_mining:     'Unclaimed LPing SIR Rewards',
  sir_unminted_contributor: 'Unclaimed Presale SIR',
  sir_staked:               'Staked SIR',
  sir_sir:                  'SIR in Liquidity & Leverage Positions',
  sir_uniswapV2:            'SIR in Uniswap V2 Pools',
  sir_uniswapV3:            'SIR in Uniswap V3 Pools',
  SIR_TOTAL_BALANCE:        'Total SIR Balance',
  eth_sir:                  'ETH in Liquidity & Leverage Positions',
  eth_uniswapV2:            'ETH in Uniswap V2 Pools',
  eth_uniswapV3:            'ETH in Uniswap V3 Pools',
  WETH_TOTAL_BALANCE:       'Total ETH Balance',
  wbtc_sir:                 'BTC in Liquidity & Leverage Positions',
  usdc_sir:                 'USDC in Liquidity & Leverage Positions',
  usdt_sir:                 'USDT in Liquidity & Leverage Positions',
  SIR_ENTITLED:             'SIR Entitled',
  allocationInBillionParts: 'Allocation Relaunch (% of total supply)',
  allocationOld: 'Previous Allocation'
}

const HIGHLIGHT_LABELS = [
  LABELS.SIR_TOTAL_BALANCE,
  LABELS.WETH_TOTAL_BALANCE,
  LABELS.SIR_ENTITLED,
  'Allocation Relaunch'
]

const formatFieldData = (_key: string, _value: ValueType) => {
  let value: ValueType = '';
  let key: string | undefined;

  if (typeof _value === 'number' || typeof _value === 'boolean' || ethers.isAddress(_value)) {
    const numValue = Number(_value)

    switch (_key) {
      case "allocationInBillionParts":
        value = numValue !== 0
          ? (numValue / 10000000).toPrecision(2).toString().concat('%')
          : numValue;
        key = "Allocation Relaunch"
        break;
      case "allocationOld":
        value = numValue !== 0
          ? (numValue / 100).toFixed(2).toString().concat('%')
          : numValue;
        key = "Previous Allocation"
        break;
      default:
        value = _value;
    }

  } else if (typeof _value === 'string') {
    const prefix = _key.split('_')[0].toLowerCase();
    const _v = _value.replace(/,/g, '');
    const parsedValue = DIGITS[prefix]
      ? ethers.formatUnits(BigInt(_v), DIGITS[prefix])
      : _v;

    if (!isNaN(Number(parsedValue))) {
      const numValue = Number(parsedValue);
      value = new Intl.NumberFormat('en-US', {}).format(numValue)
    } else {
      console.log("____________", _key)
      value = parsedValue;
    }
  }

  // 3) pick label: first from LABELS, then your key override, then title-case
  const label = LABELS[_key]
    || key
    || _key
      .split('_')
      .map(w => w.charAt(0).toUpperCase() + w.substring(1).toLowerCase())
      .join(' ');

  return {
    label,
    value: value.toString()
  }
}

const formattedList = data.allocations.map(record => {
  // Extract keys and values from the record, excluding 'allocationOld'
  return Object.entries(record)
    .filter(([key, value]) => key !== 'allocationInBasisPoints')
    .map(([key, value]) => formatFieldData(key, value));
});

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
  return formattedList.find(record => record.find(field => field.label === "Address")?.value.toLowerCase() === state.walletAddress?.toLowerCase());
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
  <ClientOnly>
    <div class="space-y-10 w-full lg:w-1/2">
      <UForm :state="state" :schema="schema" class="flex items-center justify-center w-full flex-col gap-2 py-2">

        <div class="w-md lg:w-full min-w-md">
          <UInputMenu v-model="state.walletAddress" :options="filterOptions" placeholder="select or insert an address"
            variant="outline" color="primary" />

        </div>
        <div class="flex justify-around items-center max-w-md mt-3">

          <UCheckbox label="Show zero values" name="zero-values" v-model="state.showZeroValues" />
          <UButton v-if="isWalletConnected" size="xs" variant="link" color="gray"
            :label="setOnWalletChange ? 'dont use connected wallet' : 'use connected wallet'"
            :leading-icon="setOnWalletChange ? 'lucide:unlink' : 'lucide:link'" @click="handleConnectedWalletLink" />
        </div>
      </UForm>
      <div v-if="foundRecord" class="animated-height space-y-1 text-sm lg:min-w-xl">

        <div v-for="field in record" 
          :key="field.label"
          :class="[
            'p-2 rounded-lg',
            HIGHLIGHT_LABELS.includes(field.label)
              ? 'bg-white/15'   /* slightly stronger tint—swap this for your exact hex or Tailwind slot */
              : 'bg-white/5'
          ]">
          <div class="grid grid-cols-[2fr_1fr] gap-2">
            <div class="text-left">{{ field.label }}</div>
            <div class="text-right">{{ field.value }}</div>
          </div>
        </div>
      </div>
      <div v-else>
        <div v-if="state.walletAddress === '' || state.walletAddress === undefined" class="py-4 lg:p-8">
          Select an address or {{ !isWalletConnected && 'connect wallet' }}
          <UButton v-if="isWalletConnected" variant="link" label="use connected wallet" @click="useConnectedWallet" />
          <span v-else class="flex justify-center mt-4">
            <WalletConnect />
          </span>
        </div>
        <div v-else>Wallet not found!
        </div>
      </div>
    </div>
  </ClientOnly>

</template>

<style>
.animated-height {
  transition: height 0.3s ease-in-out;
  overflow: hidden;
  /* Ensures content doesn't overflow during transition */
}
</style>

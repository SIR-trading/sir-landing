<script setup lang="ts">

const props = defineProps({
  amount: {
    type: Number,
    required: true
  }
})
const {amount} = props
const saleStore = useSaleStore()

const allocationPreview = computed((): number => {
  return amount * 1679
})



const futureAllocation = computed((): number => {
  return (
      saleStore.contributions.amountWithdrawableNoDecimals
      + saleStore.contributions.amountFinalNoDecimals
      + amount
  ) * 1679
})


</script>

<template>
  <div class="p-3 w-full flex flex-row justify-around gap-3 bg-[#ffffff15] rounded-md text-sm">
    <div class="flex flex-col gap-3 justify-start">
      <span class="font-bold">Token allocation:</span>
    </div>
    <div class="flex flex-col gap-3 justify-start">
      <div>
        {{ new Intl.NumberFormat('en-US', {}).format(futureAllocation)}}
        <span class="font-semibold">SIR</span>
      </div>
    </div>
    <div class="flex flex-col justify-start gap-3">
                <span class="text-green-500 text-sm italic">
                  (+{{ new Intl.NumberFormat('en-US', {}).format(allocationPreview)}})
                </span>
    </div>
  </div>
</template>

<style scoped></style>

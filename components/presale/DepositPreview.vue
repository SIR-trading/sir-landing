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
  return amount * 1209
})



const futureAllocation = computed((): number => {
  return (
      saleStore.contributions.amountWithdrawableNoDecimals
      + saleStore.contributions.amountFinalNoDecimals
      + amount
  ) * 1209
})

const bonusPreview = computed((): number => {
  const _amount = !!amount ? amount : 1
  const bonus = 72.54 * _amount
      * (
          saleStore.contributions.lockedButerinCards.amount
          + saleStore.contributions.lockedMinedJpegs.amount
          + saleStore.selectedItems.length

      )
  return Math.floor(bonus)
})

const futureBonus = computed((): number => {
  const _amount = !!amount ? amount : 1
  const bonus = 72.54 * (
          _amount
          + saleStore.contributions.amountWithdrawableNoDecimals
          + saleStore.contributions.amountFinalNoDecimals
      )
      * (
          saleStore.contributions.lockedButerinCards.amount
          + saleStore.contributions.lockedMinedJpegs.amount
          + saleStore.selectedItems.length
      )
  return Math.floor(bonus)
})
</script>

<template>
  <div class="p-3 w-full flex flex-row justify-around gap-3 bg-[#ffffff15] rounded-md text-sm">
    <div class="flex flex-col gap-3 justify-start">
      <span class="font-bold">Token allocation:</span>
      <span class="font-bold">Bonus allocation:</span>
      <span class="font-bold">Bonus level:</span>
    </div>
    <div class="flex flex-col gap-3 justify-start">
      <div>
        {{ new Intl.NumberFormat('en-US', {}).format(futureAllocation)}}
        <span class="font-semibold">SIR</span>
      </div>
      <div>{{ new Intl.NumberFormat('en-US', {}).format(futureBonus)}}
        <span class="font-semibold">SIR</span>
      </div>
      <span class="font-bold">{{(saleStore.itemsLocked + saleStore.selectedItems.length) * 6}}%</span>
    </div>
    <div class="flex flex-col justify-start gap-3">
                <span class="text-green-500 text-sm italic">
                  (+{{ new Intl.NumberFormat('en-US', {}).format(allocationPreview)}})
                </span>
      <span class="text-green-500 text-sm italic">
                  (+{{ new Intl.NumberFormat('en-US', {}).format(bonusPreview)}})</span>
      <span class="text-green-500">+{{saleStore.selectedItems.length * 6}}%</span>
    </div>
  </div>
</template>

<style scoped></style>

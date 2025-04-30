<script setup lang="ts">


import {useWallet} from '~/composables/useWallet';
import { useSaleClient } from "~/composables/useSaleClient";

const wallet = useWallet();
const saleStore = useSaleStore();

const eth = useSaleClient();
const maxContribution = await eth.maxContributions();
const {manualSaleLimit} = useRuntimeConfig().public;
const saleLimit :number = manualSaleLimit ? parseInt(manualSaleLimit) : maxContribution;
provide<number>('saleLimit', saleLimit);

const bullets = [
  {
    // Join the SIR token sale, <span class="font-semibold text-redAccent">capped at $100K</span>,
    // under a projected <span class="font-semibold text-redAccent">$3.6M valuation</span> after three years of issuance.
    i: 1,
    text: '<span class="font-semibold text-redAccent">SIR issues tokens at a constant rate indefinitely.</span> '+
    '4.17% of total emissions in the first 3 years are allocated to the public sale. '+
    'SIR\'s <span class="font-semibold text-redAccent">implied valuation</span> at the 3-year mark <span class="font-semibold text-redAccent">is $3.6M</span>.'
  },
  {
    i: 2,
    text: 'We are currently <span class="font-semibold text-redAccent">conducting 3 private audits</span>. '+
    'After the sale, up to $50K will fund a <span class="font-semibold text-redAccent">public bug bounty</span>. '+
    'Once the audit process is complete, the relaunch is estimated <span class="font-semibold text-redAccent">to happen 1 month after the sale concludes</span>.',
  },
  {
    i: 3,
    text: 'The SIR token is a <span class="font-semibold text-redAccent">decentralized share of the protocol</span>. '+
    'Stakers receive a share of the protocol fees, converted and <span class="font-semibold text-redAccent">paid out in ETH</span>. '+
    'For more details, please see our <a href="https://docs.sir.trading/" target="_blank" class="underline">documentation</a>.'
  }
];

const chartLegend = [
  {label: "Liquidity providers", color: "bg-[#CC9901]"},
  {label: "Team & Contributors", color: "bg-[#6A3C99]"},
  {label: "Presale", color: "bg-[#44AA99]"},
  {label: "Public sale", color: "bg-[#882255]"},
  {label: "Treasury", color: "bg-[#CC6677]"},
  {label: "Compensation fund (victims of the hack)", color: "bg-[#117733]"},
]

definePageMeta({
  middleware: ['geoblock']
})

</script>

<template>
  <UContainer>
    <CommonSection variant="background">
      <template #header>SIR Token Public Sale</template>
      <div v-if="saleStore.hasSaleEnded" class="flex flex-col section-text-block w-full mt-0 mb-6">
        <p>
          <span class="font-semibold text-redAccent">The public sale is over.</span>
          After our ongoing private audits and a pending public bug bounty, we will relaunch SIR.
          We expect to be <span class="font-semibold text-redAccent">live about 1 month after the sale</span>.
        </p>
      </div>
      <div v-else class="flex flex-col section-text-block w-full mt-0 mb-6">
        <p>
          The <span class="font-semibold text-redAccent">first version of <a href="https://x.com/DecurityHQ/status/1906270316935942350" target="_blank" class="underline">SIR was exploited</a></span> due to an overlooked critical bug,
          draining our full <span class="font-semibold text-redAccent">$355K TVL after just one month live</span>.
          We are now raising funds through a public sale to finance multiple <span class="font-semibold text-redAccent">private audits</span>
          and a <span class="font-semibold text-redAccent">public audit</span>.
        </p><p>
          SIR offers a <span class="font-semibold text-redAccent">one-of-its-kind leverage primitive</span> built for long-term holders.
          We are committed to honoring our believers and bringing SIR back stronger, with every vulnerability patched.
        </p><p>
          By participating, you help make the <span class="font-semibold text-redAccent">SIR relaunch</span> a reality.
        </p>
      </div>
      <div class="flex flex-col md:flex-row md:justify-evenly w-full mb-3">
        <CommonSirProgressBar/>
      </div>
      <div class="flex flex-col md:flex-row items-center md:justify-end w-full">
        <WalletConnect/>
      </div>
    </CommonSection>

    <CommonSection variant="background" v-if="wallet.isConnected">
      <template #header>{{ saleStore.hasSaleEnded ? 'Your Allocation' : 'Contribute' }}</template>
      <div class="flex flex-col gap-3 w-full items-center">
        <div v-if="!saleStore.hasSaleEnded" class="flex flex-col  md:flex-row gap-3 md:gap-6 w-full p-1 md:py-3 md:px-6">
          <div class="flex flex-col w-full gap-3 text-left">
            <p><span class="font-semibold text-redAccent">1. Select a Stablecoin:</span> Choose one of the supported stablecoins—USDT, USDC, or DAI—for your contribution.</p>
            <p><span class="font-semibold text-redAccent">2. Make Contributions:</span> You can make multiple contributions during the sale.</p>
          </div>
          <div class="flex flex-col w-full gap-3 text-left">
            <p><span class="font-semibold text-redAccent">3. Withdrawal Flexibility:</span> If you change your mind, you have the flexibility to withdraw your contributions within 24 hours.</p>
            <p><span class="font-semibold text-redAccent">4. Token Unlock Schedule:</span> SIR tokens will unlock gradually over a period of three years to avoid sudden dumps into the market.</p>
          </div>
        </div>
        <div v-else class="flex flex-col section-text-block w-full mt-0 mb-6">
          <p>
            Below you'll see your total stablecoin contribution and the SIR tokens you'll receive.
            Once SIR relaunches, your tokens will immediately <span class="font-semibold text-redAccent">vest linearly over the next three years</span>.
          </p>
        </div>
        <SaleContribute/>
      </div>
    </CommonSection>
    <CommonSection variant="background">
      <template #header>How it works</template>
      <div class="flex flex-col md:flex-row md:justify-evenly w-full">
        <CommonSirCard size="xs" v-for="bullet in bullets" :key="bullet.i">
          <template #header>
            <div class="rounded-xl font-black text-rob-roy-300 ring-2 ring-rob-roy-300 text-center py-3 px-4">
              {{ bullet.i }}
            </div>
          </template>
          <p class="p-3 text-left" v-html="bullet.text"></p>
        </CommonSirCard>
      </div>
      <div class="flex flex-col md:flex-row md:justify-evenly items-center w-full p-6 gap-12 md:gap-0 ">
        <div class="flex flex-col w-full p-0 md:p-12 gap-y-8">
          <p class="flex flex-col font-bold">
            <span>Token issuance</span>
            <span>for the first three years</span>
          </p>
          <picture>
            <img alt="Emissions for the first 3 years" src="/sale_first_three_years.png" class="block mx-auto h-[345px] w-auto object-contain"/>
          </picture>
        </div>
        <div class="flex flex-col w-full p-0 md:p-12 gap-y-8">
          <p class="flex flex-col font-bold">
            <span>Token issuance</span>
            <span>after three years</span>
          </p>
          <picture>
            <img alt="Emissions after the 3rd year" src="/sale_after_three_years.png" class="block mx-auto h-[345px] w-auto object-contain"/>
          </picture>
        </div>
      </div>
      <div class="flex flex-row flex-wrap justify-center items-center w-full p-6 gap-6 ">
        <div v-for="item in chartLegend" :key="item.label" class="flex flex-inline items-center gap-1">
          <div :class="['w-[1rem] h-[1rem] rounded-full', ` ${item.color}`]"/>
          {{ item.label }}
        </div>
      </div>
    </CommonSection>
    <footer class="footer">
      <div>
        <ULink to="/sale_disclaimer">Sale discaimer</ULink>
      </div>
    </footer>
  </UContainer>
</template>

<style scoped>
h6 {
  @apply text-gray-400;
}

.paragraphs p {
  margin-bottom: 1rem;
}

footer {
  @apply flex flex-col items-center justify-center w-full py-10;
}
</style>
<script setup lang="ts">
import Section from '@/components/common/Section.vue'
import SirHero from "~/components/common/SirHero.vue";
import SirCard from "~/components/common/SirCard.vue";
import SirProgressBar from "~/components/common/SirProgressBar.vue";
import SirButton from "~/components/common/SirButton.vue";

import {useRouter} from 'vue-router'

const router = useRouter()

const goTo = (_path: string) => {
  router.push({path: _path})
}

</script>

<template>
  <UContainer>
    <SirHero image="hero_image_borderless.png">
      <template #title>
        Safer Leverage for Long-term Investors
      </template>
    </SirHero>
<!--    <Section class-name="mb-0" variant="background">-->
<!--      <template #header>Project founding progress</template>-->
<!--      <div class="section-text-block mt-0 mb-3">-->
<!--        <p>-->
<!--          By being an early patreon you help covering development costs. In return you get SIR tokens that...-->
<!--        </p>-->
<!--      </div>-->
<!--      <SirProgressBar/>-->
<!--      <div class="mt-6 flex flex-row w-full justify-center md:justify-end">-->
<!--        <SirButton label="Contribute" @clicked="goTo('/fundraising')"/>-->
<!--      </div>-->
<!--    </Section>-->
    <ClientOnly>
      <Section class-name="mb-0" variant="background">
        <template v-slot:header>What is SIR?</template>
        <div class="flex flex-col gap-6 w-full items-center justify-center">
          <div class="section-text-block">
            <p>
              SIR brings a fresh approach to leveraged investing in DeFi, offering compounding returns without the usual
              drawbacks. Unlike
              traditional approaches to leverage, SIR does away with maintenance fees and removes
              <a href="https://www.etf.com/sections/etf-basics/why-do-leveraged-etfs-decay">volatility decay</a>.
            </p>
            <p>
              Users only
              pay when they
              open or close a position, in contrast with many platforms that charge ongoing fees, eating into long-term
              returns.
            </p>
          </div>
          <div class="flex flex-col w-full justify-center items-center">
            <EthSirChart/>
            <p class="text-xs italic mt-2">Example of ETH/USDC position in SIR with simulated perfect constant x1.5
              leverage
              versus
              <a href="https://www.opyn.co/squeeth?ct=IT" class="underline">Squeeth from Opyn</a>
            </p>
          </div>
          <div class="section-text-block">
            <p>
              SIR achieves these improvements by controlling its own internal liquidity pools. This enables continuous
              virtual
              rebalancing,
              ensuring steady leverage without costly external transactions.
            </p>
            <p>The result is a safer, more efficient way to
              gain
              amplified,
              compounding returns over the long term.</p>
          </div>
        </div>
      </Section>
      <Section variant="background">
        <template v-slot:header>Permissionless & Trustless</template>
        <div class="section-text-block">
          <p>SIR is designed as a DeFi primitive, focusing on being maximally trustless and permissionless.</p>
          <p>Like Uniswap, anyone can create a vault, specifying a pair of tokens and a leverage ratio. The protocol
            runs
            on unchangeable
            smart contracts with fixed parameters, eliminating risks from unexpected changes.</p>
          <p>After its beta phase, SIR's unstoppable code will be completely immutable, living on Ethereum forever.</p>
          <p>This trustless architecture, combined with reliable price oracles, establishes SIR as a fundamental 'money
            lego' in the DeFi ecosystem.</p>
        </div>
        <!--        <div class="h-64 bg-gray-400 my-6 rounded-lg"></div>-->
      </Section>
      <Section variant="background">
        <template v-slot:header>Gentlemen & Apes</template>
        <div class="flex flex-col gap-12 lg:gap-0 lg:flex-row items-center lg:items-start lg:justify-between w-full">
          <SirCard image="/gentlemen_card.png" size="md">
            <p><b>Gentlemen</b> provide liquidity to the protocol. They earn fees for doing so and potentially also
              rewards
              in
              the
              native token SIR. As LPers, gentlemen also get their own token TEA.</p>
          </SirCard>
          <SirCard image="/apes_card.png" size="md">
            <p><b>Apes</b> choose which pair they want to long, and which leverage. They pay upfront fees for minting
              and
              burning, but not during their position. APE is a leveraged token that can be transferred and used in other
              protocols.</p>
          </SirCard>
        </div>
      </Section>
      <Section variant="background">
        <template v-slot:header>SIR: a Fee Paying Token</template>
        <div class="section-text-block">
          <p>
            SIR is the native token of the SIR protocol. Unlike ad-hoc tokens added later and controlled by admin keys,
            the SIR token is an integral part of the core protocol, making it immutable. Stakers of SIR receive a
            portion of the fees generated by the protocol, incentivizing long-term participation.
          </p>
          <p>
            The token is issued at a constant rate of 2015M tokens per year indefinitely. This approach ensures early
            liquidity providers (LPers) benefit from reduced competition, while later LPers continue to enjoy the
            permanent liquidity mining program.
          </p>
        </div>
      </Section>
      <Section variant="background">
        <template v-slot:header>SIR Token Sale</template>
        <div class="flex flex-col gap-12 lg:gap-0 lg:flex-row items-center lg:items-start h-full lg:justify-between w-full">
          <div class="flex flex-col gap-3 md:gap-6 w-full h-full items-center p-0 md:p-3 justify-center text-center">
            <p class="p-header">Token Allocation and Fundraising Goal</p>
            <p>
              We have designated 10-13% of all SIR tokens issued during the initial three-year period for our public
              token
              sale. Our objective is to raise up to $500,000 to cover essential expenses, including:
            </p>
            <ul class="flex flex-col gap-y-3 p-x-0 w-full text-center list-outside">
              <li>Smart contract audits</li>
              <li>Contract deployments</li>
              <li>Bootstrapping liquidity</li>
              <li>Other operational costs</li>
            </ul>
          </div>
          <div class="flex flex-col gap-3 md:gap-6 w-full h-full items-center p-0 md:p-3  justify-center text-center">
            <p class="p-header flex flex-col"><span>Fair</span><span> Distribution Model</span></p>
            <p>In the spirit of the early ICO era, we are embracing a fair distribution model. As cypherpunks committed
              to maximum fairness, we are implementing the following principles:</p>
            <ul class="flex flex-col gap-y-3 p-x-0 w-full text-center list-outside">
              <li>No private sale</li>
              <li>No pre-sales</li>
              <li>No multiple rounds with various discounts</li>
            </ul>
          </div>
          <div class="flex flex-col gap-3 md:gap-6 w-full h-full items-center p-0 md:p-3  justify-center text-center">
          <p class="p-header">Bonus for Existing Community Members</p>
            <p>
              To reward our loyal community members, we're offering a special bonus for holders of
              <a class="underline" href="https://opensea.io/collection/mined-jpeg">Mined JPEG(MJ)</a> or
              <a class="underline" href="https://opensea.io/collection/buterin-cards">Buterin Cards(BC)</a>:
            </p>
            <ul class="flex flex-col gap-y-3 p-x-0 w-full text-center list-outside">
            <li>Lock your MJ or BC for one year to receive extra tokens</li>
              <li>Earn 5% additional tokens for each locked MJ or BC</li>
              <li>Maximum bonus capped at 30%</li>
            </ul>
          </div>
        </div>
        <p class="mt-6 p-0 md:p-12">This bonus structure allows participants to acquire up to 30% more tokens during the sale, based on their
          existing holdings and willingness to lock them for a year.</p>
      </Section>
    </ClientOnly>
  </UContainer>
</template>

<style scoped>


.paragraphs p {
  margin-bottom: 0.25rem;
}
</style>

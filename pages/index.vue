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
        Leverage with a one-time fee,<br>keep the rest for yourself
      </template>
    </SirHero>
    <Section class-name="mb-0" variant="background">
      <template #header>SIR Token Presale</template>
      <div class="flex flex-col section-text-block mt-0 mb-6">
        <p>
          <span class="font-semibold text-redAccent">The sale is over.</span> Check your contribution here.
        </p>
      </div>
      <SirProgressBar/>
      <div class="mt-6 flex flex-row w-full justify-center md:justify-end">
        <SirButton :label="'Check contribution'" @clicked="goTo('/sale')"/>
      </div>
    </Section>
    <ClientOnly>
      <Section class-name="mb-0" variant="background">
        <template v-slot:header>What is Synthetics Implemented Right (SIR)?</template>
        <div class="flex flex-col gap-6 w-full items-center justify-center">
          <div class="section-text-block">
            <p>
              SIR brings a fresh approach to leveraged investing in DeFi,
              offering compounding returns without the usual drawbacks.
              Unlike traditional approaches to leverage,
              <span class="font-semibold text-redAccent">
                SIR does away with maintenance fees and removes
              <a href="https://www.etf.com/sections/etf-basics/why-do-leveraged-etfs-decay">volatility decay</a>
              </span>.
            </p>
            <p>
              Users
              <span class="font-semibold text-redAccent">pay a fixed amount when they open or close a position</span>,
              in contrast with many platforms that charge ongoing fees, eating into long-term returns.
            </p>
          </div>
          <div class="flex flex-col w-full justify-center items-center">
            <EthSirChart/>
            <p class="text-xs italic mt-2">Example of simulated ETH/USDC position in SIR with perfect constant x1.5
              leverage versus
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
            <p>The result is
              <span class="font-semibold text-redAccent">a safer, more efficient way to
              gain
              amplified,
              compounding returns</span>
              over the long term.</p>
          </div>
        </div>
      </Section>
      <Section variant="background">
        <template v-slot:header>SIR: a Fee Paying Token</template>
        <div class="section-text-block flex flex-col md:flex-row items-center">
          <img alt="pile of coins" :src="'/pile_of_coins.png'" class="h-full object-cover md:w-1/4 md:mr-4 w-full max-w-xs mx-auto"/>
          <div class="section-text-block">
            <p>
              SIR is the native token of the SIR protocol. Unlike most DeFi tokens,
              the SIR token issuance is immutable and part of the core protocol.
              The SIR token is designed to have strong fundamentals,
              <span class="font-semibold text-redAccent">rewarding its stakers with a share of the protocol's generated fees</span>.
            </p>
            <p>
              The token is primarily <span class="font-semibold text-redAccent">distributed to liquidity providers</span> at a rate of 2,015 million tokens per year,
              in perpetuity. To maintain a proportional stake in the protocol,
              providing liquidity is necessary.
            </p>
          </div>
        </div>
      </Section>
      <Section variant="background">
        <template v-slot:header>Permissionless & Trustless</template>
        <div class="section-text-block">
          <div class="flex flex-col md:flex-row gap-3 w-full items-center justify-center md:justify-start">
            <div
                class="bullet-point w-8 h-8 md:flex-shrink-0 text-sm">
              1
            </div>
            <p>SIR is designed as a DeFi primitive, focusing on being maximally trustless and permissionless.</p>
          </div>
          <div class="flex flex-col md:flex-row gap-3 w-full items-center justify-center md:justify-start">
            <div class="bullet-point w-8 h-8 md:flex-shrink-0 text-sm">
              2
            </div>
            <p>Like Uniswap,
              <span class="font-semibold text-redAccent">anyone can create a vault</span>,
              specifying a pair of tokens and a leverage ratio.
              The protocol runs on immutable smart contracts
              with fixed parameters, eliminating risks from unexpected changes.</p>
          </div>
          <div class="flex flex-col md:flex-row gap-3 w-full items-center justify-center md:justify-start">
            <div class="bullet-point w-8 h-8 md:flex-shrink-0 text-sm">
              3
            </div>
            <p>After its beta phase, SIR's unstoppable code will be
              <span class="font-semibold text-redAccent">completely immutable, living on Ethereum forever</span>.
            </p>
          </div>
          <p>This trustless architecture, combined with reliable price oracles, establishes SIR as a fundamental 'money
            lego' in the DeFi ecosystem.</p>
        </div>
      </Section>
      <Section variant="background-p0">
        <template v-slot:header>Gentlemen & Apes</template>
        <div class="flex flex-col gap-12 lg:gap-0 lg:flex-row items-center lg:items-start lg:justify-evenly w-full">
          <SirCard image="/gentlemen_card.jpg" size="md">
            <p>Gentlemen <span class="font-semibold text-redAccent">
                provide liquidity to the protocol</span>. They earn fees for doing so, and on selected vaults, also rewards in the native token SIR.
              Their LP positions are tokenized in the form of an ERC-1155 called TEA.
            </p>
          </SirCard>
          <SirCard image="/ape_card.jpg" size="md">
            <p>Apes <span class="font-semibold text-redAccent">choose which pair they want to long, and what leverage</span>.
              They pay upfront fees for minting and burning, but not while holding their positions.
              APE is a leveraged ERC-20 token that can be transferred and used in other protocols.</p>
          </SirCard>
        </div>
      </Section>
      <Section variant="background">
        <template #header>Team</template>
        <Team />
      </Section>
    </ClientOnly>
  </UContainer>
</template>

<style scoped>


.paragraphs p {
  margin-bottom: 0.25rem;
}
</style>

<script setup lang="ts">
import Section from '@/components/common/Section.vue'
import SirHero from "~/components/common/SirHero.vue";
import SirCard from "~/components/common/SirCard.vue";

const links = [
  {
    name: 'Mint',
    to: '/mint',
    variant: 'outline'
  }
]
</script>
<template>
  <UContainer>
    <SirHero image="logo_240x240.png">
      <template #title>
        Safer Leverage for
        <span class="text-primary inline-block">Long-term</span> Investors
      </template>
      <template #description>
        Get X by doing Y. On Z
      </template>
    </SirHero>
    <Section class-name="px-0">
      <div class="flex flex-col md:flex-row md:justify-between w-full">
        <h2 class="font-['Lora'] font-bold  text-xl">Be part of the SIR fundraising</h2>
        <UButton color="green" variant="solid" size="sm">
          <span class="text-white text-sm">Learn more</span>
        </UButton>
      </div>
      <UProgress class="my-6" size="5xl" :value="70"></UProgress>
    </Section>
    <Section class-name="px-0 mb-0">
      <template v-slot:header>What is SIR?</template>
      <p>
        SIR introduces a new approach to leveraged investing, offering compounding returns without maintenance fees or
        volatility decay. Instead users pay fees, only, when opening or closing a position. SIR maintains constant
        leverage through continuous virtual rebalancing, backed by internal liquidity pools. This provides a potentially
        safer way to access amplified, compounding returns on assets over the long term.
      </p>
    </Section>
    <Section class-name="px-0 mt-0">
        <div class="flex flex-col w-full justify-center items-center">
          <NuxtImg src="/static_chart_bg.png" alt="ETH/USDC Leverages Chart" sizes="sm:640px md:768px lg:1000px" class="rounded-lg ring-1 ring-gray-suit-950" />
          <p class="text-xs italic mt-2">Example of ETH/USDC position in SIR with simulated perfect constant x1.5 leverage versus
            <a href="https://www.opyn.co/squeeth?ct=IT" class="text-blue-bell-500">Squeeth from Opyn</a>
          </p>
        </div>
    </Section>
    <Section class-name="px-0">
      <template v-slot:header>Gentlemen & Apes</template>
      <div class="flex flex-col lg:flex-row items-center lg:items-start lg:justify-between w-full">
        <SirCard image="https://placehold.co/396x226" size="md">
          <p><b>Gentlemen</b> provide liquidity to the protocol. They earn fees for doing so and potentially also rewards
          in
          the
          native token SIR. As LPers, gentlemen also get their own token TEA.</p>
        </SirCard>
        <SirCard image="https://placehold.co/396x226" size="md">
          <p><b>Apes</b> choose which pair they want to long, and which leverage. They pay upfront fees for minting and
          burning, but not during their position. APE is a leveraged token that can be transferred and used in other
          protocols.</p>
        </SirCard>
      </div>
    </Section>
    <Section class-name="px-0">
      <template v-slot:header>Permissionless & Trustless</template>
      <template v-slot:content>
        Just like in Uniswap, anyone can create a vault which consist of a pair of tokens and a leverage ratio. The
        protocol aims to be permissionless and maximally trustless. After the beta phase its unstoppable code will be
        completely immutable and live on Ethereum forever.
        <div class="h-64 bg-gray-400 my-6 rounded-lg"></div>
      </template>
    </Section>
    <Section class-name="px-0">
      <template v-slot:header>Contribute</template>
      <div class="flex flex-col lg:flex-row items-center lg:items-start lg:justify-between w-full">
        <SirCard image="https://placehold.co/396x226" size="md">
          <template v-slot:header>Cover project costs</template>
          <p>
            We are raising a small amount to pay for audits, deployment costs, initial liquidity and any other necessary
            expenses.
          </p>
          <p>
            In exchange we have allocated 10% of all SIR tokens issued during the first three years.
          </p>
        </SirCard>
        <SirCard image="https://placehold.co/396x226" size="md">
          <template v-slot:header>Equal opportunities</template>
          <p>We want to go back to the fair distribution model popular during the early ICO mania.</p>

          <p>SIR has no private sales, and no multiple rounds. Everyone is given the same chance at the same price.</p>

          <p>If you lock Buterin Cards or Mined JPEG NFT for 1 year, you can get up to 20% more tokens.</p>
        </SirCard>
      </div>
    </Section>
    <Section class-name="px-0">
      <template v-slot:header>SIR: a Fee Paying Token</template>
      <div class="flex flex-col gap-3">
        <p>
          SIR is the native token of the SIR protocol. Rather than being an ad-hoc token, it is part of the core
          protocol, meaning after launch none of its parameters can be changed.
        </p>
        <p>
          Staking SIR gives you right to a portion of the fees generated by the SIR protocol.
        </p>
        <p>
          SIR is issued at a constant rate of 2015M tokens/year.
        </p>
        <p>
          During the first 3 years 70% of the tokens will go to gentlemen (LPers), and 100% after 3 years. 10% of the
          tokens
          in the first 3 years will go fundraising participants, 10% to pre-launch contributors, and 10% to a treasury
          for
          post-launch expenses.
        </p>
        <div class="h-64 bg-gray-600 my-6 rounded-lg"></div>
      </div>
    </Section>
    <Section class-name="px-0">
      <template v-slot:header>Disclaimer for Funders of SIR</template>
      <div class="flex flex-col gap-3">
        <p>By participating in the funding of SIR ("the Protocol"), you acknowledge and agree to the following
          terms:</p>

        <div class="paragraphs">
          <h3>Trustless Launch:</h3>
          <p>The Protocol will be launched in a trustless manner, meaning that once the launch has occurred, the token
            allocations are immutable and cannot be altered by the team or any other entity. This ensures a
            decentralized
            and transparent distribution process.</p>
        </div>

        <div class="paragraphs">
          <h3>Risk of Bugs and Attacks:</h3>
          <p>
            While the development team will make all reasonable efforts to minimize bugs and vulnerabilities through
            thorough testing and, where possible, independent audits, it is impossible to guarantee the complete absence
            of
            bugs or vulnerabilities. By participating, you acknowledge that the Protocol may be subject to bugs,
            vulnerabilities, or attacks that could result in partial or total loss of your funds. The development team,
            contributors, and associated parties shall not be held liable for any loss or damage arising from bugs,
            vulnerabilities, or attacks.
          </p>
        </div>

        <div class="paragraphs">
          <h3>Value of Token SIR:</h3>
          <p>
            The value of the token SIR is highly volatile and can be influenced by a variety of factors beyond the
            control
            of the development team, including market conditions, regulatory changes, and technological advancements.
            The
            development team does not guarantee any specific value of the token SIR and is not responsible for any loss
            of
            value or potential loss of funds associated with the token SIR.
          </p>
        </div>

        <div class="paragraphs">
          <h3>No Financial Advice:</h3>
          <p>
            The information provided on the Protocol's website and in related materials is for informational purposes
            only
            and does not constitute financial, investment, or other professional advice. Participation in the funding of
            the
            Protocol should be based on your own research and assessment of the risks involved.
          </p>

        </div>
        <div class="paragraphs">
          <p class="font-bold">Legal Compliance:</p>
          <p>
            It is your responsibility to ensure that your participation in the funding of the Protocol complies with all
            applicable laws and regulations in your jurisdiction. The development team is not responsible for any legal
            consequences arising from your participation.</p>
          <p>
            Acceptance of Risks: By participating in the funding of the Protocol, you accept all risks associated with
            your
            participation, including but not limited to financial loss, regulatory risk, and technical risks. You agree
            that
            you are participating at your own risk and that the development team, contributors, and associated parties
            shall
            not be held liable for any loss or damage arising from your participation.
          </p>

        </div>
        <p>
          By proceeding with the funding of SIR, you acknowledge that you have read, understood, and agreed to this
          disclaimer in its entirety.
        </p>
      </div>
    </Section>
  </UContainer>
</template>

<style scoped>


.paragraphs p {
  margin-bottom: 0.25rem;
}
</style>

<script lang="ts" setup>

const teamMembers = [
  {name: "@Xatarrer", role: "Founder  / Smart contract dev", link: "", avatar: ""},
  {name: "@realtarpcity", role: "Fronted dev", link: "", avatar: ""},
  {name: "@Abstrucked", role: "Fronted dev", link: "abstrucked", avatar: ""},
  {name: "@MrLivingstream", role: "UX/UI designer", link: "", avatar: ""},
  {name: "@Crashnaut", role: "Community manager", link: "", avatar: ""},
  {name: "@0xjohn", role: "Frontend dev", link: "", avatar: ""},
  {name: "@Pau", role: "Ambassador", link: "", avatar: ""},
]

const thanksTo = [
  {name: "@no_side666", role: "Smart contract analyst", link: "", avatar: ""},
  {name: "@tokenfox", role: "Smart contract analyst", link: "", avatar: ""},
]
const goto = (link: string) => {
  window.open(link, "_blank")
}
</script>

<template>
  <div class="flex flex-col gap-y-12">
    <div class="flex flex-row items-center justify-center gap-12 flex-wrap">
      <div v-for="member in teamMembers" :key="member.name"
           class="flex flex-col items-center justify-center p-1 gap-2 flex-wrap cursor-pointer"
           @click="goto(`https://x.com/${member.link}`)"
      >
        <div class="rounded-full w-[100px] h-[100px] bg-gray-suit-700"></div>
        <div>{{ member.name }}</div>
        <div>{{ member.role }}</div>
      </div>
    </div>
    <div>
      <h2 class="mb-3 sir-text-shadow section-header text-rob-roy-300">A special thanks to</h2>
      <div class="flex flex-row items-center justify-center p-1 gap-2 flex-wrap">
        <div v-for="member in thanksTo" :key="member.name"
             class="flex flex-col items-center justify-center p-1 gap-2 flex-wrap cursor-pointer"
             @click="goto(`https://x.com/${member.link}`)"
        >
          <div class="rounded-full w-[100px] h-[100px] bg-gray-suit-700"></div>
          <div>{{ member.name }}</div>
          <div>{{ member.role }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

<script lang="ts" setup>

const teamMembers = [
  {
    name: "Xatarrer",
    role: "Founder  / Smart contract dev",
    link: "https://x.com/Xatarrer",
    avatar: "team-avatars/xatarrer.jpg"
  },
  {name: "Realtarpcity", role: "Fronted dev", link: "https://x.com/tarpley_travis", avatar: "team-avatars/tarp.jpg"},
  {name: "Abstrucked", role: "Fronted dev", link: "https://x.com/abstrucked", avatar: "team-avatars/abstrucked.jpg"},
  {name: "MrLivingstream", role: "UX/UI designer", link: "https://x.com/MrLivingstream", avatar: "team-avatars/MrLivingstream.jpg"},
  {name: "Crashnaut", role: "Community manager", link: "https://x.com/crashnaut", avatar: "team-avatars/crashnaut.jpg"},
  {name: "0xjohn", role: "Frontend dev", link: "https://x.com/0xjooohn", avatar: "team-avatars/0xjohn.jpg"},
  {name: "Pau", role: "Ambassador", link: "https://x.com/PauChan23", avatar: "team-avatars/pau.jpg"},
]

const thanksTo = [
  {name: "@no_side666", role: "Smart contract analyst", link: "https://x.com/no_side666", avatar: "team-avatars/no_side666.jpg"},
  {name: "@tokenfox", role: "Smart contract analyst", link: "https://x.com/tokenfox1", avatar: "team-avatars/tokenfox.jpg"},
]
const goto = (link: string) => {
  window.open(link, "_blank")
}
</script>

<template>
  <div class="flex flex-col gap-y-12">
    <div class="flex flex-row items-start justify-center gap-12 flex-wrap p-6">
      <div v-for="member in teamMembers" :key="member.name"
           class="flex flex-col items-center justify-center p-1 gap-2 flex-wrap cursor-pointer w-[150px]"
           @click="goto(`https://x.com/${member.link}`)"
      >
        <UAvatar size="4xl" :src="member.avatar" :alt="member.name"/>
        <div class="font-bold text-[24px]">{{ member.name }}</div>
        <div >{{ member.role }}</div>
      </div>
    </div>
    <div>
      <h2 class="mb-3 sir-text-shadow section-header text-rob-roy-300">A special thanks to</h2>
      <div class="flex flex-row items-center justify-center gap-12 p-6 flex-wrap">
        <div v-for="member in thanksTo" :key="member.name"
             class="flex flex-col items-center justify-center p-1 gap-2 flex-wrap cursor-pointer w-[150px]"
             @click="goto(member.link)"
        >
          <UAvatar size="4xl" :src="member.avatar" :alt="member.name"/>
          <div class="font-semibold text-[24px]">{{ member.name }}</div>
          <div >{{ member.role }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

<script lang="ts" setup>

const coreTeamMembers = [
  {
    name: "Xatarrer",
    role: "Founder  / Smart contract dev",
    link: "https://x.com/Xatarrer",
    avatar: "team-avatars/xatarrer.jpg",
    core: true
  },
  {
    name: "Realtarpcity",
    role: "Fronted dev",
    link: "https://x.com/tarpley_travis",
    avatar: "team-avatars/tarp.jpg",
    core: true
  },
  {
    name: "Abstrucked",
    role: "Fronted dev",
    link: "https://x.com/abstrucked",
    avatar: "team-avatars/abstrucked.jpg",
    core: true
  },
  {
    name: "MrLivingstream",
    role: "UX/UI designer",
    link: "https://x.com/MrLivingstream",
    avatar: "team-avatars/MrLivingstream.jpg",
    core: true
  },
]

// const minorTeamMembers = [
//   {name: "Crashnaut", role: "Community manager", link: "https://x.com/crashnaut", avatar: "team-avatars/crashnaut.jpg"},
//   {name: "0xjohn", role: "Frontend dev", link: "https://x.com/0xjooohn", avatar: "team-avatars/0xjohn.jpg"},
//   {name: "Pau", role: "Ambassador", link: "https://x.com/PauChan23", avatar: "team-avatars/pau.jpg"},
// ]
const thanksTo = [
{
    name: "RedTiger",
    role: "Communications manager",
    link: "https://x.com/RedTigerAuditor",
    avatar: "team-avatars/redtiger.jpg"
  },
  {
    name: "Tokenbrice",
    role: "Advisor",
    link: "https://x.com/TokenBrice",
    avatar: "team-avatars/tokenbrice.jpg"
  }
]
const goto = (link: string) => {
  window.open(link, "_blank")
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-y-0">
    <div class="flex flex-row items-start justify-center gap-6 flex-wrap p-1">
      <div v-for="member in coreTeamMembers" :key="member.name"
           class="flex flex-col items-center justify-center p-1 gap-2 flex-wrap cursor-pointer w-[150px]"
           @click="goto(member.link)"
      >
        <UAvatar size="4xl" :src="member.avatar" :alt="member.name"/>
        <div :class="['font-bold', member.core ? 'text-[24px]' : 'text-[18px]']">{{ member.name }}</div>
        <div>{{ member.role }}</div>
      </div>
    </div>
    <div class="flex flex-row items-start justify-center gap-6 flex-wrap p-1">
      <div v-for="member in thanksTo" :key="member.name"
            class="flex flex-col items-center justify-center p-1 gap-2 flex-wrap cursor-pointer w-[150px]"
            @click="goto(member.link)"
      >
        <UAvatar size="4xl" :src="member.avatar" :alt="member.name"/>
        <div :class="['font-bold', member.core ? 'text-[24px]' : 'text-[18px]']">{{ member.name }}</div>
        <div>{{ member.role }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

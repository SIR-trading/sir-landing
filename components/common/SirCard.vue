<script lang="ts" setup>

const props = defineProps<{
  size? : 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  image?: string
  imageAlt?: string
  className?: string
}>()

const {classLink} = helpers()
const classes = computed(() => {
  return classLink([
    'card flex flex-col justify-start rounded-lg', `max-w-${props.size ? `${props.size}` : 'sm'}`,
    props.className ? props.className : ''
  ])
})
</script>

<template>
 <div :class="classes">
   <div v-if="image">
     <img :src="image" class="rounded-lg" :alt="imageAlt"/>
   </div>
   <div class="flex flex-wrap overflow-auto">
     <h4 class="mt-4 font-['Lora'] text-lg font-bold"><slot name="header"/></h4>
     <div class="mt-4  flex flex-col gap-4 flex-wrap "><slot name="default"/></div>
   </div>
   <div><slot name="footer"/></div>
 </div>
</template>

<style scoped>

</style>

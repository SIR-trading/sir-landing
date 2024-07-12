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
   <h4 class="mt-2"><slot name="header"/></h4>
   <div class="text-gray-500 mt-2 text-xl flex flex-col gap-3"><slot name="default"/></div>
   <div><slot name="footer"/></div>
 </div>
</template>

<style scoped>

</style>

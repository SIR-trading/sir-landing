<script lang="ts" setup>

const props = defineProps<{
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  image?: string
  imageAlt?: string
  className?: string
}>()

const { classLink } = helpers()
const classes = computed(() => {
  return classLink([
    'card flex flex-col justify-start rounded-lg', ` w-full md:max-w-${props.size ? `${props.size}` : 'sm'}`,
    props.className ? props.className : ''
  ])
})
</script>

<template>
  <div :class="classes">
    <div v-if="image">
      <img :src="image" class="rounded-lg" :alt="imageAlt" />
    </div>
    <div class="flex flex-col flex-wrap overflow-auto">
      <h4 class="p-4 flex flex-row items-center justify-center">
        <slot name="header" />
      </h4>
      <div class=" flex flex-col flex-wrap">
        <slot name="default" />
      </div>
    </div>
    <div>
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped></style>

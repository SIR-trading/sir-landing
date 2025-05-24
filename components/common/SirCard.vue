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
    'card grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 rounded-lg md:gap-2', ` w-full md:max-w-${props.size ? `${props.size}` : 'sm'}`,
    props.className ? props.className : ''
  ])
})
</script>

<template>
  <div :class="classes">
    <div v-if="image" class="flex justify-center">
      <img :src="image" class="rounded-lg" :alt="imageAlt" />
    </div>
    <div class="flex flex-col flex-wrap overflow-auto gap-2" :class="!image ? 'md:col-span-2 lg:col-span-1' : ''">
      <h4 class="p-4 flex flex-row items-center justify-center">
        <slot name="header" />
      </h4>
      <div class=" flex flex-col flex-wrap lg:p-4">
        <slot name="default" />
      </div>
    </div>
    <div>
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped></style>

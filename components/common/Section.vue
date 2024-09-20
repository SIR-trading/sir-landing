<script setup lang="ts">

const props = defineProps<{
  className?: string,
  variant?: 'ring' | 'background' | 'none'
}>()

const {classLink} = helpers()

const classes = computed(() => {
  return classLink([
    'rounded-lg',
    props.variant === 'ring' ? 'ring-2 ring-gray-800' : '',
    props.variant === 'background' ? 'bg-black-russian-950' : '',
    'p-6 my-12',
    props.className ? props.className : ''
  ])
})
</script>

<template>
  <section
      :class="classLink(
          [className ? className : '', classes]
          )">
    <div class="flex flex-col items-center justify-center gap-1  text-center ">
      <h1 class="section-header sir-text-shadow font-bold text-xl">
        <slot name="header"/>
      </h1>
      <p class="">
        <slot name="content"/>
      </p>
      <slot name="default"></slot>
    </div>
  </section>
</template>

<style scoped></style>

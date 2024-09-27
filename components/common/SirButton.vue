<script lang="ts" setup>
defineProps<{
  label: string,
}>()

defineEmits<{
  clicked: "clicked"
}>()
</script>


<template>
  <div class="relative w-[164px] h-[40px] flex-none order-0 grow-0">
    <div class="absolute w-[164px] h-[40px] -left-0.5 top-0 blur-gradient blur-[12px] z-0"></div>
    <button class="btn-sir" @click="$emit('clicked','clicked')">
      {{ label }}
    </button>
  </div>
</template>

<style scoped lang="css">
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Used in the .btn-sir class*/
.button-blur-gradient {
  background: linear-gradient(90deg, rgba(122, 91, 46, 0.50) 0%, rgba(191, 155, 103, 0.50) 23.23%, rgba(255, 255, 255, 0.50) 50.56%, rgba(191, 155, 103, 0.50) 75.59%, rgba(122, 91, 46, 0.50) 100.12%), #F2C46A;
}

@layer base {
  .btn-sir {
    @apply text-black leading-9 text-[16px] font-inter font-semibold absolute w-[164px] h-[40px] -left-0.5 top-0 button-blur-gradient shadow-md rounded-md flex flex-row justify-center items-center p-2 gap-2 z-10;
  }
}

.blur-gradient {
  border-radius: 6px;
  background: linear-gradient(90deg, rgba(122, 91, 46, 0.50) 0%, rgba(191, 155, 103, 0.50) 23.23%, rgba(255, 255, 255, 0.50) 50.56%, rgba(191, 155, 103, 0.50) 75.59%, rgba(122, 91, 46, 0.50) 100.12%), #F2C46A;
  filter: blur(12px);
}
</style>

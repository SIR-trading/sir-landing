<script lang="ts" setup>
const value = 30; // Change type to number for proper ARIA handling
</script>

<template>
  <div class="relative bg-[#414158] rounded-md w-full p-1 flex flex-wrap"
       role="progressbar"
       :aria-valuenow="value"
       aria-valuemin="0"
       aria-valuemax="100"
       aria-label="Progress for fundraising campaign">
    <div class="absolute rounded-md blur-gradient h-[40px]" :style="'width:'+value+'%'"></div>
    <div class="rounded-md progress-gradient h-[40px]" :style="'width:'+value+'%'">
      <div class="indicator title text-lg">{{ value }}% RAISED</div>
    </div>
  </div>
</template>

<style scoped>
.indicator {
  position: absolute;
  right: 20px; /* Adjust this value to add some padding from the right edge */
  top: 50%;
  transform: translateY(-50%); /* Center vertically */
  color: #F2C46A;
}

.progress-gradient {
  background: linear-gradient(90deg, rgba(122, 91, 46, 0.50) 0%, rgba(191, 155, 103, 0.50) 23.23%, rgba(255, 255, 255, 0.50) 50.56%, rgba(191, 155, 103, 0.50) 75.59%, rgba(122, 91, 46, 0.50) 100.12%), #F2C46A;
}

.blur-gradient {
  border-radius: 6px;
  background: linear-gradient(90deg, rgba(122, 91, 46, 0.50) 0%, rgba(191, 155, 103, 0.50) 23.23%, rgba(255, 255, 255, 0.50) 50.56%, rgba(191, 155, 103, 0.50) 75.59%, rgba(122, 91, 46, 0.50) 100.12%), #F2C46A;
  filter: blur(12px);
}
</style>
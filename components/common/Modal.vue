<!-- ModalComponent.vue -->
<template>
 <teleport to="body">
   <div v-if="isVisible" class="modal-overlay" @click="$emit('close')">
     <div class="modal-content" @click.stop>
       <button class="close-button" @click="$emit('close')">
         x
       </button>
       <slot></slot>
     </div>
   </div>
 </teleport>
</template>

<script lang="ts" setup>

defineProps<{
  isVisible
}>()

defineEmits(["click", "close"]);



</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #0A0A0F;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  max-width: 900px;
  max-height: 80%;
}


.close-button {
  position: absolute;
  top: 10px;
  right: 50px;
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
}
</style>
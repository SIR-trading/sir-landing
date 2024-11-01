<!-- ModalComponent.vue -->
<template>
 <teleport to="body">
   <div v-if="isVisible" class="modal-overlay" @click="$emit('close')">
     <div :class="['modal-content',classList, background, maxWidth,  minWidth]" @click.stop>
       <button class="close-button" @click="$emit('close')">
         <UIcon class="text-white hover:text-red-300" name="material-symbols-light:cancel-outline" dynamic />
       </button>
       <slot></slot>
     </div>
   </div>
 </teleport>
</template>

<script lang="ts" setup>

const props = defineProps<{
  isVisible: boolean,
  modalBackgroundColor?: string,
  maxWidth?: string,
  minWidth?: string,
  classList?: string
}>()

defineEmits(["click", "close"]);

const background = computed(() => {
  const {modalBackgroundColor} = props;
  return modalBackgroundColor ? modalBackgroundColor : 'bg-darkGray'
})

const classList = computed(() => {
  const {classList} = props;
  console.log("classList", classList)
  return classList
})

const maxWidth = computed(() => {
  const {maxWidth} = props;
  return 'max-w-'.concat(maxWidth ? maxWidth : '[900px]');
})
const minWidth = computed(() => {
  const {minWidth} = props;
  return 'min-w-'.concat(minWidth ? minWidth : '[300px]');
})

</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: auto;
}
.modal-content {
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 20px rgba(255, 255, 255, 0.1);
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  max-height: 80%;
}


.close-button {
  position: absolute;
  z-index: 3;
  top: 10px;
  right: 50px;
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
}
</style>

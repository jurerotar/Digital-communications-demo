<template>
  <button
    class="text-white disabled:bg-blue-200 font-semibold py-2 px-4 rounded-xl  justify-center
    duration-300 transition-colors h-12 whitespace-nowrap shadow hover:shadow-lg inline-flex items-center"
    :class="[props.active ? 'bg-blue-700 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600']"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
export interface AppButtonProps {
  active?: boolean;
}
const props = withDefaults(defineProps<AppButtonProps>(), {
  active: false
})
</script>
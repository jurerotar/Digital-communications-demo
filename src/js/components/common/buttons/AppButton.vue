<template>
  <button
    class="text-white disabled:bg-blue-200 font-semibold py-2 px-4 rounded-xl  justify-center
    duration-300 transition-colors h-12 whitespace-nowrap shadow hover:shadow-lg inline-flex items-center"
    :class="[
      ...[variant === 'normal' ? [props.active ? 'bg-blue-700 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'] : []],
      ...[variant === 'danger' ? [props.active ? 'bg-red-700 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'] : []],
      ...[variant === 'confirm' ? [props.active ? 'bg-green-700 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'] : []],
    ]"
  >
    <slot />
  </button>
</template>

<script
  setup
  lang="ts"
>

export interface AppButtonProps {
  active?: boolean;
  variant?: 'normal' | 'confirm' | 'danger';
}

const props = withDefaults(defineProps<AppButtonProps>(), {
  active: false,
  variant: 'normal'
});
</script>
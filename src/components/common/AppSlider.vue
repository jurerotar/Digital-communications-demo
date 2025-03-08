<template>
  <div class="flex flex-col gap-4 min-w-[280px] max-w-[500px]">
    <label
      :for="props.id"
      class="font-medium transition-colors duration-300 dark:text-white text-zinc-900"
    >
      {{ props.label }}
    </label>
    <input
      :id="props.id"
      :min="props.min"
      :max="props.max"
      :step="step"
      :value="props.modelValue"
      class="w-full h-4 bg-blue-100"
      type="range"
      :disabled="disabled"
      @input="emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup lang="ts">
export interface AppSliderProps {
  label: string;
  id: string;
  modelValue: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

const emit = defineEmits(['update:modelValue']);

const props = withDefaults(defineProps<AppSliderProps>(), {
  min: 1,
  max: 100,
  step: 1,
  disabled: false,
});
</script>

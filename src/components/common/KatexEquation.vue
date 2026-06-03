<template>
  <span
    ref="katexParentElement"
    class="hidden"
  >
    <slot />
  </span>
  <span
    :class="[inline ? 'katex-inline' : 'katex-block']"
    v-html="renderedKatex"
  />
</template>

<script setup lang="ts">
import { renderToString } from 'katex';
import { computed, ref, useSlots } from 'vue';
import 'katex/dist/katex.css';

export interface KatexProps {
  inline?: boolean;
}

withDefaults(defineProps<KatexProps>(), {
  inline: false,
});

const slots = useSlots();

const katexParentElement = ref<HTMLSpanElement>();

const contents = computed(() => slots.default?.()[0]?.children as string);
const renderedKatex = computed(() => renderToString(contents.value));
</script>

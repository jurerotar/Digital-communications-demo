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
import { ref, useSlots, computed } from 'vue';
import { renderToString } from 'katex';
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

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

<script
  setup
  lang="ts"
>
import {ref, useSlots, computed} from "vue";
import katex from "katex";

export interface KatexProps {
  inline?: boolean;
}

const props = withDefaults(defineProps<KatexProps>(), {
  inline: false
});

const slots = useSlots();

const katexParentElement = ref<HTMLSpanElement>();

const contents = computed(() => slots.default?.()[0]?.children as string);
const renderedKatex = computed(() => katex.renderToString(contents.value));
</script>
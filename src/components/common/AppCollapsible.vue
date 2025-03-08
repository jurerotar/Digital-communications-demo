<template>
  <details :open="opened">
    <summary
      class="flex whitespace-nowrap justify-start flex-row items-center dark:text-white cursor-pointer transition-colors bg-zinc-200 dark:bg-gray-700 rounded-md py-2 px-4 font-semibold gap-4 w-fit"
      tabindex="0"
    >
      <FontAwesomeIcon
        :icon="faChevronRight"
        class="details-icon inline-flex w-4 h-4"
        aria-hidden="true"
      />
      {{ summary }}
    </summary>
    <div class="my-2 pl-4 ml-4 border-l border-gray-300 border-solid">
      <slot />
    </div>
  </details>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';

export interface AppCollapsibleProps {
  opened?: boolean;
  summary?: string;
}

withDefaults(defineProps<AppCollapsibleProps>(), {
  opened: false,
  summary: 'Razlaga dogajanja',
});
</script>

<style>
details summary::marker {
  display: none;
}

details[open] > summary .details-icon {
  transform: rotate(90deg);
}

summary::-webkit-details-marker {
  display: none;
}
</style>

<template>
  <AppButton
    class="fixed bottom-4 right-4 min-w-[50px]"
    :variant="state === 'playing' ? 'danger' : 'confirm'"
  >
    <span class="flex justify-center gap-2 items-center">
      <FontAwesomeIcon v-if="state === 'playing'" :icon="faPlay" />
      <FontAwesomeIcon v-if="state === 'paused'" :icon="faPause" />
      <span class="hidden lg:flex">
        {{ state === 'playing' ? 'Ustavi animacijo' : 'Nadaljuj animacijo' }}
      </span>
    </span>
  </AppButton>
</template>

<script setup lang="ts">
import AppButton from "@components/common/buttons/AppButton.vue";
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {faPlay, faPause} from '@fortawesome/free-solid-svg-icons';

export interface AppAnimationPauseButtonProps {
  state?: 'playing' | 'paused';
}

withDefaults(defineProps<AppAnimationPauseButtonProps>(), {
  state: 'playing'
});
</script>

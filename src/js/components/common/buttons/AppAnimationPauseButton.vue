<template>
  <AppButton
    class="fixed bottom-4 right-4 min-w-[50px]"
    :variant="state === 'playing' ? 'danger' : 'confirm'"
  >
    <span class="flex justify-center gap-2 items-center">
      <FontAwesomeIcon :icon="['fas', state === 'playing' ? 'pause' : 'play']" />
      <span class="hidden lg:flex">
        {{ state === 'playing' ? 'Ustavi animacijo' : 'Nadaljuj animacijo' }}
      </span>
    </span>
  </AppButton>
</template>

<script setup lang="ts">
import AppButton from "@/js/components/common/buttons/AppButton.vue";
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {faPlay, faPause} from '@fortawesome/free-solid-svg-icons';
import {library} from '@fortawesome/fontawesome-svg-core'

library.add(faPlay, faPause);

export interface AppAnimationPauseButtonProps {
  state?: 'playing' | 'paused';
}

const props = withDefaults(defineProps<AppAnimationPauseButtonProps>(), {
  state: 'playing'
});

</script>
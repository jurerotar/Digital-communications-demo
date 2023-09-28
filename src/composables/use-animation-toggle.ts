import {ref} from "vue";

export const useAnimationToggle = () => {
  const isAnimationPlaying = ref<boolean>(true);

  const toggleIsAnimationPlaying = () => {
    isAnimationPlaying.value = !isAnimationPlaying.value;
  }

  return {
    isAnimationPlaying,
    toggleIsAnimationPlaying
  }
}
import { computed, onBeforeMount, onUnmounted, ref } from 'vue';

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1920,
};

export const useWindowSize = () => {
  const width = ref<number>(0);
  const height = ref<number>(0);

  const onResize = (): void => {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
  };

  onResize();

  onBeforeMount(() => {
    window.addEventListener('resize', onResize);
  });
  onUnmounted(() => {
    window.removeEventListener('resize', onResize);
  });

  const is2XlUp = computed<boolean>(() => width.value >= breakpoints['2xl']);
  const isXlUp = computed<boolean>(() => width.value >= breakpoints.xl);
  const isLgUp = computed<boolean>(() => width.value >= breakpoints.lg);
  const isMdUp = computed<boolean>(() => width.value >= breakpoints.md);
  const isSmUp = computed<boolean>(() => width.value >= breakpoints.sm);

  return {
    height,
    width,
    is2XlUp,
    isXlUp,
    isLgUp,
    isMdUp,
    isSmUp,
  };
};

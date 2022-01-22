import {useStore} from "vuex";
import {State} from "@/js/store/store";
import {onMounted, onUnmounted} from 'vue';

export const linearSpace = (startValue: number, stopValue: number, cardinality: number): number[] => {
  const arr: number[] = [];
  const step: number = (stopValue - startValue) / (cardinality - 1);
  for (let i = 0; i < cardinality; i++) {
    arr.push(startValue + (step * i));
  }
  return arr;
}

export const getCookie = (name: string): string | null => {
  return document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || null;
}

export const scheme = () => {
  const store = useStore<State>();
  const cookie: string = getCookie('color-scheme') ?? 'dark';
  store.commit('appState/setScheme', cookie);
  document.querySelector('html')!.classList.add(cookie);
}

export const attachResizeHandlers = (): void => {
  const store = useStore<State>();
  const onResize = (): void => {
    store.commit('deviceProperties/setWidth', window.innerWidth);
    store.commit('deviceProperties/setHeight', window.innerHeight);
  }
  onResize();
  onMounted(() => {
    window.addEventListener('resize', () => onResize());
  });
  onUnmounted(() => {
    window.removeEventListener('resize', () => onResize());
  });
}

export const appFullTitle = (title: string): string => {
  const appName = "Digitalne komunikacije";
  return `${title} - ${appName}`;
}

export const binaryValues = (pool: number[], changeOn: number): () => number => {
  let counter = 0;
  let currentlyReturnsAtIndex = 0;
  const poolLength: number = pool.length;
  return (): number => {
    counter ++;
    if(counter >= changeOn) {
      counter = 0;
      currentlyReturnsAtIndex = (currentlyReturnsAtIndex === poolLength - 1) ? 0 : currentlyReturnsAtIndex + 1;
    }
    return pool[currentlyReturnsAtIndex];
  }
}
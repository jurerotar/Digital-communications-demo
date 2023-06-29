import {useStore} from "vuex";
import {State} from "@stores/store";
import {onMounted, onUnmounted} from 'vue';

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


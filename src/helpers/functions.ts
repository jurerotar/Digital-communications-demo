import { useStore } from 'vuex';
import { State } from '@stores/store';

export const getCookie = (name: string): string | null => {
  return document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || null;
};

export const scheme = () => {
  const store = useStore<State>();
  const cookie: string = getCookie('color-scheme') ?? 'dark';
  store.commit('appState/setScheme', cookie);
  document.querySelector('html')!.classList.add(cookie);
};

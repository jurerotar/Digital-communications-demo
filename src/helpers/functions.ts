import type { State } from '@stores/store';
import { useStore } from 'vuex';

export const getCookie = (name: string): string | null => {
  return (
    document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`)?.pop() || null
  );
};

export const scheme = () => {
  const store = useStore<State>();
  const cookie: string = getCookie('color-scheme') ?? 'dark';
  store.commit('appState/setScheme', cookie);
  document.querySelector('html')!.classList.add(cookie);
};

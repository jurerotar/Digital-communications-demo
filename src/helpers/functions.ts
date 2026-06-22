import type { Scheme } from '@interfaces/common';
import { useAppStateStore } from '@stores/modules/app-state/app-state';

export const getCookie = (name: string): string | null => {
  return (
    document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`)?.pop() || null
  );
};

export const scheme = () => {
  const appStateStore = useAppStateStore();
  const cookie = getCookie('color-scheme');
  const colorScheme: Scheme =
    cookie === 'light' || cookie === 'dark' ? cookie : 'dark';
  appStateStore.setScheme(colorScheme);
  document.querySelector('html')!.classList.add(colorScheme);
};

import type { Scheme } from '@interfaces/common';
import type { AppState } from '@stores/modules/app-state/app-state.types';
import { defineStore } from 'pinia';

export const useAppStateStore = defineStore('appState', {
  state: (): AppState => ({
    mobileSidebarExtended: false,
    scheme: 'dark',
  }),
  actions: {
    setMobileSidebarExtended(mode: boolean) {
      this.mobileSidebarExtended = mode;
    },
    setScheme(scheme: Scheme) {
      this.scheme = scheme;
    },
  },
});

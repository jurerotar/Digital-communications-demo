import appState from '@stores/modules/app-state/app-state';
import type { AppState } from '@stores/modules/app-state/app-state.types';
import { createStore, type Store } from 'vuex';

export interface State {
  appState: AppState;
}

export const store: Store<State> = createStore({
  modules: {
    appState,
  },
});

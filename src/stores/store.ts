import {createStore, Store} from 'vuex';
import appState from '@stores/modules/app-state/app-state';
import {AppState} from "@stores/modules/app-state/app-state.types";

export interface State {
  appState: AppState,
}

export const store: Store<State> = createStore({
  modules: {
    appState,
  }
});

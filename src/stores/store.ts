import {createStore, Store} from 'vuex';
import appState from '@stores/modules/app-state/app-state';
import deviceProperties from '@stores/modules/device-properties/device-properties';
import {AppState} from "@stores/modules/app-state/app-state.types";
import {DeviceProperties} from "@stores/modules/device-properties/device-properties.types";

export interface State {
  appState: AppState,
  deviceProperties: DeviceProperties
}

export const store: Store<State> = createStore({
  modules: {
    deviceProperties,
    appState,
  }
});

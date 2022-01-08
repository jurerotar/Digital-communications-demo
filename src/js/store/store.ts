import {createStore, Store} from 'vuex';
import appState from '@/js/store/modules/app-state/app-state';
import deviceProperties from '@/js/store/modules/device-properties/device-properties';
import {AppState} from "@/js/store/modules/app-state/app-state.types";
import {DeviceProperties} from "@/js/store/modules/device-properties/device-properties.types";

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

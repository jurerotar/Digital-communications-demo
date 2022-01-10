import {AppState} from "@/js/store/modules/app-state/app-state.types";
import {Scheme} from "@/js/types/types";

const state = (): AppState => ({
  mobileSidebarExtended: false,
  scheme: 'dark',
});

const mutations = {
  setMobileSidebarExtended(state: AppState, mode: boolean) {
    state.mobileSidebarExtended = mode;
  },
  setScheme(state: AppState, scheme: Scheme) {
    state.scheme = scheme;
  }
}

const getters = {}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}

import {AppState, Scheme} from "@/js/store/modules/app-state/app-state.types";

const state = (): AppState => ({
  mobileSidebarExtended: false,
  scheme: 'dark',
});

const mutations = {
  setSidebarExtended(state: AppState, mode: boolean) {
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

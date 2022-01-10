import {DeviceProperties} from "@/js/store/modules/device-properties/device-properties.types";
import constants from "@/js/helpers/constants/constants";

const state = (): DeviceProperties => ({
  width: 0,
  height: 0,
});

const mutations = {
  setWidth(state: DeviceProperties, width: number) {
    state.width = width;
  },
  setHeight(state: DeviceProperties, height: number) {
    state.height = height;
  },
}

const getters = {
  isLgUp(state: DeviceProperties): boolean {
    return state.width >= constants.breakpoints.lg;
  },
  isMdUp(state: DeviceProperties): boolean {
    return state.width >= constants.breakpoints.md;
  },
  isSmUp(state: DeviceProperties): boolean {
    return state.width >= constants.breakpoints.sm;
  },
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}

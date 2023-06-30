<template>
  <button
    class="switcher__tab w-20 cursor-pointer flex flex-row relative bg-gray-200 dark:bg-gray-700 p-1 rounded-3xl items-center
    justify-center h-8 transition-all duration-300"
    tabindex="0"
    @click="toggleScheme()"
  >
    <span
      v-for="colorScheme in schemes"
      :key="colorScheme.key"
      :class="[scheme === colorScheme.key ? 'switcher__front' : 'switcher__back']"
      class="flex flex-row justify-center items-center w-full h-full absolute top-0 left-0 transition-transform duration-300"
    >
      <FontAwesomeIcon
        :icon="colorScheme.icon"
        class="text-sm mr-1 text-gray-800 transition-colors duration-300 dark:text-white"
      />
      <span class="text-sm text-gray-800 dark:text-white transition-colors duration-300 select-none font-medium">
        {{ colorScheme.label }}
      </span>
    </span>
  </button>
</template>

<script setup lang="ts">
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {useStore} from "vuex";
import {State} from "@stores/store";
import {computed} from "vue";
import {faMoon, faSun} from "@fortawesome/free-regular-svg-icons";
import {IconDefinition} from "@fortawesome/free-brands-svg-icons";
import {Scheme as ColorScheme} from "@interfaces/common";

export interface Scheme {
  key: ColorScheme;
  label: string;
  icon: IconDefinition;
}

const store = useStore<State>();
const scheme = computed<Scheme>(() => store.state.appState.scheme);

const schemes: Scheme[] = [
  {
    key: 'light',
    label: 'Light',
    icon: faSun
  },
  {
    key: 'dark',
    label: 'Dark',
    icon: faMoon
  },
];

const toggleScheme = (): void => {
  const nextScheme: string = scheme.value === 'light' ? 'dark' : 'light';
  const classList: DOMTokenList = document.querySelector('html')!.classList;
  classList.remove(scheme.value);
  classList.add(nextScheme);
  store.commit('appState/setScheme', nextScheme);
  const now: Date = new Date();
  now.setTime(now.getTime() + 86400000 * 365);
  document.cookie = `color-scheme=${nextScheme}; expires=${now.toUTCString()}; path=/`;
}
</script>

<style>
.switcher__tab {
    -webkit-tap-highlight-color: transparent;
}

.switcher__front {
    transform: rotateX(0);
    opacity: 1;
}

.switcher__back {
    opacity: 0;
    transform: rotateX(-180deg);
    backface-visibility: hidden;
}
</style>
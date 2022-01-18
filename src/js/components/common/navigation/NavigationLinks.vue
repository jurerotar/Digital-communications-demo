<template>
  <div class="flex flex-col items-start lg:mt-10 gap-2 w-full">
    <router-link
      v-for="route in routes"
      :key="route.name"
      :to="route.path"
      class="flex text-lg justify-start items-center gap-4 font-medium transition-colors duration-300 text-zinc-900 dark:text-white w-full
      p-2 rounded-lg hover:dark:bg-gray-800 hover:bg-gray-200 w-full"
      :class="{'dark:bg-gray-800 bg-gray-200': currentRoute === route.path}"
      tabindex="0"
      @click="linkClick(route)"
    >
      <font-awesome-icon
        :icon="route.icon"
        :fixed-width="true"
      />
      {{ route.label }}
    </router-link>
    <scheme-switcher v-if="!isLgUp" />
    <app-github-icon v-if="!isLgUp" />
  </div>
</template>

<script
  setup
  lang="ts"
>
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {Route, routes} from '@/js/routes/routes';
import SchemeSwitcher from "@/js/components/common/navigation/SchemeSwitcher.vue";
import AppGithubIcon from "@/js/components/common/icons/AppGithubIcon.vue";
import {useStore} from "vuex";
import {State} from "@/js/store/store";
import {computed} from "vue";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faWaveSquare, faWater, faLongArrowAltUp, faHome, faSignal, faEye} from "@fortawesome/free-solid-svg-icons";
import {useRoute} from "vue-router";

library.add(faWaveSquare, faLongArrowAltUp, faHome, faWater, faSignal, faEye);

const store = useStore<State>();
const isLgUp = computed<boolean>(() => store.getters['deviceProperties/isLgUp']);

const routeObject = useRoute();
const currentRoute = computed<string>(() => routeObject.path);

const linkClick = (route: Route): void => {
  store.commit('appState/setMobileSidebarExtended', false);
  document.title = route.label;
}
</script>

<style>
.svg-inline--fa.fa-up-long.fa-fw {
  transform: rotate(45deg);
}
</style>
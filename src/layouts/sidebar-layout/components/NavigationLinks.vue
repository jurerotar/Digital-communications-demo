<template>
  <div class="flex flex-col items-start lg:mt-10 gap-2 w-full">
    <RouterLink
      v-for="route in routes"
      :key="route.name"
      :to="route.path"
      class="flex text-lg justify-start items-center gap-4 font-medium transition-colors duration-300 text-zinc-900 dark:text-white w-full
      p-2 rounded-lg hover:dark:bg-gray-800 hover:bg-gray-200"
      :class="{'dark:bg-gray-800 bg-gray-200': currentRoute === route.path}"
      tabindex="0"
      @click="linkClick()"
    >
      <FontAwesomeIcon
        :icon="route.icon"
        :fixed-width="true"
      />
      {{ route.label }}
    </RouterLink>
    <SchemeSwitcher v-if="!isLgUp" />
    <AppGithubIcon v-if="!isLgUp" />
  </div>
</template>

<script
  setup
  lang="ts"
>
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {routes} from '@routes/routes';
import {useStore} from "vuex";
import {State} from "@stores/store";
import {computed, onUpdated} from "vue";
import {useRoute} from "vue-router";
import {useWindowSize} from "@composables/use-window-size";
import SchemeSwitcher from "./SchemeSwitcher.vue";
import AppGithubIcon from "./GithubIcon.vue";

const store = useStore<State>();
const {isLgUp, width} = useWindowSize();
const routeObject = useRoute();

onUpdated(() => {
  console.log(width);
});

const currentRoute = computed<string>(() => routeObject.path);

const linkClick = (): void => {
  store.commit('appState/setMobileSidebarExtended', false);
}

</script>
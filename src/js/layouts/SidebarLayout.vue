<template>
  <!-- Top navigation -->
  <nav
    class="dark:bg-gray-900 transition-colors duration-300 relative flex flex-row justify-between lg:justify-end items-center top-0
      left-0 h-16 w-full lg:max-w-top-bar lg:ml-72 bg-gray-100 px-4 py-2 shadow-md"
  >
    <logo v-if="!isLgUp" />
    <top-navigation-links v-if="isLgUp" />
    <hamburger-menu v-if="!isLgUp" />
  </nav>
  <!-- Sidebar navigation -->
  <nav
    class="dark:bg-gray-900 transition-all duration-300 flex flex-col p-4 items-start fixed bg-gray-100 shadow-lg top-0 left-0 h-full
      w-full max-w-sidebar-mobile lg:max-w-sidebar transform lg:-translate-x-0 bg-white z-30"
    :class="[mobileSidebarExtended ? 'translate-x-0' : '-translate-x-full']"
  >
    <logo v-if="isLgUp" />
    <navigation-links />
  </nav>

  <router-view />
</template>

<script
  setup
  lang="ts"
>
import {computed} from 'vue';
import HamburgerMenu from "@/js/components/common/HamburgerMenu.vue";
import Logo from "@/js/components/common/Logo.vue";
import NavigationLinks from "@/js/components/common/NavigationLinks.vue";
import TopNavigationLinks from "@/js/components/common/TopNavigationLinks.vue";
import {useStore} from "vuex";
import {State} from "@/js/store/store";
import {attachResizeHandlers, scheme} from "@/js/helpers/functions";

const store = useStore<State>();

const mobileSidebarExtended = computed<boolean>(() => store.state.appState.mobileSidebarExtended);
const isLgUp = computed<string>(() => store.getters['deviceProperties/isLgUp']);
console.log(isLgUp);
scheme();
attachResizeHandlers();
</script>
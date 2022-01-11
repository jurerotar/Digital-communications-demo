<template>
  <!-- Top navigation -->
  <nav class="dark:bg-gray-900 transition-colors duration-300 relative h-16 w-full bg-gray-100 shadow-md">
    <div class="max-w-[1920px] mx-auto flex justify-between items-center w-full h-full px-4 py-2">
      <app-logo />
      <top-navigation-links v-if="isLgUp" />
      <hamburger-menu v-if="!isLgUp" />
    </div>
  </nav>
  <div class="max-w-[1920px] mx-auto flex">
    <!-- Sidebar navigation -->
    <nav
      class="transform colors-300 lg:bg-gray-900 shadow:2xl transition-transform w-full max-w-full styled-scrollbar
            p-2 fixed z-10 top-16 left-0 h-[calc(100vh-4rem)] overflow-y-scroll
            max-w-[18rem] lg:translate-x-0 lg:h-screen lg:top-0 lg:sticky"
      :class="[mobileSidebarExtended ? 'translate-x-0' : '-translate-x-full']"
    >
      <navigation-links />
    </nav>
    <!-- View -->
    <router-view />
  </div>
</template>

<script
  setup
  lang="ts"
>
import {computed} from 'vue';
import HamburgerMenu from "@/js/components/common/navigation/HamburgerMenu.vue";
import AppLogo from "@/js/components/common/AppLogo.vue";
import NavigationLinks from "@/js/components/common/navigation/NavigationLinks.vue";
import TopNavigationLinks from "@/js/components/common/navigation/TopNavigationLinks.vue";
import {useStore} from "vuex";
import {State} from "@/js/store/store";

const store = useStore<State>();
const mobileSidebarExtended = computed<boolean>(() => store.state.appState.mobileSidebarExtended);
const isLgUp = computed<string>(() => store.getters['deviceProperties/isLgUp']);
</script>
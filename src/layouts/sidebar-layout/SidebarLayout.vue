<template>
  <!-- Top navigation -->
  <nav
    class="dark:bg-gray-900 transition-colors duration-300 relative flex flex-row justify-between lg:justify-end items-center top-0left-0 h-16 w-full lg:max-w-[calc(100%-18rem)] lg:ml-72 bg-gray-100 px-4 py-2 shadow-md"
  >
    <Logo v-if="!isLgUp" />
    <TopNavigationLinks v-if="isLgUp" />
    <HamburgerMenu v-if="!isLgUp" />
  </nav>
  <!-- Sidebar navigation -->
  <nav
    class="dark:bg-gray-900 transition-all duration-300 flex flex-col p-4 items-start fixed bg-gray-100 shadow-lg top-0 left-0 h-full w-full max-w-[16rem] lg:max-w-[18rem] transform lg:-translate-x-0 bg-white z-30"
    :class="[mobileSidebarExtended ? 'translate-x-0' : '-translate-x-full']"
  >
    <Logo v-if="isLgUp" />
    <NavigationLinks />
  </nav>

  <RouterView />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import { State } from '@stores/store';
import { useWindowSize } from '@composables/use-window-size';
import HamburgerMenu from './components/HamburgerMenu.vue';
import Logo from './components/Logo.vue';
import NavigationLinks from './components/NavigationLinks.vue';
import TopNavigationLinks from './components/TopNavigationLinks.vue';

const store = useStore<State>();
const mobileSidebarExtended = computed<boolean>(() => store.state.appState.mobileSidebarExtended);
const { isLgUp } = useWindowSize();
</script>

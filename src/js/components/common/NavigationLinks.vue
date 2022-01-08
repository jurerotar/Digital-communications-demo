<template>
  <div class="flex flex-col items-start lg:mt-10">
    <router-link
      v-for="route in routes"
      :key="route.name"
      :to="route.path"
      class="inline-flex text-lg my-1 font-medium transition-colors duration-300 dark:text-white"
      @click="linkClick(route)"
    >
      {{ route.label }}
    </router-link>
    <scheme-switcher
      v-if="!isWideScreen"
      class="my-2"
    />
    <a
      v-if="!isWideScreen"
      href="https://github.com/jurerotar/digital-communications-demo"
      rel="noopener"
    >
      <font-awesome-icon
        :icon="['fab', 'github']"
        class="text-3xl dark:text-white transition-colors duration-300"
      />
    </a>
  </div>
</template>

<script>
import {routes} from '@/js/routes/routes.ts';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import '@/js/types/types.ts';
import SchemeSwitcher from "@/js/components/common/SchemeSwitcher.vue";

export default {
  name: "NavigationLinks",
  components: {
    SchemeSwitcher,
    FontAwesomeIcon
  },
  data() {
    return {
      /**
       * Routes are defined in @/routes/routes.ts array
       * @type {Route[]}
       */
      routes: routes
    }
  },
  computed: {
    isWideScreen() {
      return this.$store.getters['app/isWideScreen'];
    }
  },
  methods: {
    linkClick(routeObject) {
      this.$store.commit('app/toggleMobileSidebar', false);
      document.title = routeObject.label;
    },
  }
}
</script>
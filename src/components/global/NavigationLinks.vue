<template>
    <div class="flex flex-col items-start lg:mt-10">
        <router-link v-for = "route in routes" :key = "route.name" :to = "route.path" @click = "linkClick(route)"
        class = "inline-flex text-lg my-1 font-medium transition-colors duration-300 dark:text-white">{{ route.label }}</router-link>
        <scheme-switcher v-if = "!isWideScreen" class = "my-2"></scheme-switcher>
        <a v-if = "!isWideScreen" href = "https://github.com/jurerotar/digital-communications-demo" rel = "noopener" >
            <font-awesome-icon :icon="['fab', 'github']" class="text-3xl dark:text-white transition-colors duration-300"></font-awesome-icon>
        </a>
    </div>
</template>

<script>
import {routes} from '@/routes/routes.js';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import '@/types.js';
import SchemeSwitcher from "@/components/global/SchemeSwitcher";

export default {
    name: "NavigationLinks",
    components: {
        SchemeSwitcher,
        FontAwesomeIcon
    },
    data() {
        return {
            /**
             * Routes are defined in @/routes/routes.js array
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
<template>
    <div class="flex flex-col items-start lg:mt-10">
        <span class = "font-bold text-gray-500">Povezave</span>
        <router-link v-for = "route in routes" :key = "route.name" :to = "route.path"
        class = "inline-flex text-lg my-1 font-medium">{{ route.label }}</router-link>
        <a v-if = "!isWideScreen" href = "https://github.com/jurerotar/open-source-spectrum-analyzer" rel = "noopener" >
            <font-awesome-icon :icon="['fab', 'github']" class="text-3xl"></font-awesome-icon>
        </a>
    </div>
</template>

<script>
import {routes} from '@/routes/routes.js';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
export default {
    name: "NavigationLinks",
    components: {
        FontAwesomeIcon
    },
    data() {
        return {
            /**
             * Routes are defined in @/routes/routes.js array
             */
            routes: routes
        }
    },
    computed: {
        isWideScreen() {
            return this.$store.getters['app/isWideScreen'];
        }
    }
}
</script>
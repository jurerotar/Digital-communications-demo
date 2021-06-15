<template>
    <div class="flex flex-row items-center justify-end">
        <scheme-switcher v-if = "isWideScreen" class = "lg:mr-1"></scheme-switcher>
        <a v-if = "isWideScreen" href = "https://github.com/jurerotar/digital-communications-demo" class = "ml-4" rel = "noopener" >
            <font-awesome-icon :icon="['fab', 'github']" class="text-3xl transition-colors duration-300 dark:text-white"></font-awesome-icon>
        </a>
    </div>
</template>

<script>
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import SchemeSwitcher from "@/components/global/SchemeSwitcher";

export default {
    name: "TopNavigationLinks",
    components: {
        SchemeSwitcher,
        FontAwesomeIcon
    },
    computed: {
        isWideScreen() {
            return this.$store.getters['app/isWideScreen'];
        }
    }
}
</script>
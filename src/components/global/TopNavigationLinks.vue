<template>
    <div class="flex flex-row items-center justify-end">
        <a v-if = "isWideScreen" href = "https://github.com/jurerotar/digital-communications-demo" class = "ml-4" rel = "noopener" >
            <font-awesome-icon :icon="['fab', 'github']" class="text-3xl"></font-awesome-icon>
        </a>
    </div>
</template>

<script>
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

export default {
    name: "TopNavigationLinks",
    components: {
        FontAwesomeIcon
    },
    computed: {
        isWideScreen() {
            return this.$store.getters['app/isWideScreen'];
        }
    }
}
</script>
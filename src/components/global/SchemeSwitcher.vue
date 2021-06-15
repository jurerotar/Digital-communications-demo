<template>
    <div @click = "changeScheme()"
         class="switcher__tab w-20 cursor-pointer flex flex-row relative bg-gray-700 p-1 rounded-3xl items-center justify-center h-8 transition-all duration-300">
        <div v-for="scheme in schemes" :key="scheme.key"
             :class="[mode === scheme.key ? 'switcher__front' : 'switcher__back']"
             class="flex flex-row justify-center items-center w-full h-full absolute top-0 left-0 transition-transform duration-300"
        >
            <font-awesome-icon :icon = "scheme.icon" class = "text-sm mr-1 text-white"></font-awesome-icon>
            <p class="text-sm text-white select-none font-medium">
                {{ scheme.label }}
            </p>
        </div>
    </div>
</template>

<script>
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';

export default {
    name: 'SchemeSwitcher',
    components: {
        FontAwesomeIcon
    },
    data() {
        return {
            schemes: [
                {
                    key: 'light',
                    label: 'Light',
                    icon: ['far', 'sun']
                },
                {
                    key: 'dark',
                    label: 'Dark',
                    icon: ['far', 'moon']
                },
            ]
        }
    },
    computed: {
        mode() {
            return this.$store.state.app.scheme;
        },
    },
    methods: {
        changeScheme() {
            const nextScheme = this.mode === 'light' ? 'dark' : 'light';
            const classList = document.querySelector('body').classList;
            classList.remove(this.mode);
            classList.add(nextScheme);
            this.$store.commit('app/setScheme', nextScheme);
            const now = new Date();
            now.setTime(now.getTime() + 86400000 * 365);
            document.cookie = `color-scheme=${nextScheme}; expires=${now.toUTCString()}; path=/`;
        }
    },
};
</script>

<style>
.switcher__tab {
    -webkit-tap-highlight-color: transparent;
}

.switcher__front {
    transform: rotateX(0);
    opacity: 1;
}

.switcher__back {
    opacity: 0;
    transform: rotateX(-180deg);
    backface-visibility: hidden;
}
</style>
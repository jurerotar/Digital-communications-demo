<template>
    <!-- Top navigation -->
    <nav class = "dark:bg-gray-900 transition-colors duration-300 relative flex flex-row justify-between lg:justify-end items-center top-0 left-0 h-16 w-full lg:max-w-top-bar lg:ml-72 bg-gray-100 px-4 py-2 shadow-md">
        <logo v-if = "!isWideScreen"></logo>
        <top-navigation-links v-if = "isWideScreen"></top-navigation-links>
        <hamburger-menu v-if = "!isWideScreen"></hamburger-menu>
    </nav>
    <!-- Sidebar navigation -->
    <nav class = "dark:bg-gray-900 transition-all duration-300 flex flex-col p-4 items-start fixed bg-gray-100 shadow-lg top-0 left-0 h-full w-full max-w-sidebar-mobile lg:max-w-sidebar transform lg:-translate-x-0 bg-white z-30"
    :class = "[sidebarExtended ? 'translate-x-0' : '-translate-x-full']">
        <logo v-if = "isWideScreen"></logo>
        <navigation-links></navigation-links>
    </nav>
    <router-view></router-view>
</template>

<script>
import HamburgerMenu from "@/components/global/HamburgerMenu";
import Logo from "@/components/global/Logo";
import NavigationLinks from "@/components/global/NavigationLinks";
import TopNavigationLinks from "@/components/global/TopNavigationLinks";

export default {
    name: 'SidebarLayout',
    components: {TopNavigationLinks, NavigationLinks, Logo, HamburgerMenu},
    created() {
        if(this.scheme === null) {
            const cookie = this.getCookieValue('color-scheme') ?? 'dark';
            this.$store.commit('app/setScheme', cookie);
            document.querySelector('body').classList.add(cookie);
        }
    },
    mounted() {
        this.commitOnResize();
        window.addEventListener('resize', () => this.commitOnResize());
    },
    computed: {
        scheme() {
            return this.$store.state.app.scheme;
        },
        sidebarExtended() {
            return this.$store.state.app.mobileSidebarExtended;
        },
        isWideScreen() {
            return this.$store.getters['app/isWideScreen'];
        }
    },
    methods: {
        commitOnResize() {
            this.$store.commit('app/setWidth', window.innerWidth);
            this.$store.commit('app/setHeight', window.innerHeight);
        },
        getCookieValue(name) {
            return document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || null;
        }
    }
}
</script>
<template>
    <!-- Top navigation -->
    <nav class = "relative flex flex-row justify-between lg:justify-end items-center top-0 left-0 h-16 w-full lg:max-w-top-bar lg:ml-72 bg-gray-100 px-4 py-2 shadow-md">
        <logo v-if = "!isWideScreen"></logo>
        <top-navigation-links v-if = "isWideScreen"></top-navigation-links>
        <hamburger-menu v-if = "!isWideScreen"></hamburger-menu>
    </nav>
    <!-- Sidebar navigation -->
    <nav class = "flex flex-col p-4 items-start fixed bg-gray-100 shadow-lg top-0 left-0 h-full w-full max-w-sidebar-mobile lg:max-w-sidebar transform lg:-translate-x-0 duration-300 transition-transform bg-white z-30"
    :class = "[sidebarExtended ? 'translate-x-0' : '-translate-x-full']">
        <logo v-if = "isWideScreen"></logo>
        <navigation-links></navigation-links>
    </nav>
    <main-component></main-component>
</template>

<script>
import MainComponent from "@/components/global/MainComponent";
import HamburgerMenu from "@/components/global/HamburgerMenu";
import Logo from "@/components/global/Logo";
import NavigationLinks from "@/components/global/NavigationLinks";
import TopNavigationLinks from "@/components/global/TopNavigationLinks";
export default {
    name: 'SidebarLayout',
    components: {TopNavigationLinks, NavigationLinks, Logo, HamburgerMenu, MainComponent},
    mounted() {
        this.$store.commit('app/setWidth', window.innerWidth);
        this.$store.commit('app/setHeight', window.innerHeight);
        window.addEventListener('resize', () => {
            this.$store.commit('app/setWidth', window.innerWidth);
            this.$store.commit('app/setHeight', window.innerHeight);
        });
    },
    computed: {
        sidebarExtended() {
            return this.$store.state.app.mobileSidebarExtended;
        },
        isWideScreen() {
            return this.$store.getters['app/isWideScreen'];
        }
    },
}
</script>
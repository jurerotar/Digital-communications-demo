import { createWebHistory, createRouter } from "vue-router";
import Home from "@/pages/Home";
import Spectrum from "@/pages/Spectrum";
import Harmonics from "@/pages/Harmonics";
import Modulations from "@/pages/Modulations";
import Pointers from "@/pages/Pointers";
import '../types';
/**
 * Registered routes
 * @type {Array<Route>}
 */
const routes = [
    {
        path: "/",
        name: "Home",
        label: 'Domov',
        component: Home
    },
    {
        path: "/spectrum",
        name: "Spectrum",
        label: 'Spekter',
        component: Spectrum
    },
    {
        path: "/modulations",
        name: "Modulations",
        label: 'Modulacije',
        component: Modulations
    },
    {
        path: "/harmonics",
        name: "Harmonics",
        label: 'Harmoniki',
        component: Harmonics
    },
    {
        path: "/pointers",
        name: "Pointers",
        label: 'Kazalci',
        component: Pointers
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export {routes};
export {router};

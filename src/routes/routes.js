import { createWebHistory, createRouter } from "vue-router";
import Home from "@/pages/Home";
import FourierSeries from "@/pages/FourierSeries";
import Spectrum from "@/pages/Spectrum";

/**
 * Registered routes
 * @type {[{path: string, component: {components: {}, name: string}, name: string}]}
 */
const routes = [
    {
        path: "/",
        name: "Home",
        label: 'Domov',
        component: Home
    },
    {
        path: "/fourier-series",
        name: "FourierSeries",
        label: 'Fouriereva vrsta',
        component: FourierSeries
    },
    {
        path: "/spectrum",
        name: "Spectrum",
        label: 'Spekter',
        component: Spectrum
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export {routes};
export {router};

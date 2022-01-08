import {createWebHistory, createRouter, Router} from "vue-router";
import Home from "@/js/views/Home.vue";
import Spectrum from "@/js/views/Spectrum.vue";
import Harmonics from "@/js/views/Harmonics.vue";
import Modulations from "@/js/views/Modulations.vue";
import Pointers from "@/js/views/Pointers.vue";

export interface Route {
  path: string;
  name: string;
  label: string;
  // TODO: Type this
  component: any;
}

const routes: Route[] = [
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

const router: Router = createRouter({
    history: createWebHistory(),
    routes,
});

export {routes};
export {router};

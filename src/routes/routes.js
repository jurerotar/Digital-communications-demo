import { createWebHistory, createRouter } from "vue-router";
import Home from "@/pages/Home";

/**
 * Registered routes
 * @type {[{path: string, component: {components: {}, name: string}, name: string}]}
 */
const routes = [
    {
        path: "/",
        name: "Home",
        component: Home
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;

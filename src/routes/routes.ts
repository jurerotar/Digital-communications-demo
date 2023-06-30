import {createRouter, createWebHistory, Router} from "vue-router";
import {MetaObject, Route} from "@routes/routes.types";
import {appFullTitle} from "@helpers/functions";

const routes: Route[] = [
  {
    path: "/",
    name: "Home",
    label: 'Domov',
    component: () => import("@views/HomeView.vue"),
    icon: ['fas', 'home'],
    meta: {
      title: "Domov",
      properties: [
        {propertyName: "twitter:title", propertyType: "name", content: "Domov"},
        {propertyName: "og:title", propertyType: "property", content: "Domov"},
      ]
    }
  },
  {
    path: "/spectrum",
    name: "Spectrum",
    label: 'Spekter',
    component: () => import("@views/SpectrumView.vue"),
    icon: ['fas', 'wave-square'],
    meta: {
      title: "Spekter",
      properties: [
        {propertyName: "twitter:title", propertyType: "name", content: "Spekter"},
        {propertyName: "og:title", propertyType: "property", content: "Spekter"},
      ]
    }
  },
  {
    path: "/modulations",
    name: "Modulations",
    label: 'Modulacije',
    component: () => import("@views/ModulationsView.vue"),
    icon: ['fas', 'signal'],
    meta: {
      title: "Modulacije",
      properties: [
        {propertyName: "twitter:title", propertyType: "name", content: "Modulacije"},
        {propertyName: "og:title", propertyType: "property", content: "Modulacije"},
      ]
    }
  },
  {
    path: "/harmonics",
    name: "Harmonics",
    label: 'Harmoniki',
    component: () => import("@views/HarmonicsView.vue"),
    icon: ['fas', 'water'],
    meta: {
      title: "Harmoniki",
      properties: [
        {propertyName: "twitter:title", propertyType: "name", content: "Harmoniki"},
        {propertyName: "og:title", propertyType: "property", content: "Harmoniki"},
      ]
    }
  },
  {
    path: "/pointers",
    name: "Pointers",
    label: 'Kazalci',
    component: () => import("@views/PointersView.vue"),
    icon: ['fas', 'long-arrow-alt-up'],
    meta: {
      title: "Kazalci",
      properties: [
        {propertyName: "twitter:title", propertyType: "name", content: "Kazalci"},
        {propertyName: "og:title", propertyType: "property", content: "Kazalci"},
      ]
    }
  },
  {
    path: "/correlation",
    name: "Correlation",
    label: 'Korelacija',
    component: () => import("@views/CorrelationView.vue"),
    icon: ['fas', 'equals'],
    meta: {
      title: "Korelacija",
      properties: [
        {propertyName: "twitter:title", propertyType: "name", content: "Korelacija"},
        {propertyName: "og:title", propertyType: "property", content: "Korelacija"},
      ]
    }
  },
  {
    path: "/intersymbol-interference",
    name: "Intersymbol interference",
    label: 'Intersimbolna interferenca',
    component: () => import("@views/IntersymbolInterferenceView.vue"),
    icon: ['fas', 'eye'],
    meta: {
      title: "Intersimbolna interferenca",
      properties: [
        {propertyName: "twitter:title", propertyType: "name", content: "Intersimbolna interferenca"},
        {propertyName: "og:title", propertyType: "property", content: "Intersimbolna interferenca"},
      ]
    }
  },
  {
    path: "/digital-filters",
    name: "Digitalni filtri",
    label: 'Digitalni filtri',
    component: () => import("@views/DigitalFiltersView.vue"),
    icon: ['fas', 'filter'],
    meta: {
      title: "Digitalni filtri",
      properties: [
        {propertyName: "twitter:title", propertyType: "name", content: "Digitalni filtri"},
        {propertyName: "og:title", propertyType: "property", content: "Digitalni filtri"},
      ]
    }
  },
];

const router: Router = createRouter({
  history: createWebHistory(),
  routes,
});

// Argument is not actually typeof Route, but it's a pain in the ass to join our routes and router routes
router.beforeEach((to: Route | any) => {
  const {title, properties} = to.meta;
  document.title = appFullTitle(title);
  properties.forEach((property: MetaObject) => {
    const {propertyName, propertyType, content} = property;
    const element: HTMLMetaElement = document.querySelector(`meta[${propertyType}='${propertyName}']`)!;
    element.setAttribute('content', propertyName.includes('title') ? appFullTitle(content) : content);
  });
});

export {
  routes,
  router
};

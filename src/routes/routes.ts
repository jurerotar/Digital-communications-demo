import {createWebHistory, createRouter, Router} from "vue-router";
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
      title: appFullTitle("Domov"),
      properties: [
        {propertyName: "twitter:title", propertyType: "name", content: appFullTitle("Domov")},
        {propertyName: "og:title", propertyType: "property", content: appFullTitle("Domov")},
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
      title: appFullTitle("Spekter"),
      properties: [
        {propertyName: "twitter:title", propertyType: "name", content: appFullTitle("Spekter")},
        {propertyName: "og:title", propertyType: "property", content: appFullTitle("Spekter")},
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
      title: appFullTitle("Modulacije"),
      properties: [
        {propertyName: "twitter:title", propertyType: "name", content: appFullTitle("Modulacije")},
        {propertyName: "og:title", propertyType: "property", content: appFullTitle("Modulacije")},
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
      title: appFullTitle("Harmoniki"),
      properties: [
        {propertyName: "twitter:title", propertyType: "name", content: appFullTitle("Harmoniki")},
        {propertyName: "og:title", propertyType: "property", content: appFullTitle("Harmoniki")},
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
      title: appFullTitle("Kazalci"),
      properties: [
        {propertyName: "twitter:title", propertyType: "name", content: appFullTitle("Kazalci")},
        {propertyName: "og:title", propertyType: "property", content: appFullTitle("Kazalci")},
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
      title: appFullTitle("Korelacija"),
      properties: [
        {propertyName: "twitter:title", propertyType: "name", content: appFullTitle("Korelacija")},
        {propertyName: "og:title", propertyType: "property", content: appFullTitle("Korelacija")},
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
      title: appFullTitle("Intersimbolna interferenca"),
      properties: [
        {propertyName: "twitter:title", propertyType: "name", content: appFullTitle("Intersimbolna interferenca")},
        {propertyName: "og:title", propertyType: "property", content: appFullTitle("Intersimbolna interferenca")},
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
      title: appFullTitle("Digitalni filtri"),
      properties: [
        {propertyName: "twitter:title", propertyType: "name", content: appFullTitle("Digitalni filtri")},
        {propertyName: "og:title", propertyType: "property", content: appFullTitle("Digitalni filtri")},
      ]
    }
  },
];

const router: Router = createRouter({
  history: createWebHistory(),
  routes,
});

// Argument is not actually typeof Route, but it's a pain in the ass to join our routes and router routes
router.beforeEach((to: Route | any): void => {
  const {title, properties} = to.meta;
  document.title = title;
  properties.forEach((property: MetaObject): void => {
    const element: HTMLMetaElement = document.querySelector(`meta[${property.propertyType}='${property.propertyName}']`)!;
    element.setAttribute('content', property.content);
  });
});

export {
  routes,
  router
};

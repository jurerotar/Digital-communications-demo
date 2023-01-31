import {createWebHistory, createRouter, Router} from "vue-router";
import {MetaObject, Route} from "@/js/routes/routes.types";
import {appFullTitle} from "@/js/helpers/functions";

const routes: Route[] = [
  {
    path: "/",
    name: "Home",
    label: 'Domov',
    component: () => import("@/js/views/HomeView.vue"),
    icon: ['fas', 'home'],
    meta: {
      title: appFullTitle("Domov"),
      properties: [
        {propertyName: "description", propertyType: "name", content: ""},
        {propertyName: "twitter:title", propertyType: "name", content: appFullTitle("Domov")},
        {propertyName: "twitter:description", propertyType: "name", content: ""},
        {propertyName: "og:title", propertyType: "property", content: appFullTitle("Domov")},
        {propertyName: "og:description", propertyType: "property", content: ""},
        {propertyName: "og:url", propertyType: "property", content: ""},
      ]
    }
  },
  {
    path: "/spectrum",
    name: "Spectrum",
    label: 'Spekter',
    component: () => import("@/js/views/SpectrumView.vue"),
    icon: ['fas', 'wave-square'],
    meta: {
      title: appFullTitle("Spekter"),
      properties: [
        {propertyName: "description", propertyType: "name", content: ""},
        {propertyName: "twitter:title", propertyType: "name", content: appFullTitle("Spekter")},
        {propertyName: "twitter:description", propertyType: "name", content: ""},
        {propertyName: "og:title", propertyType: "property", content: appFullTitle("Spekter")},
        {propertyName: "og:description", propertyType: "property", content: ""},
        {propertyName: "og:url", propertyType: "property", content: ""},
      ]
    }
  },
  {
    path: "/modulations",
    name: "Modulations",
    label: 'Modulacije',
    component: () => import("@/js/views/ModulationsView.vue"),
    icon: ['fas', 'signal'],
    meta: {
      title: appFullTitle("Modulacije"),
      properties: [
        {propertyName: "description", propertyType: "name", content: ""},
        {propertyName: "twitter:title", propertyType: "name", content: appFullTitle("Modulacije")},
        {propertyName: "twitter:description", propertyType: "name", content: ""},
        {propertyName: "og:title", propertyType: "property", content: appFullTitle("Modulacije")},
        {propertyName: "og:description", propertyType: "property", content: ""},
        {propertyName: "og:url", propertyType: "property", content: ""},
      ]
    }
  },
  {
    path: "/harmonics",
    name: "Harmonics",
    label: 'Harmoniki',
    component: () => import("@/js/views/HarmonicsView.vue"),
    icon: ['fas', 'water'],
    meta: {
      title: appFullTitle("Harmoniki"),
      properties: [
        {propertyName: "description", propertyType: "name", content: ""},
        {propertyName: "twitter:title", propertyType: "name", content: appFullTitle("Harmoniki")},
        {propertyName: "twitter:description", propertyType: "name", content: ""},
        {propertyName: "og:title", propertyType: "property", content: appFullTitle("Harmoniki")},
        {propertyName: "og:description", propertyType: "property", content: ""},
        {propertyName: "og:url", propertyType: "property", content: ""},
      ]
    }
  },
  {
    path: "/pointers",
    name: "Pointers",
    label: 'Kazalci',
    component: () => import("@/js/views/PointersView.vue"),
    icon: ['fas', 'long-arrow-alt-up'],
    meta: {
      title: appFullTitle("Kazalci"),
      properties: [
        {propertyName: "description", propertyType: "name", content: ""},
        {propertyName: "twitter:title", propertyType: "name", content: appFullTitle("Kazalci")},
        {propertyName: "twitter:description", propertyType: "name", content: ""},
        {propertyName: "og:title", propertyType: "property", content: appFullTitle("Kazalci")},
        {propertyName: "og:description", propertyType: "property", content: ""},
        {propertyName: "og:url", propertyType: "property", content: ""},
      ]
    }
  },
  {
    path: "/correlation",
    name: "Correlation",
    label: 'Korelacija',
    component: () => import("@/js/views/CorrelationView.vue"),
    icon: ['fas', 'equals'],
    meta: {
      title: appFullTitle("Korelacija"),
      properties: [
        {propertyName: "description", propertyType: "name", content: ""},
        {propertyName: "twitter:title", propertyType: "name", content: appFullTitle("Korelacija")},
        {propertyName: "twitter:description", propertyType: "name", content: ""},
        {propertyName: "og:title", propertyType: "property", content: appFullTitle("Korelacija")},
        {propertyName: "og:description", propertyType: "property", content: ""},
        {propertyName: "og:url", propertyType: "property", content: ""},
      ]
    }
  },
  {
    path: "/intersymbol-interference",
    name: "Intersymbol interference",
    label: 'Intersimbolna interferenca',
    component: () => import("@/js/views/IntersymbolInterferenceView.vue"),
    icon: ['fas', 'eye'],
    meta: {
      title: appFullTitle("Intersimbolna interferenca"),
      properties: [
        {propertyName: "description", propertyType: "name", content: ""},
        {propertyName: "twitter:title", propertyType: "name", content: appFullTitle("Intersimbolna interferenca")},
        {propertyName: "twitter:description", propertyType: "name", content: ""},
        {propertyName: "og:title", propertyType: "property", content: appFullTitle("Intersimbolna interferenca")},
        {propertyName: "og:description", propertyType: "property", content: ""},
        {propertyName: "og:url", propertyType: "property", content: ""},
      ]
    }
  },
  {
    path: "/digital-filters",
    name: "Digitalni filtri",
    label: 'Digitalni filtri',
    component: () => import("@/js/views/DigitalFiltersView.vue"),
    icon: ['fas', 'filter'],
    meta: {
      title: appFullTitle("Digitalni filtri"),
      properties: [
        {propertyName: "description", propertyType: "name", content: ""},
        {propertyName: "twitter:title", propertyType: "name", content: appFullTitle("Digitalni filtri")},
        {propertyName: "twitter:description", propertyType: "name", content: ""},
        {propertyName: "og:title", propertyType: "property", content: appFullTitle("Digitalni filtri")},
        {propertyName: "og:description", propertyType: "property", content: ""},
        {propertyName: "og:url", propertyType: "property", content: ""},
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

<template>
  <div>
    <main class="p-4 container lg:mx-auto flex flex-col gap-4">
      <app-main-heading>
        Digitalne komunikacije - demo
      </app-main-heading>
      <div class="flex flex-col gap-2">
        <app-paragraph>
          Spletna stran je nastala kot projektna naloga pri predmetu Digitalne komunikacije. Nazorno prikazuje vizualne primere iz snovi,
          s katerimi se lahko poigrate in se na tak način dodatno seznanite s snovjo.
        </app-paragraph>
        <app-paragraph class="font-semibold">
          Aplikacija trenutno prikazuje naslednje podstrani:
        </app-paragraph>
        <div class="my-1 mb-4 flex flex-col md:flex-row gap-2">
          <div
            v-for="link in links"
            :key="link.path"
          >
            <router-link :to="link.path">
              <app-button>
                {{ link.label }}
              </app-button>
            </router-link>
          </div>
        </div>
        <app-section-heading>
          Dodatne povezave
        </app-section-heading>
        <app-paragraph>
          Na povezavi najdete učbenik prof. dr. Saše Tomažiča, ki ga lahko uporabite za boljše razumevanje
          prikazanih primerov.
        </app-paragraph>
      </div>
      <a
        href="http://www.fe.uni-lj.si/mma/Tomazic-DigitalneKomunikacije/2017112514040761/"
        rel="noopener"
        target="_blank"
        class="w-fit-content"
      >
        <app-button>
          Učbenik
        </app-button>
      </a>
    </main>
    <open-source />
  </div>
</template>

<script
  setup
  lang="ts"
>
import OpenSource from "@/js/components/common/sections/OpenSource.vue";
import AppMainHeading from "@/js/components/common/AppMainHeading.vue";
import AppSectionHeading from "@/js/components/common/AppSectionHeading.vue";
import {Route, routes} from "@/js/routes/routes";
import AppButton from "@/js/components/common/buttons/AppButton.vue";
import AppParagraph from "@/js/components/common/AppParagraph.vue";

// Display links to all pages except 'home'
const links: Route[] = routes.filter((route: Route) => route.name !== 'Home');
</script>
<template>
  <div class="lg:ml-72">
    <main class="p-4 container lg:mx-auto flex flex-col gap-4">
      <AppMainHeading>Digitalne komunikacije - demo</AppMainHeading>
      <div class="flex flex-col gap-2">
        <AppParagraph>
          Spletna stran je nastala kot projektna naloga pri predmetu Digitalne komunikacije. Nazorno prikazuje vizualne primere iz snovi, s
          katerimi se lahko poigrate in se na tak način dodatno seznanite s snovjo.
        </AppParagraph>
        <AppParagraph class="font-semibold">Aplikacija trenutno prikazuje naslednja poglavja:</AppParagraph>
        <div class="my-1 mb-4 flex flex-col md:flex-row gap-2">
          <div
            v-for="link in links"
            :key="link.path"
          >
            <RouterLink :to="link.path">
              <AppButton>
                {{ link.label }}
              </AppButton>
            </RouterLink>
          </div>
        </div>
        <AppSectionHeading>Dodatne povezave</AppSectionHeading>
        <AppParagraph>
          Na povezavi najdete učbenik prof. dr. Saše Tomažiča, ki ga lahko uporabite za boljše razumevanje prikazanih primerov.
        </AppParagraph>
      </div>
      <a
        href="http://www.fe.uni-lj.si/mma/Tomazic-DigitalneKomunikacije/2017112514040761/"
        rel="noopener"
        target="_blank"
        class="w-fit"
      >
        <AppButton>Učbenik</AppButton>
      </a>
    </main>
    <OpenSource />
  </div>
</template>

<script setup lang="ts">
import AppMainHeading from '@components/common/AppMainHeading.vue';
import AppSectionHeading from '@components/common/AppSectionHeading.vue';
import { routes } from '@routes/routes';
import { Route } from '@routes/routes.types';
import AppButton from '@components/common/buttons/AppButton.vue';
import AppParagraph from '@components/common/AppParagraph.vue';
import OpenSource from './components/OpenSource.vue';

// Display links to all pages except 'home'
const links: Route[] = routes.filter((route: Route) => route.name !== 'Home');
</script>

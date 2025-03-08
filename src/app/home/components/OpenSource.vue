<template>
  <section class="bg-gray-100 dark:bg-gray-700 transition-colors duration-300 overflow-hidden pt-4 lg:pt-0">
    <div class="container p-4 mx-auto grid grid-cols-1 md:grid-cols-2">
      <div class="flex flex-col w-full lg:my-20 gap-4">
        <CircleIcon>
          <FontAwesomeIcon
            :icon="faCodeBranch"
            class="text-3xl"
          />
        </CircleIcon>
        <AppSectionHeading>Sodeluj pri projektu</AppSectionHeading>
        <AppParagraph class="text-lg">
          Celotna izvorna kode aplikacije je objavljena na GitHubu, do repozitorija pa pridete z klikom na spodnjo povezavo. Koda je
          licencirana z MIT odprto-kodno licenco, torej jo lahko poljubno spreminjate, dodajate ali dopolnjujete. K sodelovanju pri
          dopolnjevanju in izpopolnjevanju te spletne aplikacije ste vabljeni vsi.
        </AppParagraph>
        <AppParagraph class="text-lg font-medium">Poglej projekt na GitHubu</AppParagraph>
        <a
          rel="noopener"
          href="https://github.com/jurerotar/digital-communications-demo"
          target="_blank"
          tabindex="0"
          class="inline-flex text-white w-fit font-semibold px-6 py-4 rounded outline-none focus:outline-none bg-gray-800 active:bg-gray-700 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150"
        >
          GITHUB
        </a>
      </div>

      <div class="w-full mt-32 relative">
        <FontAwesomeIcon
          :icon="faGithub"
          class="opn-src-icon dark:text-gray-800 text-gray-300 absolute left-auto opacity-40 lg:opacity-80 transition-colors duration-300"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faCodeBranch } from '@fortawesome/free-solid-svg-icons';
import AppSectionHeading from '@components/common/AppSectionHeading.vue';
import AppParagraph from '@components/common/AppParagraph.vue';
import CircleIcon from './CircleIcon.vue';
</script>

<style scoped>
.opn-src-icon {
  --size: 33rem;
  width: var(--size) !important;
  height: var(--size) !important;
  top: 0;
  transform: translate(350px, -70%);
  right: 0;
}

@media (min-width: 768px) {
  .opn-src-icon {
    transform: translate(200px, -15%);
  }
}

@media (min-width: 1024px) {
  .opn-src-icon {
    --size: 50rem;
    top: 50%;
    transform: translate(400px, -50%);
  }
}
</style>

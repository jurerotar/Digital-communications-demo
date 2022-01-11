<template>
  <section class="bg-gray-100 dark:bg-gray-700 transition-colors duration-300 overflow-hidden pt-4 lg:pt-0">
    <div class="container p-4 mx-auto grid grid-cols-1 md:grid-cols-2">
      <div class="flex flex-col w-full lg:my-20 gap-4">
        <app-circle-icon>
          <font-awesome-icon
            :icon="['fas', 'code-branch']"
            class="text-3xl text-blue-500"
          />
        </app-circle-icon>
        <app-section-heading>
          Sodeluj pri projektu
        </app-section-heading>
        <app-paragraph class="text-lg">
          Celotna izvorna kode aplikacije je objavljena na GitHubu, do repozitorija pa pridete z klikom na spodnjo povezavo. Koda je
          licencirana z MIT odprto-kodno licenco, torej jo lahko poljubno spreminjate, dodajate ali dopolnjujete. K sodelovanju pri
          dopolnjevanju in izpopolnjevanju te spletne aplikacije ste vabljeni vsi.
        </app-paragraph>
        <app-paragraph class="text-lg font-medium">
          Poglej projekt na GitHubu
        </app-paragraph>
        <a
          rel="noopener"
          href="https://github.com/jurerotar/digital-communications-demo"
          target="_blank"
          tabindex="0"
          class="inline-flex text-white w-fit-content font-semibold px-6 py-4 rounded outline-none focus:outline-none bg-gray-800
          active:bg-gray-700 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150"
        >
          GITHUB
        </a>
      </div>

      <div class="w-full mt-32 relative">
        <font-awesome-icon
          :icon="['fab', 'github']"
          class="opn-src-icon dark:text-gray-800 text-gray-300 absolute left-auto opacity-40 lg:opacity-80  transition-colors duration-300"
        />
      </div>
    </div>
  </section>
</template>

<script
  setup
  lang="ts"
>
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faGithub} from "@fortawesome/free-brands-svg-icons";
import {faCodeBranch} from "@fortawesome/free-solid-svg-icons";
import AppSectionHeading from "@/js/components/common/AppSectionHeading.vue";
import AppParagraph from "@/js/components/common/AppParagraph.vue";
import AppCircleIcon from "@/js/components/common/icons/AppCircleIcon.vue";

library.add(faGithub, faCodeBranch);
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

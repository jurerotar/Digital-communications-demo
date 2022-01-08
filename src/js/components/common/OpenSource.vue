<template>
  <section class="bg-gray-700 overflow-hidden pt-4 lg:pt-0">
    <div class="container p-4 mx-auto grid grid-cols-1 md:grid-cols-2">
      <div class="w-full lg:my-20">
        <div
          class="text-gray-600 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-white"
        >
          <font-awesome-icon
            :icon="['fas', 'code-branch']"
            class="text-3xl"
          />
        </div>
        <h3 class="text-3xl mb-2 font-semibold leading-normal text-white">
          Sodeluj pri projektu
        </h3>
        <p class="text-lg font-light leading-relaxed mt-4 mb-4 text-white">
          Celotna izvorna kode aplikacije je objavljena na GitHubu, do repozitorija pa pridete z klikom na spodnjo povezavo. Koda je licencirana z MIT odprto-kodno licenco, torej jo lahko poljubno spreminjate, dodajate ali dopolnjujete. K sodelovanju pri dopolnjevanju in izpopolnjevanju te spletne aplikacije, ste vabljeni vsi.
        </p>
        <p class="text-lg font-medium leading-relaxed mt-0 mb-4 text-white">
          Poglej projekt na GitHubu
        </p>
        <a
          rel="noopener"
          href="https://github.com/jurerotar/digital-communications-demo"
          target="_blank"
          class="github-star mt-4 inline-block text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-1 bg-gray-800 active:bg-gray-700 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150"
        >
          GITHUB
        </a>
      </div>

      <div class="w-full mt-32 relative">
        <font-awesome-icon
          :icon="['fab', 'github']"
          class="opn-src-icon text-gray-800 absolute left-auto opacity-40 lg:opacity-80"
        />
      </div>
    </div>
  </section>
</template>

<script>
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

export default {
    name: "OpenSource",
    components: {
        FontAwesomeIcon
    }
}
</script>

<style scoped>
.opn-src-icon {
    --size: 33rem;
    top: 0;
    transform: translate(350px, -70%);
    right: 0;
    width: var(--size) !important;
    height: var(--size) !important;
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

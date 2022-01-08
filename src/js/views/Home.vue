<template>
  <div class="lg:ml-72">
    <main class="p-4 container lg:mx-auto transition-colors duration-300 dark:bg-gray-800">
      <h1 class="text-3xl font-medium mb-4 transition-colors duration-300 dark:text-white">
        Digitalne komunikacije - demo
      </h1>
      <div class="flex flex-col">
        <p class="transition-colors duration-300 dark:text-white mb-2">
          Spletna stran je nastala kot projektna naloga pri predmetu Digitalne komunikacije.
          <br>
          Nazorno prikazuje vizualne primere iz snovi, s katerimi se lahko poigrate in se na tak način dodatno seznanite s snovjo.
        </p>
        <p class="transition-colors duration-300 dark:text-white font-semibold">
          Aplikacija trenutno prikazuje naslednje podstrani:
        </p>
        <div class="my-1 mb-4 flex flex-col md:flex-row">
          <div
            v-for="link in links"
            :key="link.href"
            class="my-1 mr-2"
          >
            <router-link
              :to="link.href"
              class="inline-flex px-4 py-2 bg-blue-500 rounded-xl font-semibold text-white"
            >
              {{ link.text }}
            </router-link>
          </div>
        </div>
        <h2 class="text-xl font-medium mb-2 transition-colors duration-300 dark:text-white">
          Dodatne povezave
        </h2>
        <p class="transition-colors duration-300 dark:text-white">
          Na povezavi najdete učbenik prof. dr. Saše Tomažiča, ki ga lahko uporabite za boljše razumevanje
          prikazanih primerov.
        </p>
      </div>
      <a
        class="inline-flex mt-2 px-4 py-2 bg-blue-500 rounded-xl font-semibold text-white"
        href="http://www.fe.uni-lj.si/mma/Tomazic-DigitalneKomunikacije/2017112514040761/"
      >Učbenik</a>
    </main>
    <open-source />
  </div>
</template>

<script>

import OpenSource from "@/js/components/common/OpenSource.vue";
export default {
    name: "Home",
    components: {OpenSource},
    data() {
        return {
            links: [
                {
                    href: '/spectrum',
                    text: 'Spekter'
                },
                {
                    href: '/modulations',
                    text: 'Modulacije'
                },
                {
                    href: '/harmonics',
                    text: 'Harmoniki'
                },
                {
                    href: '/pointers',
                    text: 'Kazalci'
                },
            ]
        }
    },
}
</script>
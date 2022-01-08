<template>
  <div class="flex h-full lg:h-auto lg:w-full justify-start lg:justify-center py-2 lg:px-12">
    <svg
      class="h-full lg:w-full"
      xmlns="http://www.w3.org/2000/svg"
      x="0"
      y="0"
      viewBox="0 0 388.4 108.5"
      xml:space="preserve"
    >
      <path
        class="logo-path"
        :fill="color"
        d="M0 108.4V93.7h13.9V14.6H0V0h45.7v14.6H31.8v93.8z"
      />
      <path
        fill="#088c45"
        d="M41.6 108.4V93.7h27.2V76.6h15.6v31.8zM113.2 88.4c0-2.7.5-5.5 1.5-8s2.6-4.6 4.7-6.4a25 25 0 018.1-4.6c3.7-1.3
        7.6-2.3 11.6-2.9l15.2-2.4v11.1L142.8 77c-1.9.2-3.9.7-5.7 1.3a15 15 0 00-3.9 2.2 9 9 0 00-2.2 2.9 8.4 8.4 0 00-.7 3.5 8 8 0
         00.8 3.7 8.1 8.1 0 002.4 2.8c1.2.8 2.5 1.4 3.9 1.7 1.7.4 3.4.6 5.1.6l3.5-.1 3-.2 2.7-.3 2.5-.4v12.5l-3.3.5-3.6.4-3.9.3-4.1.1c-3.7
         0-7.5-.4-11.1-1.4-3-.8-5.8-2.1-8.2-4a17.7 17.7 0 01-6.8-14.7z"
      />
      <path
        class="logo-path"
        :fill="color"
        d="M118.4 58.8V37.3a55.4 55.4 0 0114.3-4.4c2.6-.5 5.2-.9 7.9-1.2 2.7-.2 5.3-.4 8-.4 4.3-.1 8.6.4 12.8 1.4 3.7.9 7.2 2.5 10.3 4.8 3
        2.3 5.5 5.3 7 8.8 1.8 4.2 2.6 8.8 2.5 13.4v35h10.9v13.7H164V59.6c.1-2.5-.4-5-1.3-7.3a12 12 0
        00-3.4-4.7c-1.5-1.2-3.2-2-5.1-2.5-2.1-.5-4.3-.8-6.6-.8-1.2 0-2.4 0-3.6.2l-3.6.4c-1.2.1-2.3.4-3.5.6l-3.5.8v12.3h-15z"
      />
      <path
        fill="#088c45"
        d="M217.7 0h45.7v14.6h-45.7z"
      />
      <path
        class="logo-path"
        :fill="color"
        d="M217.7 108.4V93.7h13.9V23.8h17.9v69.9h13.9v14.7zM330.2 84.6v-70h-24.4v17.2H290V0h58v84.6zM312.3 93.7h53.8v14.6h-53.8z"
      />
      <path
        fill="#088c45"
        d="M372.5 31.8V14.6H358V0h30.4v31.8z"
      />
    </svg>
  </div>
</template>

<script
  setup
  lang="ts"
>
import {computed} from 'vue';
import {State} from "@/js/store/store";
import {useStore} from "vuex";

const store = useStore<State>();

const scheme = computed<string>(() => store.state.appState.scheme);
const color = computed<string>(() => (scheme.value === 'dark') ? '#ffffff' : '#010101');
</script>
<style>
.logo-path {
  transition: fill 0.3s;
}
</style>
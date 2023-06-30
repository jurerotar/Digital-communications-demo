<template>
  <div class="flex flex-row items-center justify-end gap-4">
    <!-- Scheme switcher -->
    <SchemeSwitcher v-if="isLgUp" />
    <!-- GitHub link -->
    <GithubIcon v-if="isLgUp" />
  </div>
</template>

<script
  setup
  lang="ts"
>
import SchemeSwitcher from "./SchemeSwitcher.vue";
import GithubIcon from "./GithubIcon.vue";
import {useWindowSize} from "@composables/use-window-size";

const {isLgUp} = useWindowSize();
</script>
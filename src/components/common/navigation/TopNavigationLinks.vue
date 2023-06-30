<template>
  <div class="flex flex-row items-center justify-end gap-4">
    <!-- Scheme switcher -->
    <SchemeSwitcher v-if="isLgUp" />
    <!-- GitHub link -->
    <AppGithubIcon v-if="isLgUp" />
  </div>
</template>

<script
  setup
  lang="ts"
>
import SchemeSwitcher from "@components/common/navigation/SchemeSwitcher.vue";
import AppGithubIcon from "@components/common/icons/AppGithubIcon.vue";
import {useWindowSize} from "@composables/use-window-size";

const {isLgUp} = useWindowSize();
</script>
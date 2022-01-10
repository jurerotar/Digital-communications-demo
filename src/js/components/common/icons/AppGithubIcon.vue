<template>
  <a
    href="https://github.com/jurerotar/digital-communications-demo"
    rel="noopener"
    tabindex="0"
  >
    <font-awesome-icon
      :icon="['fab', 'github']"
      class="text-3xl dark:text-white transition-colors duration-300"
    />
  </a>
</template>

<script setup lang="ts">
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {library} from "@fortawesome/fontawesome-svg-core";
import {faGithub} from "@fortawesome/free-brands-svg-icons";
library.add(faGithub);
</script>
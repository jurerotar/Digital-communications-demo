<template>
  <a
    href="https://github.com/jurerotar/digital-communications-demo"
    rel="noopener"
    tabindex="0"
  >
    <FontAwesomeIcon
      :icon="faGithub"
      class="text-3xl dark:text-white transition-colors duration-300"
    />
  </a>
</template>

<script setup lang="ts">
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {faGithub} from "@fortawesome/free-brands-svg-icons";
</script>
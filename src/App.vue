<template>
  <KeepAlive>
    <SidebarLayout />
  </KeepAlive>
</template>

<script
  setup
  lang="ts"
>
import SidebarLayout from "@layouts/SidebarLayout.vue";
import {scheme} from "@helpers/functions";

scheme();
</script>


<template>
  <KeepAlive>
    <SidebarLayout />
  </KeepAlive>
</template>

<script
  setup
  lang="ts"
>
import SidebarLayout from "@layouts/sidebar-layout/SidebarLayout.vue";
import {scheme} from "@helpers/functions";

scheme();
</script>


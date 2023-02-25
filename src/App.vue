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
import {attachResizeHandlers, scheme} from "@helpers/functions";

scheme();
attachResizeHandlers();
</script>


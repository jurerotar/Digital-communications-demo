<template>
  <KeepAlive>
    <SidebarLayout/>
  </KeepAlive>
</template>

<script
  setup
  lang="ts"
>
import SidebarLayout from "@/js/layouts/SidebarLayout.vue";
import {attachResizeHandlers, scheme} from "@/js/helpers/functions";

scheme();
attachResizeHandlers();
</script>


<template>
  <KeepAlive>
    <SidebarLayout />
  </KeepAlive>
</template>

<script setup lang="ts">
import { scheme } from '@helpers/functions';
import SidebarLayout from '@layouts/sidebar-layout/SidebarLayout.vue';

scheme();
</script>

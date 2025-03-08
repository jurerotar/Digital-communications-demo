<template>
  <AppMainContainer>
    <AppMainHeading>Harmoniki</AppMainHeading>
    <AppCollapsible>
      <HarmonicsTheory />
    </AppCollapsible>
    <AppSlider
      id="harmonic-components"
      v-model.number="components"
      :label="`Število komponent: ${components}`"
      :min="1"
      :max="10"
      :step="1"
    />
    <IndividualHarmonicsGraph :components="components" />
    <SummedHarmonicsGraph :components="components" />
  </AppMainContainer>
</template>

<script setup lang="ts">
import AppCollapsible from '@components/common/AppCollapsible.vue';
import AppMainHeading from '@components/common/AppMainHeading.vue';
import { ref } from 'vue';
import AppMainContainer from '@components/common/AppMainContainer.vue';
import AppSlider from '@components/common/AppSlider.vue';
import HarmonicsTheory from './components/HarmonicsTheory.vue';
import IndividualHarmonicsGraph from './components/IndividualHarmonicsGraph.vue';
import SummedHarmonicsGraph from './components/SummedHarmonicsGraph.vue';

const components = ref<number>(1);
</script>

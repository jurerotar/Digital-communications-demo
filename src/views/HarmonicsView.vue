<template>
  <AppMainContainer>
    <AppMainHeading>
      Harmoniki
    </AppMainHeading>
    <AppCollapsible>
      <theory-harmonics />
    </AppCollapsible>
    <AppSlider
      id="harmonic-components"
      v-model="components"
      :label="`Število komponent: ${components}`"
      :min="1"
      :max="10"
      :step="1"
    />
    <IndividualHarmonicsGraph :components="components" />
    <SummedHarmonicsGraph :components="components" />
  </AppMainContainer>
</template>

<script
  setup
  lang="ts"
>
import IndividualHarmonicsGraph from "@components/canvas/IndividualHarmonicsGraph.vue";
import SummedHarmonicsGraph from "@components/canvas/SummedHarmonicsGraph.vue";
import TheoryHarmonics from "@components/theory/TheoryHarmonics.vue";
import AppCollapsible from "@components/common/AppCollapsible.vue";
import AppMainHeading from "@components/common/AppMainHeading.vue";
import {ref} from "vue";
import AppMainContainer from "@components/common/AppMainContainer.vue";
import AppSlider from "@components/common/AppSlider.vue";

const components = ref<number>(1);
</script>
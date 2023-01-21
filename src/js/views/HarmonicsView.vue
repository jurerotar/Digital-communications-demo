<template>
  <AppMainContainer>
    <AppMainHeading>
      Harmoniki
    </AppMainHeading>
    <AppCollapsible>
      <theory-harmonics />
    </AppCollapsible>
    <!-- Range slider -->
    <div class="inline-flex flex-col mb-2 w-fit-content gap-2">
      <label
        :for="'harmonic-components'"
        class="text-xl transition-colors duration-300 dark:text-white"
      >
        Število komponent:
        <span class="font-medium">
          {{ components }}
        </span>
      </label>
      <input
        :id="'harmonic-components'"
        v-model.number="components"
        type="range"
        min="1"
        max="10"
        step="1"
        @change="updateComponents(components)"
      >
    </div>
    <IndividualHarmonicsGraph :components="components" />
    <SummedHarmonicsGraph :components="components" />
  </AppMainContainer>
</template>

<script
  setup
  lang="ts"
>
import IndividualHarmonicsGraph from "@/js/components/canvas/IndividualHarmonicsGraph.vue";
import SummedHarmonicsGraph from "@/js/components/canvas/SummedHarmonicsGraph.vue";
import TheoryHarmonics from "@/js/components/theory/TheoryHarmonics.vue";
import AppCollapsible from "@/js/components/common/AppCollapsible.vue";
import AppMainHeading from "@/js/components/common/AppMainHeading.vue";
import {ref} from "vue";
import AppMainContainer from "@/js/components/common/AppMainContainer.vue";

const components = ref<number>(1);
const updateComponents = (value: number): void => {
  components.value = value;
}
</script>
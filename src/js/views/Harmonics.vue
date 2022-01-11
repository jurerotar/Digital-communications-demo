<template>
  <main class="p-4 container lg:mx-auto flex flex-col gap-4">
    <app-main-heading>
      Harmoniki
    </app-main-heading>
    <app-collapsible>
      <theory-harmonics />
    </app-collapsible>
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
    <individual-harmonics :components="components" />
    <summed-harmonics :components="components" />
  </main>
</template>

<script
  setup
  lang="ts"
>
import IndividualHarmonics from "@/js/components/canvas/IndividualHarmonics.vue";
import SummedHarmonics from "@/js/components/canvas/SummedHarmonics.vue";
import TheoryHarmonics from "@/js/components/theory/TheoryHarmonics.vue";
import AppCollapsible from "@/js/components/common/AppCollapsible.vue";
import AppMainHeading from "@/js/components/common/AppMainHeading.vue";
import {ref} from "vue";

const components = ref<number>(1);
const updateComponents = (value: number): void => {
  components.value = value;
}
</script>
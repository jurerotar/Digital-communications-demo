<template>
  <div class="lg:ml-72">
    <main class="p-4 container lg:mx-auto transition-colors duration-300 dark:bg-gray-800">
      <h1 class="text-3xl font-medium mb-4 transition-colors duration-300 dark:text-white">
        Harmoniki
      </h1>
      <collapsible>
        <theory-harmonics />
      </collapsible>
      <!-- Range slider -->
      <div class="inline-flex flex-col mb-2">
        <label
          :for="`harmonic-components`"
          class="text-xl transition-colors duration-300 dark:text-white"
        >Število komponent: <span
          class="font-medium"
        >{{ components }}</span></label>
        <input
          :id="`harmonic-components`"
          v-model.number="components"
          type="range"
          min="1"
          max="10"
          step="1"
          @change="updateAmountOfComponents(components)"
        >
      </div>
      <individual-harmonics :components="components" />
      <summed-harmonics :components="components" />
    </main>
  </div>
</template>

<script>
import IndividualHarmonics from "@/js/components/canvas/IndividualHarmonics.vue";
import SummedHarmonics from "@/js/components/canvas/SummedHarmonics.vue";
import TheoryHarmonics from "@/js/components/theory/TheoryHarmonics.vue";
import Collapsible from "@/js/components/common/Collapsible.vue";

export default {
    name: "Harmonics",
    components: {Collapsible, TheoryHarmonics, SummedHarmonics, IndividualHarmonics},
    data() {
        return {
            components: 1,
        }
    },
    methods: {
        updateAmountOfComponents(value) {
            this.components = value;
        },
    },
}
</script>
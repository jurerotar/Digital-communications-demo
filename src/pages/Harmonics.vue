<template>
    <h1 class="text-3xl font-medium mb-4">Harmoniki</h1>
    <collapsible>
        <theory-harmonics></theory-harmonics>
    </collapsible>
    <!-- Range slider -->
    <div class="inline-flex flex-col mb-2">
        <label :for="`harmonic-components`" class="text-xl">Število komponent: <span class = "font-medium">{{this.components}}</span></label>
        <input type="range" :id="`harmonic-components`"
               v-model.number="components"
               @change="updateAmountOfComponents(components)"
               min="1" max="10" step="1"
        >
    </div>
    <individual-harmonics :components = "components"></individual-harmonics>
    <summed-harmonics :components = "components"></summed-harmonics>
</template>

<script>
import IndividualHarmonics from "@/components/canvas/IndividualHarmonics";
import SummedHarmonics from "@/components/canvas/SummedHarmonics";
import TheoryHarmonics from "@/components/theory/TheoryHarmonics";
import Collapsible from "@/components/global/Collapsible";
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
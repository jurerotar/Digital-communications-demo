<template>
    <h1 class="text-3xl font-medium mb-4">Harmoniki</h1>
<!--    <div class="flex flex-col mb-4">-->
<!--        <p class="flex">Z drsniki lahko vplivaš število komponent signala, frekvenco in amplitudo posameznega signala.</p>-->
<!--        <p class="inline-flex text-red-500 font-bold">Opozorilo: pri visokem številu komponent ali pri visoki frekvenci lahko pride do težav pri izrisu.</p>-->
<!--    </div>-->
    <collapsible>Burek</collapsible>
    <button class = "text-white w-fit-content font-bold py-2 px-4 mb-2 sm:mr-2 rounded outline-none duration-300 transition-colors h-12"
            :class = "[selectedFunctionId === fn.id ? 'bg-blue-300' : 'bg-gray-300']"
            @click = "updateSelectedFunction(fn.id)"
            v-for = "fn in functions" :key = "fn.id">
        {{fn.label}}
    </button>
    <!-- Range slider -->
    <div class="inline-flex flex-col mb-2">
        <label :for="`harmonic-components`" class="text-xl">Število komponent</label>
        <input type="range" :id="`harmonic-components`"
               v-model.number="components"
               @change="updateAmountOfComponents(components)"
               min="1" max="5" step="1"
        >
    </div>
    <individual-harmonics></individual-harmonics>
    <summed-harmonics></summed-harmonics>
</template>

<script>
import Collapsible from "@/components/global/Collapsible";
import IndividualHarmonics from "@/components/modules/harmonics/IndividualHarmonics";
import SummedHarmonics from "@/components/modules/harmonics/SummedHarmonics";
export default {
    name: "Harmonics",
    components: {SummedHarmonics, IndividualHarmonics, Collapsible},
    data() {
        return {
            components: 1,
        }
    },
    methods: {
        /**
         * Stores current range value to store
         * @param {number} value
         */
        updateAmountOfComponents(value) {
            this.$store.commit('harmonics/updateAmountOfComponents', value);
        },

        updateSelectedFunction(id) {
            this.$store.commit('harmonics/updateSelectedFunctionId', id);
        },
    },
    computed: {
        functions() {
            return this.$store.state.harmonics.functions;
        },
        selectedFunctionId() {
            return this.$store.state.harmonics.selectedFunctionId;
        }
    },
}
</script>

<style scoped>

</style>
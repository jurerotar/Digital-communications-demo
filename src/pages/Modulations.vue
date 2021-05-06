<template>
    <h1 class="text-3xl font-medium mb-4">Modulacije</h1>
    <collapsible>
        To je burek
    </collapsible>
    <div class = "flex flex-col sm:flex-row">
        <button class = "text-white w-fit-content font-bold py-2 px-4 mb-2 sm:mr-2 rounded outline-none duration-300 transition-colors h-12"
                :class = "[selected === modulation.key ? 'bg-blue-300' : 'bg-gray-300']"
                @click = "changeSelected(modulation.key)"
                v-for = "modulation in modulations" :key = "modulation.key">
            {{modulation.label}}
        </button>
    </div>
    <sine-modulation-wave v-if = "hasSineModulationWave" :key = "1"></sine-modulation-wave>
    <square-wave v-if = "hasSquareWave" :key = "2"></square-wave>
    <carrier-wave v-if = "hasCarrier"></carrier-wave>
    <modulated-signal></modulated-signal>
</template>

<script>
import Collapsible from "@/components/global/Collapsible";
import SquareWave from "@/components/modules/modulations/SquareWave";
import SineModulationWave from "@/components/modules/modulations/SineModulationWave";
import CarrierWave from "@/components/modules/modulations/CarrierWave";
import ModulatedSignal from "@/components/modules/modulations/ModulatedSignal";
export default {
    name: "Modulations",
    components: {ModulatedSignal, CarrierWave, SineModulationWave, SquareWave, Collapsible},
    computed: {
        /**
         * Returns currently selected key
         * @returns {string}
         */
        selected() {
            return this.$store.state.modulations.selected;
        },
        /**
         * Returns modulations array from store
         * @returns {object[]}
         */
        modulations() {
            return this.$store.state.modulations.modulations;
        },
        /**
         * Finds currently selected modulation from modulations property by selected key
         * @returns {object}
         */
        selectedModulationData() {
            return this.modulations.find(el => el.key === this.selected);
        },
        /**
         * @returns {boolean}
         */
        hasSineModulationWave() {
            return this.selectedModulationData.hasSineModulationWave;
        },
        /**
         * @returns {boolean}
         */
        hasSquareWave() {
            return this.selectedModulationData.hasSquareWave;
        },
        hasCarrier() {
            return this.selectedModulationData.hasCarrier;
        }
    },
    methods: {
        /**
         * Commits a new modulation key to the store
         * @param {string} key - modulation key
         */
        changeSelected(key) {
            this.resetArrays();
            this.$store.commit('modulations/changeSelected', key);
        },
        resetArrays() {
            this.$store.commit('modulations/resetArray', 'carrierWaveValues');
            this.$store.commit('modulations/resetArray', 'squareWaveValues');
            this.$store.commit('modulations/resetArray', 'sineModulationWaveValues');
        },
    }
}
</script>
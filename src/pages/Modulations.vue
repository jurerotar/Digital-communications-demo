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
    <carrier-wave></carrier-wave>
    <sine-modulation-wave v-if = "isContinuousModulation" :key = "1"></sine-modulation-wave>
    <square-wave v-if = "isBinaryModulation" :key = "2"></square-wave>
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
    data() {
        return {
            binaryModulations: ['bask', 'bpsk'],
            continuousModulations: ['am'],
            modulations: [
                {
                    label: 'AM',
                    key: 'am'
                },
                {
                    label: 'BPSK',
                    key: 'bpsk'
                },
                {
                    label: 'BASK',
                    key: 'bask'
                },
            ]
        }
    },
    computed: {
        /**
         * Returns currently selected key
         * @returns {string}
         */
        selected() {
            return this.$store.state.modulations.selected;
        },
        /**
         * @returns {boolean}
         */
        isContinuousModulation() {
            return this.continuousModulations.includes(this.selected);
        },
        /**
         * @returns {boolean}
         */
        isBinaryModulation() {
            return this.binaryModulations.includes(this.selected);
        }
    },
    methods: {
        /**
         * Commits a new modulation key to the store
         * @param {string} key - modulation key
         */
        changeSelected(key) {
            this.$store.commit('modulations/changeSelected', key);
        }
    }
}
</script>
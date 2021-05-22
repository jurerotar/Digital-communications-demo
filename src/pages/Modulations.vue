<template>
    <h1 class="text-3xl font-medium mb-4">Modulacije</h1>
    <collapsible>
        To je burek
    </collapsible>
    <div class="flex flex-col sm:flex-row">
        <button
            class="text-white w-fit-content font-bold py-2 px-4 mb-2 sm:mr-2 rounded outline-none duration-300 transition-colors h-12"
            :class="[selected === modulation.key ? 'bg-blue-300' : 'bg-gray-300']"
            @click="changeSelected(modulation.key)"
            v-for="modulation in modulations" :key="modulation.key">
            {{ modulation.label }}
        </button>
    </div>
    <positive-only-signal v-if="hasSineModulation"
                          :data="sineModulationSignalValues"
                          :canvas_id="'sine-modulation-signal'"
                          :title="'Sinusni modulacijski signal'"
                          :vertical_pool="[' 1', -1]"
    >
    </positive-only-signal>
    <positive-only-signal v-if="hasCarrier"
                          :data="carrierSignalValues"
                          :canvas_id="'carrier-signal'"
                          :title="'Nosilec'"
                          :vertical_pool="[' 1', -1]"
    >
    </positive-only-signal>
    <positive-only-signal v-if="hasBipolar"
                          :data="bipolarSignal.values"
                          :canvas_id="'binary-signal'"
                          :is_binary="true"
                          :title="'Binarni signal'"
                          :vertical_pool="[' 1', -1]"
    >
    </positive-only-signal>
    <positive-only-signal v-if="hasUnipolar"
                          :data="unipolarSignal.values"
                          :canvas_id="'unipolar-signal'"
                          :is_binary="true"
                          :title="'Unipolarni signal'"
                          :vertical_pool="[1]"
    >
    </positive-only-signal>
    <positive-only-signal v-if="hasPam4"
                          :data="pam4Signal.values"
                          :canvas_id="'pam4-signal'"
                          :is_binary="true"
                          :title="'PAM 4 signal'"
                          :vertical_pool="[' 3', ' 1', -1, -3]"
    >
    </positive-only-signal>

    <positive-only-signal :data="modulated"
                          :canvas_id="'modulated-signal'"
                          :is_binary="false"
                          :title="'Moduliran signal'"
                          :vertical_pool="[1, -1]"
                          :is_modulated="true"
    >
    </positive-only-signal>

</template>

<script>
/**
 * @typedef {Object} BinarySignal
 * @property {number[]} values
 * @property {number[]} pool
 * @property {number} currentlyReturns
 */

/**
 * @typedef {Object} Modulation
 * @property {string} label
 * @property {string} key
 * @property {boolean} hasCarrier
 * @property {boolean} hasSineModulation
 * @property {boolean} hasBipolar
 * @property {boolean} hasUnipolar
 * @property {boolean} hasPam4
 */

import Collapsible from "@/components/global/Collapsible";
import PositiveOnlySignal from "@/components/canvas/PositiveOnlySignal";

export default {
    name: "Modulations",
    components: {PositiveOnlySignal, Collapsible},
    data() {
        return {
            intervalId: null,
            selected: 'am',
            time: 0,
            binaryCounter: 0,
            binarySymbolLength: 100,

            /** @type {number[]} */
            timeValues: [],

            /** @type {number[]} */
            carrierSignalValues: [],

            /** @type {number[]} */
            sineModulationSignalValues: [],

            /** @type {BinarySignal} */
            bipolarSignal: {
                values: [],
                pool: [-1, 1],
                currentlyReturns: 1,
            },

            /** @type {BinarySignal} */
            unipolarSignal: {
                values: [],
                pool: [-1, 0],
                currentlyReturns: 0,
            },

            /** @type {BinarySignal} */
            pam4Signal: {
                values: [],
                pool: [-3, -1, 1, 3],
                currentlyReturns: 1,
            },

            /**
             * Objects in this array determine which canvases will be drawn
             * @type {Modulation[]}
             */
            modulations: [
                {
                    label: 'AM',
                    key: 'am',
                    hasCarrier: true,
                    hasSineModulation: true,
                    hasBipolar: false,
                    hasUnipolar: false,
                    hasPam4: false,
                },
                {
                    label: 'FM',
                    key: 'fm',
                    hasCarrier: true,
                    hasSineModulation: true,
                    hasBipolar: false,
                    hasUnipolar: false,
                    hasPam4: false,
                },
                {
                    label: 'BASK',
                    key: 'bask',
                    hasCarrier: true,
                    hasSineModulation: false,
                    hasBipolar: false,
                    hasUnipolar: true,
                    hasPam4: false,
                },
                {
                    label: 'BPSK',
                    key: 'bpsk',
                    hasCarrier: true,
                    hasSineModulation: false,
                    hasBipolar: true,
                    hasUnipolar: false,
                    hasPam4: false,
                },
                {
                    label: 'PAM 4',
                    key: 'pam4',
                    hasCarrier: true,
                    hasSineModulation: false,
                    hasBipolar: false,
                    hasUnipolar: false,
                    hasPam4: true,
                },
                {
                    label: 'FSK',
                    key: 'fsk',
                    hasCarrier: true,
                    hasSineModulation: false,
                    hasBipolar: true,
                    hasUnipolar: false,
                    hasPam4: false,
                },
            ]
        }
    },
    computed: {
        /**
         * Finds currently selected modulation from modulations property by selected key
         * @returns {object}
         */
        selectedModulationData() {
            return this.modulations.find(el => el.key === this.selected);
        },
        /** @returns {boolean} */
        hasCarrier() {
            return this.selectedModulationData.hasCarrier;
        },
        /** @returns {boolean} */
        hasSineModulation() {
            return this.selectedModulationData.hasSineModulation;
        },
        /** @returns {boolean} */
        hasBipolar() {
            return this.selectedModulationData.hasBipolar;
        },
        /** @returns {boolean} */
        hasUnipolar() {
            return this.selectedModulationData.hasUnipolar;
        },
        /** @returns {boolean} */
        hasPam4() {
            return this.selectedModulationData.hasPam4;
        },
        /**
         * Returns an array of numbers computed by selected modulation key
         * @returns {number[]}
         */
        modulated() {
            const [
                carrier,
                sine,
                bipolar,
                unipolar,
                pam4,
                time
            ] = [
                this.carrierSignalValues,
                this.sineModulationSignalValues,
                this.bipolarSignal.values,
                this.unipolarSignal.values,
                this.pam4Signal.values,
                this.timeValues
            ];
            switch (this.selected) {
                case 'am':
                    return carrier.map((el, index) => el * sine[index]);
                case 'fm':
                    return time.map((el, index) => {
                        const multiplier = (sine[index] >= 0) ? 8 : 20;
                        return Math.sin(Math.PI * el * multiplier)
                    });
                case 'bask':
                    return carrier.map((el, index) => el * unipolar[index]);
                case 'bpsk':
                    return carrier.map((el, index) => el * bipolar[index]);
                case 'fsk':
                    return time.map((el, index) => {
                        const multiplier = (bipolar[index] === 1) ? 10 : 20;
                        return Math.sin(Math.PI * el * multiplier)
                    });
                case 'pam4':
                    return carrier.map((el, index) => {
                        const amplitudes = {
                            '3': 1, '1': 2, '-1': 3, '-3': 4
                        }
                        return amplitudes[`${pam4[index]}`] * el / 3;
                    });
                default:
                    return [];
            }
        }
    },
    methods: {
        /**
         * Changes selected property
         * @param {string} key - possible values: am, fm, bask, bpsk, pam4
         */
        changeSelected(key) {
            this.selected = key;
        },

        /** @returns {number} */
        nextCarrierValue() {
            return Math.sin(15 * Math.PI * this.time);
        },

        /** @returns {number} */
        nextSineModulationValue() {
            return Math.sin(Math.PI * this.time);
        },

        /**
         * Returns binary values periodically from
         * @param {BinarySignal} obj
         * @returns {number}
         */
        nextBinaryValue(obj) {
            if (this.binaryCounter === this.binarySymbolLength) {
                const currentlyReturnsIndex = obj.pool.findIndex(el => el === obj.currentlyReturns);
                obj.currentlyReturns = (currentlyReturnsIndex === obj.pool.length -1) ? obj.pool[0] : obj.pool[currentlyReturnsIndex + 1];
            }
            return obj.currentlyReturns;
        },
    },
    mounted() {
        // Create interval to push new signal values to arrays
        this.intervalId = window.setInterval(() => {

            // Push new values to arrays
            this.carrierSignalValues.unshift(this.nextCarrierValue());
            this.sineModulationSignalValues.unshift(this.nextSineModulationValue());
            this.bipolarSignal.values.unshift(this.nextBinaryValue(this.bipolarSignal));
            this.unipolarSignal.values.unshift(this.nextBinaryValue(this.unipolarSignal));
            this.pam4Signal.values.unshift(this.nextBinaryValue(this.pam4Signal));
            this.timeValues.unshift(this.time);

            // Loop through arrays and remove last values if lengths are too big
            [
                this.carrierSignalValues,
                this.sineModulationSignalValues,
                this.bipolarSignal.values,
                this.unipolarSignal.values,
                this.pam4Signal.values,
                this.timeValues
            ].forEach(array => {
                if (array.length > 600) {
                    array.pop();
                }
            });
            this.time += 0.005;

            this.binaryCounter = (this.binaryCounter === this.binarySymbolLength) ? 0 : this.binaryCounter + 1;
        }, 30);
    },
    unmounted() {
        // Clear interval when component unmounts
        window.clearInterval(this.intervalId);
    }
}
</script>
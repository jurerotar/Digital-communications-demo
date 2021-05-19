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
    <single-signal-canvas v-if="hasSineModulation"
                          :data="sineModulationSignalValues"
                          :canvas_id="'sine-modulation-signal'"
                          :title="'Sinusni modulacijski signal'">
    </single-signal-canvas>
    <single-signal-canvas v-if="hasCarrier"
                          :data="carrierSignalValues"
                          :canvas_id="'carrier-signal'"
                          :title="'Nosilec'">
    </single-signal-canvas>
    <single-signal-canvas v-if="hasBinary"
                          :data="binarySignal.values"
                          :canvas_id="'binary-signal'"
                          :is_binary="true"
                          :title="'Binarni signal'">
    </single-signal-canvas>
    <single-signal-canvas v-if="hasUnipolar"
                          :data="unipolarSignal.values"
                          :canvas_id="'unipolar-signal'"
                          :is_binary="true"
                          :title="'Unipolarni signal'">
    </single-signal-canvas>
    <single-signal-canvas v-if="hasPam4"
                          :data="pam4Signal.values"
                          :canvas_id="'pam4-signal'"
                          :is_binary="true"
                          :title="'PAM 4 signal'">
    </single-signal-canvas>

    <single-signal-canvas :data="modulated"
                          :canvas_id="'modulated-signal'"
                          :is_binary="false"
                          :title="'Moduliran signal'">
    </single-signal-canvas>

</template>

<script>
/**
 * @typedef {Object} BinarySignal
 * @property {number[]} values
 * @property {number[]} pool
 * @property {number} currentlyReturns

 * @typedef {Object} Modulation
 * @property {string} label
 * @property {string} key
 * @property {boolean} hasCarrier
 * @property {boolean} hasSineModulation
 * @property {boolean} hasBinary
 * @property {boolean} hasUnipolar
 * @property {boolean} hasPam4
 */

import Collapsible from "@/components/global/Collapsible";
import SingleSignalCanvas from "@/components/canvas/SingleSignalCanvas";

export default {
    name: "Modulations",
    components: {SingleSignalCanvas, Collapsible},
    data() {
        return {
            intervalId: null,
            selected: 'am',
            time: 0,
            binaryCounter: 0,
            binarySymbolLength: 100,

            /**
             * @type {number[]}
             */
            carrierSignalValues: [],

            /**
             * @type {number[]}
             */
            sineModulationSignalValues: [],

            /**
             * @type {BinarySignal}
             */
            binarySignal: {
                values: [],
                pool: [-1, 1],
                currentlyReturns: 1,
            },

            /**
             * @type {BinarySignal}
             */
            unipolarSignal: {
                values: [],
                pool: [-1, 0],
                currentlyReturns: 0,
            },

            /**
             * @type {BinarySignal}
             */
            pam4Signal: {
                values: [],
                pool: [-3, -1, 1, 3],
                currentlyReturns: 1,
            },

            /**
             * Objects in this array determine which canvases wll be drawn
             * @type {Modulation[]}
             */
            modulations: [
                {
                    label: 'AM',
                    key: 'am',
                    hasCarrier: true,
                    hasSineModulation: true,
                    hasBinary: false,
                    hasUnipolar: false,
                    hasPam4: false,
                },
                // {
                //     label: 'FM',
                //     key: 'fm',
                //     hasCarrier: true,
                //     hasSineModulation: true,
                //     hasBinary: false,
                //     hasUnipolar: false,
                //     hasPam4: false,
                //
                // },
                {
                    label: 'BASK',
                    key: 'bask',
                    hasCarrier: true,
                    hasSineModulation: false,
                    hasBinary: false,
                    hasUnipolar: true,
                    hasPam4: false,

                },
                {
                    label: 'BPSK',
                    key: 'bpsk',
                    hasCarrier: true,
                    hasSineModulation: false,
                    hasBinary: true,
                    hasUnipolar: false,
                    hasPam4: false,
                },
                {
                    label: 'PAM 4',
                    key: 'pam4',
                    hasCarrier: true,
                    hasSineModulation: false,
                    hasBinary: false,
                    hasUnipolar: false,
                    hasPam4: true,
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
        /**
         * @returns {boolean}
         */
        hasCarrier() {
            return this.selectedModulationData.hasCarrier;
        },
        /**
         * @returns {boolean}
         */
        hasSineModulation() {
            return this.selectedModulationData.hasSineModulation;
        },
        /**
         * @returns {boolean}
         */
        hasBinary() {
            return this.selectedModulationData.hasBinary;
        },
        /**
         * @returns {boolean}
         */
        hasUnipolar() {
            return this.selectedModulationData.hasUnipolar;
        },
        /**
         * @returns {boolean}
         */
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
                binary,
                unipolar,
                pam4,

            ] = [
                this.carrierSignalValues,
                this.sineModulationSignalValues,
                this.binarySignal.values,
                this.unipolarSignal.values,
                this.pam4Signal.values
            ];
            switch (this.selected) {
                case 'am':
                    return carrier.map((el, index) => el * sine[index]);
                case 'fm':
                    return sine.map((el) => {
                        const multiplier = (el < 0) ? 0.2 : 4;
                        return Math.sin(20 * Math.PI * this.time * multiplier);
                    });
                case 'bask':
                    return carrier.map((el, index) => el * unipolar[index]);
                case 'bpsk':
                    return carrier.map((el, index) => el * binary[index]);
                case 'pam4':
                    return carrier.map((el, index) => {
                        const amplitudes = {
                            '3': 1,
                            '1': 2,
                            '-1': 3,
                            '-3': 4
                        }
                        return amplitudes[`${pam4[index]}`] * el/3;
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

        /**
         * @returns {number}
         */
        nextCarrierValue() {
            return Math.sin(20 * Math.PI * this.time);
        },

        /**
         * @returns {number}
         */
        nextSineModulationValue() {
            return Math.sin(Math.PI * this.time);
        },

        /**
         * Returns a value determined by binarySignal.currentlyReturns which randomizes every 100 calls
         * @returns {number}
         */
        nextBinaryValue() {
            if (this.binaryCounter === this.binarySymbolLength) {
                this.binarySignal.currentlyReturns = this.binarySignal.pool.random();
            }
            return this.binarySignal.currentlyReturns;
        },

        /**
         * Returns a value determined by unipolarSignal.currentlyReturns which randomizes every 100 calls
         * @returns {number}
         */
        nextUnipolarValue() {
            if (this.binaryCounter === this.binarySymbolLength) {
                this.unipolarSignal.currentlyReturns = this.unipolarSignal.pool.random();
            }
            return this.unipolarSignal.currentlyReturns;
        },

        /**
         * Returns a value determined by pam4Signal.currentlyReturns which randomizes every 100 calls
         * @returns {number}
         */
        nextPam4Value() {
            if (this.binaryCounter === this.binarySymbolLength) {
                this.pam4Signal.currentlyReturns = this.pam4Signal.pool.random();
            }
            return this.pam4Signal.currentlyReturns;
        },
    },
    mounted() {
        // Create interval to push new signal values to arrays
        this.intervalId = window.setInterval(() => {

            // Push new values to arrays
            this.carrierSignalValues.unshift(this.nextCarrierValue());
            this.sineModulationSignalValues.unshift(this.nextSineModulationValue());
            this.binarySignal.values.unshift(this.nextBinaryValue());
            this.unipolarSignal.values.unshift(this.nextUnipolarValue());
            this.pam4Signal.values.unshift(this.nextPam4Value());

            // Loop through arrays and remove last values if lengths are too big
            [
                this.carrierSignalValues,
                this.sineModulationSignalValues,
                this.binarySignal.values,
                this.unipolarSignal.values,
                this.pam4Signal.values
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
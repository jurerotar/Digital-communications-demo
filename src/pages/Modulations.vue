<template>
    <h1 class="text-3xl font-medium mb-4">Modulacije</h1>
    <collapsible>
        <theory-modulations></theory-modulations>
    </collapsible>
    <h2 class="text-xl font-medium mb-1">Analogne modulacije</h2>
    <button-container>
        <styled-button
            :class="[selected === modulation.key ? 'bg-blue-300' : 'bg-gray-300']"
            @click="changeSelected(modulation.key)"
            v-for="modulation in analogModulations" :key="modulation.key">
            {{ modulation.label }}
        </styled-button>
    </button-container>
    <h2 class="text-xl font-medium mb-1">Digitalne modulacije</h2>
    <button-container>
        <styled-button
            :class="[selected === modulation.key ? 'bg-blue-300' : 'bg-gray-300']"
            @click="changeSelected(modulation.key)"
            v-for="modulation in digitalModulations" :key="modulation.key">
            {{ modulation.label }}
        </styled-button>
    </button-container>
    <positive-only-signal v-if="selectedModulationData.hasSineModulation"
                          :data="sineModulationSignalValues"
                          :canvas_id="'sine-modulation-signal'"
                          :title="'Sinusni modulacijski signal'"
                          :vertical_pool="[1, 0.5, -0.5, -1]"
                          :description = "'Sinusni podatkovni signal.'"
                          :note = "''"
                          :is_binary="isDigitalModulation(selectedModulationData)"
    >
    </positive-only-signal>
    <positive-only-signal v-if="selectedModulationData.hasBinaryLevel1"
                          :data="binaryLevel1Signal.values"
                          :canvas_id="'unipolar-signal'"
                          :title="'Unipolarni signal'"
                          :vertical_pool="[1, 0.5, -0.5, -1]"
                          :description = "'Unipolarni signal je sestavljen iz vrednosti 1 in 0.'"
                          :note = "''"
                          :is_binary="isDigitalModulation(selectedModulationData)"
    >
    </positive-only-signal>
    <positive-only-signal v-if="selectedModulationData.hasBinaryLevel2"
                          :data="binaryLevel2Signal.values"
                          :canvas_id="'binary-signal'"
                          :title="'Binarni signal'"
                          :vertical_pool="[1, 0.5, -0.5, -1]"
                          :description = "'Bipolarni signal je sestavljen iz vrednosti 1 in -1.'"
                          :note = "''"
                          :is_binary="isDigitalModulation(selectedModulationData)"
    >
    </positive-only-signal>
    <level4-signal
        v-if="selectedModulationData.hasBinaryLevel4"
        :data="binaryLevel4Signal.values"
        :title="'4-nivojski bipolarni signal'"
        :description = "''"
        :note = "'4-nivojski bipolarni signal je sestavljen iz vrednosti 3, 1, -1, -3.'"
        :is_binary="isDigitalModulation(selectedModulationData)"
    >
    </level4-signal>
    <positive-only-signal v-if="selectedModulationData.hasCarrier"
                          :data="carrierSignalValues"
                          :canvas_id="'carrier-signal'"
                          :title="'Nosilec'"
                          :vertical_pool="[1, 0.5, -0.5, -1]"
                          :description = "'Nosilec je visokofrekvenčni signal, s katerim moduliramo podatkovni signal.'"
                          :note = "''"
                          :is_binary="isDigitalModulation(selectedModulationData)"
    >
    </positive-only-signal>
    <positive-only-signal :data="modulated"
                          :canvas_id="'modulated-signal'"
                          :title="'Moduliran signal'"
                          :vertical_pool="[1, 0.5, -0.5, -1]"
                          :is_modulated="true"
                          :description = "selectedModulationData.description"
                          :note = "selectedModulationData.note"
                          :is_binary="isDigitalModulation(selectedModulationData)"
    >
    </positive-only-signal>
</template>

<script>
import Collapsible from "@/components/global/Collapsible";
import PositiveOnlySignal from "@/components/canvas/PositiveOnlySignal";
import TheoryModulations from "@/components/theory/TheoryModulations";
import '@/types.js';
import ButtonContainer from "@/components/global/ButtonContainer";
import StyledButton from "@/components/global/StyledButton";
import Level4Signal from "@/components/canvas/Level4Signal";


export default {
    name: "Modulations",
    components: {StyledButton, ButtonContainer, PositiveOnlySignal, Collapsible, TheoryModulations, Level4Signal},
    data() {
        return {
            /** @type {number|null} */
            intervalId: null,

            /** @type {string} */
            selected: 'am-lc',

            /** @type {number} */
            binaryCounter: 0,

            /** @type {number} */
            binarySymbolLength: 120,

            /** @type {number[]} */
            timeValues: [...Array(600).fill(0)].map((t, i) => i * 0.005),

            /** @type {number[]} */
            carrierSignalValues: [...Array(600).fill(0)].map((t, i) => Math.sin(i * 0.005 * 15 * Math.PI)),

            /** @type {number[]} */
            sineModulationSignalValues: [...Array(600).fill(0)].map((t, i) => Math.sin(i * 0.005 * Math.PI)),

            /** Unipolar signal
             * @type {BinarySignal} */
            binaryLevel1Signal: {
                values: Array(5).fill(0).map((el, i) => Array(120).fill((i % 2 === 1) ? -1 : 0)).flat(),
                pool: [-1, 0],
                currentlyReturns: -1,
            },

            /** Bipolar signal
             * @type {BinarySignal} */
            binaryLevel2Signal: {
                values: Array(5).fill(0).map((el, i) => Array(120).fill((i % 2 === 1) ? 1 : -1)).flat(),
                pool: [-1, 1],
                currentlyReturns: 1,
            },

            /** 4 level signal
             * @type {BinarySignal} */
            binaryLevel4Signal: {
                values: [Array(120).fill(3), Array(120).fill(1), Array(120).fill(-1), Array(120).fill(-3), Array(120).fill(3)].flat(),
                pool: [-3, -1, 1, 3],
                currentlyReturns: -3,
            },

            /**
             * Objects in this array determine which canvases will be drawn
             * @type {Array<Modulation>}
             */
            modulations: [
                {
                    label: 'AM-LC',
                    key: 'am-lc',
                    description: '',
                    note: '',
                    hasCarrier: true,
                    hasSineModulation: true,
                    hasBinaryLevel1: false,
                    hasBinaryLevel2: false,
                    hasBinaryLevel4: false,
                },
                {
                    label: 'AM-SC',
                    key: 'am-sc',
                    description: '',
                    note: '',
                    hasCarrier: true,
                    hasSineModulation: true,
                    hasBinaryLevel1: false,
                    hasBinaryLevel2: false,
                    hasBinaryLevel4: false,
                },
                {
                    label: 'FM',
                    key: 'fm',
                    description: '',
                    note: '',
                    hasCarrier: true,
                    hasSineModulation: true,
                    hasBinaryLevel1: false,
                    hasBinaryLevel2: false,
                    hasBinaryLevel4: false,
                },
                {
                    label: '2ASK',
                    key: '2ask',
                    description: '',
                    note: '',
                    hasCarrier: true,
                    hasSineModulation: false,
                    hasBinaryLevel1: true,
                    hasBinaryLevel2: false,
                    hasBinaryLevel4: false,
                },
                {
                    label: '4ASK',
                    key: '4ask',
                    description: '',
                    note: '',
                    hasCarrier: true,
                    hasSineModulation: false,
                    hasBinaryLevel1: false,
                    hasBinaryLevel2: false,
                    hasBinaryLevel4: true,
                },
                {
                    label: '2PSK',
                    key: '2psk',
                    description: '',
                    note: '',
                    hasCarrier: true,
                    hasSineModulation: false,
                    hasBinaryLevel1: false,
                    hasBinaryLevel2: true,
                    hasBinaryLevel4: false,
                },
                {
                    label: '4PSK',
                    key: '4psk',
                    description: '',
                    note: '',
                    hasCarrier: true,
                    hasSineModulation: false,
                    hasBinaryLevel1: false,
                    hasBinaryLevel2: false,
                    hasBinaryLevel4: true,
                },
                {
                    label: '2FSK',
                    key: '2fsk',
                    description: '',
                    note: '',
                    hasCarrier: true,
                    hasSineModulation: false,
                    hasBinaryLevel1: true,
                    hasBinaryLevel2: false,
                    hasBinaryLevel4: false,
                },
                {
                    label: '4FSK',
                    key: '4fsk',
                    description: '',
                    note: '',
                    hasCarrier: true,
                    hasSineModulation: false,
                    hasBinaryLevel1: false,
                    hasBinaryLevel2: false,
                    hasBinaryLevel4: true,
                },
            ]
        }
    },
    computed: {
        /**
         * Finds currently selected modulation from modulations property by selected key
         * @returns {Modulation}
         */
        selectedModulationData() {
            return this.modulations.find(el => el.key === this.selected);
        },
        /**
         * Returns an array of analog modulations
         * @returns {Array<Modulation>}
         */
        analogModulations() {
            return this.modulations.filter(modulation => this.isDigitalModulation(modulation) === false);
        },
        /**
         * Returns an array of digital modulations
         * @returns {Array<Modulation>}
         */
        digitalModulations() {
            return this.modulations.filter(modulation => this.isDigitalModulation(modulation) === true);
        },
        /**
         * Returns an array of numbers computed by selected modulation key
         * @returns {number[]}
         */
        modulated() {
            const PSK2Amplitudes = {'1': 1, '-1': -1};
            const PSK4Amplitudes = {'3': Math.PI / 2, '1': Math.PI, '-1': 3 * Math.PI / 2, '-3': 2 * Math.PI};

            const FSK2Multipliers = {'1': 12, '-1': 30};
            const FSK4Multipliers = {'3': 5, '1': 15, '-1': 30, '-3': 60};

            const ASK2Amplitudes = {'0': 0, '-1': -1};
            const ASK4Amplitudes = {'3': 0.5, '1': 1, '-1': 2, '-3': 3};

            const [carrier, sine, binary1Level, binary2Level, binary4Level, time] = [
                this.carrierSignalValues,
                this.sineModulationSignalValues,
                this.binaryLevel1Signal.values,
                this.binaryLevel2Signal.values,
                this.binaryLevel4Signal.values,
                this.timeValues
            ];
            switch (this.selected) {
                case 'am-lc':
                    // Multiply carrier and sine with 1.5 offset
                    return carrier.map((el, index) => el * (1.5 + sine[index]));

                case 'am-sc':
                    // Multiply carrier and sine
                    return carrier.map((el, index) => el * sine[index]);

                // Frequency modulation
                case 'fm':
                    return time.map(t => Math.cos(15 * Math.PI * t + (10 * (Math.cos(Math.PI * t) + 150))))

                // Binary amplitude shift keying
                case '2ask':
                    return carrier.map((el, index) => el * ASK2Amplitudes[`${binary1Level[index]}`]);

                // Binary amplitude shift keying
                case '4ask':
                    return carrier.map((el, index) => el * ASK4Amplitudes[binary4Level[index]]);

                // Binary phase shift keying
                case '2psk':
                    return carrier.map((el, index) => el * PSK2Amplitudes[binary2Level[index]]);

                // Binary phase shift keying
                case '4psk':
                    return time.map((el, index) => Math.sin(15 * Math.PI * el + PSK4Amplitudes[binary4Level[index]]));

                // Frequency shift keying
                case '2fsk':
                    return time.map((t, index) => {
                        // We change frequency multiplier discretely based on current value of bipolar signal
                        return Math.sin(Math.PI * t * FSK2Multipliers[binary2Level[index]]);
                    });

                // Frequency shift keying
                case '4fsk':
                    return time.map((t, index) => {
                        // We change frequency multiplier discretely based on current value of 4-level binary signal
                        return Math.sin(Math.PI * t * FSK4Multipliers[binary4Level[index]]);
                    });

                // // 4 level pulse amplitude modulations
                // case 'pam4':
                //     return carrier.map((el, index) => pam4Amplitudes[`${binary4Level[index]}`] * el / 3);

                default:
                    return [];
            }
        }
    },
    methods: {
        /**
         * Changes selected property
         * @param {string} key
         */
        changeSelected(key) {
            this.selected = key;
        },
        /**
         * Returns binary values periodically from
         * @param {BinarySignal} obj
         * @returns {number}
         */
        nextBinaryValue(obj) {
            if (this.binaryCounter === this.binarySymbolLength) {
                const currentlyReturnsIndex = obj.pool.findIndex(el => el === obj.currentlyReturns);
                obj.currentlyReturns = (currentlyReturnsIndex === obj.pool.length - 1) ? obj.pool[0] : obj.pool[currentlyReturnsIndex + 1];
            }
            return obj.currentlyReturns;
        },
        /**
         * Determines if modulation is digital
         * @param {Modulation} modulation
         * @returns {boolean}
         */
        isDigitalModulation(modulation) {
            return modulation.hasBinaryLevel1 || modulation.hasBinaryLevel2 || modulation.hasBinaryLevel4;
        }
    },
    mounted() {
        // Start time at 600 * 0.005, because we initiate arrays with 600 values already in
        let time = 600 * 0.005;
        // Create interval to push new signal values to arrays
        this.intervalId = window.setInterval(() => {
            // Push new values to arrays
            this.carrierSignalValues.unshift(Math.sin(15 * Math.PI * time));
            this.sineModulationSignalValues.unshift(Math.sin(Math.PI * time));
            this.binaryLevel1Signal.values.unshift(this.nextBinaryValue(this.binaryLevel1Signal));
            this.binaryLevel2Signal.values.unshift(this.nextBinaryValue(this.binaryLevel2Signal));
            this.binaryLevel4Signal.values.unshift(this.nextBinaryValue(this.binaryLevel4Signal));
            this.timeValues.unshift(time);

            // Loop through arrays and remove last values if lengths are too big
            [
                this.carrierSignalValues,
                this.sineModulationSignalValues,
                this.binaryLevel1Signal.values,
                this.binaryLevel2Signal.values,
                this.binaryLevel4Signal.values,
                this.timeValues
            ].forEach(array => {
                if (array.length > 600) {
                    array.pop();
                }
            });
            time += 0.005;

            this.binaryCounter = (this.binaryCounter === this.binarySymbolLength) ? 0 : this.binaryCounter + 1;
        }, 30);
    },
    unmounted() {
        // Clear interval when component unmounts
        window.clearInterval(this.intervalId);
    }
}
</script>
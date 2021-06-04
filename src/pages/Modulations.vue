<template>
    <h1 class="text-3xl font-medium mb-4">Modulacije</h1>
    <collapsible>
        <theory-modulations></theory-modulations>
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
    <positive-only-signal v-if="selectedModulationData.hasSineModulation"
                          :data="sineModulationSignalValues"
                          :canvas_id="'sine-modulation-signal'"
                          :title="'Sinusni modulacijski signal'"
                          :vertical_pool="[1, 0.5, -0.5, -1]"
                          :type="'sin'"
    >
    </positive-only-signal>
    <positive-only-signal v-if="selectedModulationData.hasCarrier"
                          :data="carrierSignalValues"
                          :canvas_id="'carrier-signal'"
                          :title="'Nosilec'"
                          :vertical_pool="[1, 0.5, -0.5, -1]"
                          :type="'carrier'"
    >
    </positive-only-signal>
    <positive-only-signal v-if="selectedModulationData.hasBipolar"
                          :data="bipolarSignal.values"
                          :canvas_id="'binary-signal'"
                          :is_binary="true"
                          :title="'Binarni signal'"
                          :vertical_pool="[1, 0.5, -0.5, -1]"
                          :type="'bipolar'"
    >
    </positive-only-signal>
    <positive-only-signal v-if="selectedModulationData.hasUnipolar"
                          :data="unipolarSignal.values"
                          :canvas_id="'unipolar-signal'"
                          :is_binary="true"
                          :title="'Unipolarni signal'"
                          :vertical_pool="[1, 0.5, -0.5, -1]"
                          :type="'unipolar'"
    >
    </positive-only-signal>
    <positive-only-signal v-if="selectedModulationData.hasPam4"
                          :data="pam4Signal.values"
                          :canvas_id="'pam4-signal'"
                          :is_binary="true"
                          :title="'PAM 4 signal'"
                          :vertical_pool="[3, 1, -1, -3]"
                          :type="'pam4'"
    >
    </positive-only-signal>
    <positive-only-signal :data="modulated"
                          :canvas_id="'modulated-signal'"
                          :is_binary="false"
                          :title="'Moduliran signal'"
                          :vertical_pool="[1, 0.5, -0.5, -1]"
                          :is_modulated="true"
    >
    </positive-only-signal>
</template>

<script>
import Collapsible from "@/components/global/Collapsible";
import PositiveOnlySignal from "@/components/canvas/PositiveOnlySignal";
import TheoryModulations from "@/components/theory/TheoryModulations";
import '@/types.js';

export default {
    name: "Modulations",
    components: {PositiveOnlySignal, Collapsible, TheoryModulations},
    data() {
        return {
            /** @type {number|null} */
            intervalId: null,

            /** @type {string} */
            selected: 'am-lc',

            /**
             * Start time at 600 * 0.005, because we initiate arrays with 600 values already in
             * @type {number}
             */
            time: 600 * 0.005,

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

            /** @type {BinarySignal} */
            bipolarSignal: {
                values: Array(5).fill(0).map((el, i) => Array(120).fill((i % 2 === 1) ? 1 : -1)).flat(),
                pool: [-1, 1],
                currentlyReturns: 1,
            },

            /** @type {BinarySignal} */
            unipolarSignal: {
                values: Array(5).fill(0).map((el, i) => Array(120).fill((i % 2 === 1) ? -1 : 0)).flat(),
                pool: [-1, 0],
                currentlyReturns: -1,
            },

            /** @type {BinarySignal} */
            pam4Signal: {
                values: [Array(120).fill(-3), Array(120).fill(-1), Array(120).fill(1), Array(120).fill(3), Array(120).fill(-3)].flat(),
                pool: [-3, -1, 1, 3],
                currentlyReturns: -1,
            },

            /**
             * Objects in this array determine which canvases will be drawn
             * @type {Modulation[]}
             */
            modulations: [
                {
                    label: 'AM-LC',
                    key: 'am-lc',
                    hasCarrier: true,
                    hasSineModulation: true,
                    hasBipolar: false,
                    hasUnipolar: false,
                    hasPam4: false,
                },
                {
                    label: 'AM-SC',
                    key: 'am-sc',
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
         * @returns {Modulation}
         */
        selectedModulationData() {
            return this.modulations.find(el => el.key === this.selected);
        },
        /**
         * Returns an array of numbers computed by selected modulation key
         * @returns {number[]}
         */
        modulated() {
            const pam4Amplitudes = {'3': -4, '1': -2, '-1': 2, '-3': 4};
            const [carrier, sine, bipolar, unipolar, pam4, time] = [
                this.carrierSignalValues,
                this.sineModulationSignalValues,
                this.bipolarSignal.values,
                this.unipolarSignal.values,
                this.pam4Signal.values,
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
                    return time.map(t => Math.cos(15 * Math.PI * t + 10 * (Math.cos(Math.PI * t) + 150)));

                // Binary amplitude shift keying
                case 'bask':
                    return carrier.map((el, index) => el * unipolar[index]);

                // Binary phase shift keying
                case 'bpsk':
                    return carrier.map((el, index) => el * bipolar[index]);

                // Frequency shift keying
                case 'fsk':
                    return time.map((t, index) => {
                        // We change frequency multiplier discretely based on current value of bipolar signal
                        const multiplier = (bipolar[index] === 1) ? 12 : 30;
                        return Math.sin(Math.PI * t * multiplier);
                    });

                // 4 level pulse amplitude modulations
                case 'pam4':
                    return carrier.map((el, index) => pam4Amplitudes[`${pam4[index]}`] * el / 3);

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
    },
    mounted() {
        // Create interval to push new signal values to arrays
        this.intervalId = window.setInterval(() => {
            // Push new values to arrays
            this.carrierSignalValues.unshift(Math.sin(15 * Math.PI * this.time));
            this.sineModulationSignalValues.unshift(Math.sin(Math.PI * this.time));
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
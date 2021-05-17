<template>
    <h1 class="text-3xl font-medium mb-4">Spekter</h1>
    <collapsible>
        <theory-spectrum></theory-spectrum>
    </collapsible>
    <h2 class="font-semibold text-xl">Oblika signala</h2>
    <div class="flex flex-col sm:flex-row">
        <button
            class="text-white w-fit-content font-bold py-2 px-4 mb-2 sm:mr-2 rounded outline-none duration-300 transition-colors h-12"
            :class="[selected === shape.key ? 'bg-blue-300' : 'bg-gray-300']"
            @click="changeSelected(shape.key)"
            v-for="shape in signalShapes" :key="shape.key">
            {{ shape.label }}
        </button>
    </div>
    <h2 class="font-semibold text-xl">Amplituda</h2>
    <div class="flex flex-col sm:flex-row">
        <button
            class="text-white w-fit-content font-bold py-2 px-4 mb-2 sm:mr-2 rounded outline-none duration-300 transition-colors h-12"
            :class="[amplitudeValue === amplitude.key ? 'bg-blue-300' : 'bg-gray-300']"
            @click="changeAmplitude(amplitude.key)"
            v-for="amplitude in amplitudes" :key="amplitude.key">
            {{ amplitude.label }}
        </button>
    </div>
    <single-signal-canvas
        :canvas_id="'spectrum-original-signal'"
        :data="input"
        :title="'Prvotni signal'">
    </single-signal-canvas>
    <single-signal-canvas
        :canvas_id="'spectrum-original-signal'"
        :data="output"
        :title="'Spekter signala'"
        :color_id = "1">
    </single-signal-canvas>
</template>

<script>
import TheorySpectrum from "@/components/theory/TheorySpectrum";
import Collapsible from "@/components/global/Collapsible";
import SingleSignalCanvas from "@/components/canvas/SingleSignalCanvas";

export default {
    name: "Spectrum",
    components: {SingleSignalCanvas, Collapsible, TheorySpectrum},
    data() {
        return {
            fftSize: 512,
            fft: null,
            amplitudeValue: 1,
            signalShapes: [
                {
                    label: 'Sinusni',
                    key: 'sin',
                    fn: () => [...Array(this.fftSize).keys()].map(el => Math.sin(el * 0.05 * this.amplitude)),
                },
                {
                    label: 'Kosinusni',
                    key: 'cos',
                    fn: () => [...Array(this.fftSize).keys()].map(el => Math.cos(el * 0.05 * this.amplitude)),
                },
                {
                    label: 'Kvadratni',
                    key: 'square',
                    fn: () => [...Array(100 * this.amplitude).keys()].map(() => -1),
                },
                {
                    label: 'Gauss',
                    key: 'gauss',
                    fn: () => {
                        const gauss = [0.0001, 0.0001, 0.0001, 0.0001, 0.0001, 0.0002, 0.0002, 0.0002, 0.0003, 0.0004, 0.0004, 0.0005, 0.0006, 0.0007, 0.0009, 0.0010, 0.0012, 0.0015, 0.0017, 0.0020, 0.0024, 0.0028, 0.0033, 0.0038, 0.0044, 0.0051, 0.0060, 0.0069, 0.0079, 0.0091, 0.0104, 0.0119, 0.0136, 0.0154, 0.0175, 0.0198, 0.0224, 0.0252, 0.0283, 0.0317, 0.0355, 0.0396, 0.0440, 0.0488, 0.0540, 0.0596, 0.0656, 0.0721, 0.0790, 0.0863, 0.0940, 0.1023, 0.1109, 0.1200, 0.1295, 0.1394, 0.1497, 0.1604, 0.1714, 0.1826, 0.1942, 0.2059, 0.2179, 0.2299, 0.2420, 0.2541, 0.2661, 0.2780, 0.2897, 0.3011, 0.3123, 0.3230, 0.3332, 0.3429, 0.3521, 0.3605, 0.3683, 0.3752, 0.3814, 0.3867, 0.3910, 0.3945, 0.3970, 0.3984, 0.3989, 0.3989, 0.3984, 0.3970, 0.3945, 0.3910, 0.3867, 0.3814, 0.3752, 0.3683, 0.3605, 0.3521, 0.3429, 0.3332, 0.3230, 0.3123, 0.3011, 0.2897, 0.2780, 0.2661, 0.2541, 0.2420, 0.2299, 0.2179, 0.2059, 0.1942, 0.1826, 0.1714, 0.1604, 0.1497, 0.1394, 0.1295, 0.1200, 0.1109, 0.1023, 0.0940, 0.0863, 0.0790, 0.0721, 0.0656, 0.0596, 0.0540, 0.0488, 0.0440, 0.0396, 0.0355, 0.0317, 0.0283, 0.0252, 0.0224, 0.0198, 0.0175, 0.0154, 0.0136, 0.0119, 0.0104, 0.0091, 0.0079, 0.0069, 0.0060, 0.0051, 0.0044, 0.0038, 0.0033, 0.0028, 0.0024, 0.0020, 0.0017, 0.0015, 0.0012, 0.0010, 0.0009, 0.0007, 0.0006, 0.0005, 0.0004, 0.0004, 0.0003, 0.0002, 0.0002, 0.0002, 0.0001, 0.0001, 0.0001, 0.0001, 0.0001].map((el) => -el * 3);
                        if(this.amplitude > 1) {
                            return gauss.map(el => Array(Math.trunc(this.amplitude)).fill(el)).flat();
                        }
                        if(this.amplitude < 1) {
                            return [...gauss.filter((el, index) => index % Math.trunc(this.amplitude ** -1) === 0)];
                        }
                        return gauss;

                    }
                },
            ],
            amplitudes: [
                {
                    label: '1/4',
                    key: 0.25
                },
                {
                    label: '1/2',
                    key: 0.5
                },
                {
                    label: '1',
                    key: 1
                },
                {
                    label: '2',
                    key: 2
                },
                {
                    label: '3',
                    key: 3
                },
            ],
        }
    },
    methods: {
        /**
         * Sets spectrum type in the store
         * @param key {string} - possible values: sin, cos, gauss, square
         */
        changeSelected(key) {
            this.$store.commit('spectrum/changeSelected', key);
        },
        /**
         * Pads the array with zeros to match fft.size if array length is smaller than fft.size
         * @returns {number[]}
         */
        padArray(array) {
            if(array.length === this.fftSize) {
                return array;
            }
            const padSize = (this.fftSize - array.length) / 2;
            const zerosArray = [...Array(Math.trunc(padSize)).keys()].map(() => 0);
            array.unshift(...zerosArray);
            array.push(...zerosArray);
            return array;
        },
        /**
         * Updated amplitudeValue property with currently selected value
         * @param {number} value
         */
        changeAmplitude(value) {
            this.amplitudeValue = value;
        },

    },
    created() {
        const FFT = require('fft.js');
        this.fft = new FFT(this.fftSize);
    },
    computed: {
        /**
         * Returns currently selected signal shape
         * @returns {string}
         */
        selected() {
            return this.$store.state.spectrum.selected;
        },
        /**
         * Returns current amplitude value
         * @returns {number}
         */
        amplitude() {
            return this.amplitudeValue;
        },
        /**
         * Returns an array of numbers based on currently selected signal shape
         * If array length is lower than fft.size, array gets padded with 0s
         * @returns {number[]}
         */
        input() {
            return this.padArray(this.signalShapes.find(el => el.key === this.selected).fn());
        },
        /**
         * Returns an array of FFT transformed numbers. Because fft.realTransform returns Complex array,
         * we filter the array to return only each odd number
         * @returns {number[]}
         */
        output() {
            const out = this.fft.createComplexArray();
            console.log(this.input);
            this.fft.realTransform(out, this.input);
            return out.filter((el, index) => index % 2 === 1);
        }
    },
}
</script>




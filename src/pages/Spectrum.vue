<template>
    <h1 class="text-3xl font-medium mb-4">Spekter</h1>
    <collapsible>
        <theory-spectrum></theory-spectrum>
    </collapsible>
    <h2 class="font-semibold text-xl">Oblika</h2>
    <div class="flex flex-col sm:flex-row my-2">
        <button
            class="text-white w-fit-content font-bold py-2 px-4 mb-2 sm:mr-2 rounded outline-none duration-300 transition-colors h-12"
            :class="[selected === shape.key ? 'bg-blue-300' : 'bg-gray-300']"
            @click="changeSelected(shape.key)"
            v-for="shape in signalShapes" :key="shape.key">
            {{ shape.label }}
        </button>
    </div>
    <h2 class="font-semibold text-xl">T</h2>
    <div class="flex flex-col sm:flex-row my-2">
        <button
            class="text-white w-fit-content font-bold py-2 px-4 mb-2 sm:mr-2 rounded outline-none duration-300 transition-colors h-12"
            :class="[amplitudeValue === amplitude.key ? 'bg-blue-300' : 'bg-gray-300']"
            @click="changeAmplitude(amplitude.key)"
            v-for="amplitude in amplitudes" :key="amplitude.key">
            {{ amplitude.label }}
        </button>
    </div>
    <full-signal
        :canvas_id="'spectrum-original-signal'"
        :data="canvasInput"
        :is_binary="selectedObject.is_binary"
        :title="'Signal'"
    >
    </full-signal>
    <spectrum-canvas
        :canvas_id="'spectrum-signal-spectrum'"
        :data="output"
        :title="'Spekter'"
        :type = "selectedObject.key">
    </spectrum-canvas>
</template>

<script>
import TheorySpectrum from "@/components/theory/TheorySpectrum";
import Collapsible from "@/components/global/Collapsible";
import SpectrumCanvas from "@/components/canvas/Spectrum";
import FullSignal from "@/components/canvas/FullSignal";

/**
 * @typedef {Object} Signal
 * @property {string} label
 * @property {string} key
 * @property {function} fn
 * @property {boolean} is_binary
 */

/**
 * @typedef {Object} Amplitude
 * @property {string} label
 * @property {number} key
 */

export default {
    name: "Spectrum",
    components: {FullSignal, Collapsible, TheorySpectrum, SpectrumCanvas},
    data() {
        return {
            selected: 'sin',
            fftSize: 2048,
            fft: null,
            amplitudeValue: 1,
            /** @type {Array<Signal>} */
            signalShapes: [
                {
                    label: 'Sinusni',
                    key: 'sin',
                    fn: () => [...[...Array(this.fftSize / 2).keys()].map(el => -el - 1).reverse(), ...[...Array(this.fftSize / 2).keys()]].map(el => Math.sin(el * this.amplitude * 0.5) * -1),
                    is_binary: false,
                },
                {
                    label: 'Kosinusni',
                    key: 'cos',
                    fn: () => [...[...Array(this.fftSize / 2).keys()].map(el => -el - 1).reverse(), ...[...Array(this.fftSize / 2).keys()]].map(el => Math.cos(el * this.amplitude * 0.05) * -1),
                    is_binary: false,
                },
                {
                    label: 'Kvadratni',
                    key: 'square',
                    fn: () => [...Array(Math.trunc(100 * this.amplitude)).keys()].map(() => -1),
                    is_binary: true,
                },
                {
                    label: 'Gauss',
                    key: 'gauss',
                    fn: () => {
                        const gauss = [0.0001, 0.0001, 0.0001, 0.0001, 0.0001, 0.0002, 0.0002, 0.0002, 0.0003, 0.0004, 0.0004, 0.0005, 0.0006, 0.0007, 0.0009, 0.0010, 0.0012, 0.0015, 0.0017, 0.0020, 0.0024, 0.0028, 0.0033, 0.0038, 0.0044, 0.0051, 0.0060, 0.0069, 0.0079, 0.0091, 0.0104, 0.0119, 0.0136, 0.0154, 0.0175, 0.0198, 0.0224, 0.0252, 0.0283, 0.0317, 0.0355, 0.0396, 0.0440, 0.0488, 0.0540, 0.0596, 0.0656, 0.0721, 0.0790, 0.0863, 0.0940, 0.1023, 0.1109, 0.1200, 0.1295, 0.1394, 0.1497, 0.1604, 0.1714, 0.1826, 0.1942, 0.2059, 0.2179, 0.2299, 0.2420, 0.2541, 0.2661, 0.2780, 0.2897, 0.3011, 0.3123, 0.3230, 0.3332, 0.3429, 0.3521, 0.3605, 0.3683, 0.3752, 0.3814, 0.3867, 0.3910, 0.3945, 0.3970, 0.3984, 0.3989, 0.3989, 0.3984, 0.3970, 0.3945, 0.3910, 0.3867, 0.3814, 0.3752, 0.3683, 0.3605, 0.3521, 0.3429, 0.3332, 0.3230, 0.3123, 0.3011, 0.2897, 0.2780, 0.2661, 0.2541, 0.2420, 0.2299, 0.2179, 0.2059, 0.1942, 0.1826, 0.1714, 0.1604, 0.1497, 0.1394, 0.1295, 0.1200, 0.1109, 0.1023, 0.0940, 0.0863, 0.0790, 0.0721, 0.0656, 0.0596, 0.0540, 0.0488, 0.0440, 0.0396, 0.0355, 0.0317, 0.0283, 0.0252, 0.0224, 0.0198, 0.0175, 0.0154, 0.0136, 0.0119, 0.0104, 0.0091, 0.0079, 0.0069, 0.0060, 0.0051, 0.0044, 0.0038, 0.0033, 0.0028, 0.0024, 0.0020, 0.0017, 0.0015, 0.0012, 0.0010, 0.0009, 0.0007, 0.0006, 0.0005, 0.0004, 0.0004, 0.0003, 0.0002, 0.0002, 0.0002, 0.0001, 0.0001, 0.0001, 0.0001, 0.0001].map((el) => -el * 3);
                        if (this.amplitude > 1) {
                            return gauss.map(el => Array(Math.trunc(this.amplitude)).fill(el)).flat();
                        }
                        if (this.amplitude < 1) {
                            return [...gauss.filter((el, index) => index % Math.trunc(this.amplitude ** -1) === 0)];
                        }
                        return gauss;
                    },
                    is_binary: false,
                },
                {
                    label: 'Sinc',
                    key: 'sinc',
                    fn: () => [...[...Array(this.fftSize / 2).keys()].map(el => el * -1 - 1).reverse(), ...Array(this.fftSize / 2).keys()].map(el => (el === 0) ? -1 : -Math.sin(el * 0.05 * this.amplitude) / (el) * 6.5),
                    is_binary: false,
                },
            ],
            /** @type {Array<Amplitude>} */
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
            this.selected = key;
        },
        /**
         * Pads the array with zeros to match fft.size if array length is smaller than fft.size
         * @returns {number[]}
         */
        padArray(array) {
            if (array.length === this.fftSize) {
                return array;
            }
            const padSize = (this.fftSize - array.length) / 2;
            const zerosArray = [...Array(Math.trunc(padSize)).keys()].map(() => 0);
            array.unshift(...zerosArray);
            array.push(...zerosArray);
            if(array.length % 2 === 1) {
                array.push(0);
            }
            return array;
        },
        /**
         * Updated amplitudeValue property with currently selected value
         * @param {number} value
         */
        changeAmplitude(value) {
            this.amplitudeValue = value;
        },

        /**
         * @param {number[]} array
         * @returns {number[]}
         **/
        cutArray(array) {
            return array.filter((el, index) => (index >= (array.length / 2 - 350) && index <= (array.length / 2 + 350)));
        }

    },
    created() {
        const FFT = require('fft.js');
        this.fft = new FFT(this.fftSize);
    },
    computed: {
        /**
         * Returns currently selected signal shape
         * @returns {Signal}
         */
        selectedObject() {
            return this.signalShapes.find(el => el.key === this.selected);
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
        paddedInput() {
            return this.padArray(this.selectedObject.fn());
        },
        /**
         * Since fft.size used in fft calculation does not fit on the canvas, we remove excess numbers
         * of input array and return array of size 512
         * @returns {number[]}
         */
        canvasInput() {
            return this.cutArray(this.paddedInput);
        },
        /**
         * Returns an array of FFT transformed numbers. Because fft.realTransform returns Complex array,
         * we filter the array to return only each even number
         * @returns {number[]}
         */
        output() {
            const out = this.fft.createComplexArray();
            this.fft.realTransform(out, this.paddedInput);
            const absoluteSpectrumValues = [];
            for(let i = 0; i < out.length; i += 2) {
                absoluteSpectrumValues.push(Math.sqrt(out[i]**2 + out[i + 1]**2));
            }
            return absoluteSpectrumValues;
        }
    },
}
</script>




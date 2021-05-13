<template>
    <h1 class="text-3xl font-medium mb-4">Spekter</h1>
    <collapsible>
        <theory-spectrum></theory-spectrum>
    </collapsible>
    <div class="flex flex-col sm:flex-row">
        <button
            class="text-white w-fit-content font-bold py-2 px-4 mb-2 sm:mr-2 rounded outline-none duration-300 transition-colors h-12"
            :class="[selected === transformation.key ? 'bg-blue-300' : 'bg-gray-300']"
            @click="changeSelected(transformation.key)"
            v-for="transformation in transformation" :key="transformation.key">
            {{ transformation.label }}
        </button>
    </div>
    <div class="flex flex-col sm:flex-row">
        <button
            class="text-white w-fit-content font-bold py-2 px-4 mb-2 sm:mr-2 rounded outline-none duration-300 transition-colors h-12"
            :class="[selected === amplitude.key ? 'bg-blue-300' : 'bg-gray-300']"
            @click="changeAmplitude(amplitude.key)"
            v-for="amplitude in amplitudes" :key="amplitude.key">
            {{ amplitude.label }}
        </button>
    </div>
    <original-signal :data="input"></original-signal>
    <signal-spectrum :data="output"></signal-spectrum>
</template>

<script>

import Collapsible from "@/components/global/Collapsible";
import OriginalSignal from "@/components/modules/spectrum/OriginalSignal";
import SignalSpectrum from "@/components/modules/spectrum/SignalSpectrum";
import TheorySpectrum from "@/components/modules/spectrum/theory/TheorySpectrum";

export default {
    name: "Spectrum",
    components: {TheorySpectrum, OriginalSignal, SignalSpectrum, Collapsible},
    data() {
        return {
            fftSize: 512,
            transformation: [
                {
                    label: 'Sinusni',
                    key: 'sin'
                },
                {
                    label: 'Kosinusni',
                    key: 'cos'
                },
                {
                    label: 'Kvadratni',
                    key: 'square'
                },
                {
                    label: 'Gauss',
                    key: 'gauss'
                },
            ],
            amplitudes: [
                {
                    label: '1/2',
                    key: 0.5
                },
                {
                    label: '1/4',
                    key: 0.25
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
                    label: '4',
                    key: 4
                },
            ],
            returnsOnes: false,
            offset: {
                x: 180,
                y: 220
            },
            gauss: [0.0001, 0.0001, 0.0001, 0.0001, 0.0001, 0.0001, 0.0001, 0.0002, 0.0002, 0.0002, 0.0003, 0.0004, 0.0004, 0.0005, 0.0006, 0.0007, 0.0009, 0.0010, 0.0012, 0.0015, 0.0017, 0.0020, 0.0024, 0.0028, 0.0033, 0.0038, 0.0044, 0.0051, 0.0060, 0.0069, 0.0079, 0.0091, 0.0104, 0.0119, 0.0136, 0.0154, 0.0175, 0.0198, 0.0224, 0.0252, 0.0283, 0.0317, 0.0355, 0.0396, 0.0440, 0.0488, 0.0540, 0.0596, 0.0656, 0.0721, 0.0790, 0.0863, 0.0940, 0.1023, 0.1109, 0.1200, 0.1295, 0.1394, 0.1497, 0.1604, 0.1714, 0.1826, 0.1942, 0.2059, 0.2179, 0.2299, 0.2420, 0.2541, 0.2661, 0.2780, 0.2897, 0.3011, 0.3123, 0.3230, 0.3332, 0.3429, 0.3521, 0.3605, 0.3683, 0.3752, 0.3814, 0.3867, 0.3910, 0.3945, 0.3970, 0.3984, 0.3989, 0.3989, 0.3984, 0.3970, 0.3945, 0.3910, 0.3867, 0.3814, 0.3752, 0.3683, 0.3605, 0.3521, 0.3429, 0.3332, 0.3230, 0.3123, 0.3011, 0.2897, 0.2780, 0.2661, 0.2541, 0.2420, 0.2299, 0.2179, 0.2059, 0.1942, 0.1826, 0.1714, 0.1604, 0.1497, 0.1394, 0.1295, 0.1200, 0.1109, 0.1023, 0.0940, 0.0863, 0.0790, 0.0721, 0.0656, 0.0596, 0.0540, 0.0488, 0.0440, 0.0396, 0.0355, 0.0317, 0.0283, 0.0252, 0.0224, 0.0198, 0.0175, 0.0154, 0.0136, 0.0119, 0.0104, 0.0091, 0.0079, 0.0069, 0.0060, 0.0051, 0.0044, 0.0038, 0.0033, 0.0028, 0.0024, 0.0020, 0.0017, 0.0015, 0.0012, 0.0010, 0.0009, 0.0007, 0.0006, 0.0005, 0.0004, 0.0004, 0.0003, 0.0002, 0.0002, 0.0002, 0.0001, 0.0001, 0.0001, 0.0001, 0.0001, 0.0001, 0.0001,].map((el) => -el * 3),
            square: [...Array(100).keys()].map(() => 1),
            methods: {
                cos: (el) => Math.cos(el * 0.05),
                sin: (el) => Math.sin(el * 0.05),
            },
            fft: null,
            amplitudeValue: 1,
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
         * Pads the array with zeros to match fft.size
         */
        padArray(array) {
            const padSize = (this.fftSize - array.length) / 2;
            const zerosArray = [...Array(padSize).keys()].map(() => 0);
            array.unshift(...zerosArray);
            array.push(...zerosArray);
        },
        changeAmplitude(value) {
            this.amplitudeValue = value;
        }
    },
    /**
     *
     */
    created() {
        const FFT = require('fft.js');
        this.fft = new FFT(this.fftSize);
        this.padArray(this.gauss);
        this.padArray(this.square);
    },
    computed: {
        /**
         * Returns number of components to display
         * @returns {number}
         */
        components() {
            return this.$store.state.harmonics.components;
        },
        /**
         * Returns
         * @returns {string}
         */
        selected() {
            return this.$store.state.spectrum.selected;
        },
        amplitude() {
            return this.amplitudeValue;
        },
        /**
         * Returns number of components to display
         * @returns {number[]}
         */
        input() {
            if (this.selected === 'gauss') {
                return this.gauss;
            }
            if (this.selected === 'square') {
                return this.square;
            }
            return [...Array(this.fftSize).keys()].map(el => this.methods[this.selected](el));
        },
        /**
         * Returns number of components to display
         * @returns {number[]}
         */
        output() {
            const out = this.fft.createComplexArray();
            this.fft.realTransform(out, this.input);
            return out.filter((el, index) => index % 2 === 1);
        }
    },
}
</script>




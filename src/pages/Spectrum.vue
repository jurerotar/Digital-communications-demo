<template>
    <div class="lg:ml-72">
        <main class="p-4 container lg:mx-auto transition-colors duration-300 dark:bg-gray-800">
            <h1 class="text-3xl font-medium mb-4 transition-colors duration-300 dark:text-white">Spekter</h1>
            <collapsible>
                <theory-spectrum></theory-spectrum>
            </collapsible>
            <h2 class="font-semibold text-xl mb-2 transition-colors duration-300 dark:text-white">Oblika</h2>
            <button-container>
                <styled-button
                    :class="[selectedObject.key === shape.key ? 'dark:bg-blue-500 bg-blue-500': '']"
                    @click="changeSelected(shape.key)"
                    v-for="shape in signalShapes" :key="shape.key">
                    {{ shape.label }}
                </styled-button>
            </button-container>
            <h2 class="font-semibold text-xl mb-2 transition-colors duration-300 dark:text-white">Število period</h2>
            <button-container>
                <styled-button
                    class="text-white w-fit-content font-bold py-2 px-4 mb-2 mr-2 rounded outline-none duration-300 transition-colors h-12"
                    :class="[period === periodObject.key ? 'dark:bg-blue-500 bg-blue-500': '']"
                    @click="changePeriod(periodObject.key)"
                    v-for="periodObject in periods" :key="periodObject.key">
                    {{ periodObject.label }}
                </styled-button>
            </button-container>
            <full-signal
                :canvas_id="'spectrum-original-signal'"
                :data="canvasInput"
                :title="'Signal'"
                :vertical_pool="[1, 0.5, -0.5, -1]"
                :horizontal_pool="selectedObject.horizontal_pool"
                :type = "selectedObject.key"
            >
            </full-signal>
            <spectrum-canvas
                :canvas_id="'spectrum-signal-spectrum'"
                :data="output"
                :title="'Spekter'"
                :type="selectedObject.key"
                :period="period"
                :description="selectedObject.spectrumGraphTexts.description"
                :note="selectedObject.spectrumGraphTexts.note"
            >
            </spectrum-canvas>
            <logarithmic
                :canvas_id="'spectrum-signal-logarithmic'"
                :data="output"
                :title="'Spekter [dB]'"
                :type="selectedObject.key"
                :period="period"
                :description="selectedObject.logarithmGraphTexts.description"
                :note="selectedObject.logarithmGraphTexts.note"
            >
            </logarithmic>
        </main>
    </div>
</template>

<script>
import TheorySpectrum from "@/components/theory/TheorySpectrum";
import Collapsible from "@/components/global/Collapsible";
import SpectrumCanvas from "@/components/canvas/Spectrum";
import FullSignal from "@/components/canvas/FullSignal";
import Logarithmic from "@/components/canvas/Logarithmic";
import '@/types.js';
import ButtonContainer from "@/components/global/ButtonContainer";
import StyledButton from "@/components/global/StyledButton";

export default {
    name: "Spectrum",
    components: {StyledButton, ButtonContainer, FullSignal, Collapsible, TheorySpectrum, SpectrumCanvas, Logarithmic},
    data() {
        return {
            selected: 'cos',
            fftSize: 2 ** 11,
            fft: null,
            period: 1,
            samplingFrequency: 16.66664,
            /** @type {Array<Signal>} */
            signalShapes: [
                {
                    label: 'Kosinusni',
                    key: 'cos',
                    drawingValues: () => this.createEmptyArrayOfFFTSize().map(t => (-Math.cos(Math.PI * t * this.frequency * 0.01) - 1) * this.unitBox(t * this.frequency * 0.01 / 2)),
                    spectrumValues: () => this.createEmptyArrayOfFFTSize().map(t => (-Math.cos(Math.PI * t * this.frequency * 0.05) - 1) * this.unitBox(t * this.frequency * 0.05 / 2)),
                    horizontal_pool: [-3, -2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3],
                    periods: [
                        {label: '1/4', key: 0.25},
                        {label: '1/2', key: 0.5},
                        {label: '1', key: 1},
                        {label: '2', key: 2},
                        {label: '3', key: 3},
                    ],
                    spectrumGraphTexts: {
                        description: '',
                        note: '',
                    },
                    logarithmGraphTexts: {
                        description: '',
                        note: 'Vrednosti grafa v točkah, kjer je vrednost spektra enaka 0 (glej zgornji graf), bi morale biti -∞, vendar, ker za izračun FFT uporabljamo zgolj 2048 vrednosti, je prikaz nekoliko netočen.',
                    }
                },
                {
                    label: 'Kvadratni',
                    key: 'square',
                    drawingValues: () => this.createEmptyArrayOfFFTSize().map(t => -this.unitBox(t * this.frequency * 0.01)),
                    spectrumValues: () => this.createEmptyArrayOfFFTSize().map(t => -this.unitBox(t * this.frequency * 0.05)),
                    spectrumGraphTexts: {
                        description: '',
                        note: '',
                    },
                    logarithmGraphTexts: {
                        description: '',
                        note: 'Vrednosti grafa v točkah, kjer je vrednost spektra enaka 0 (glej zgornji graf), bi morale biti -∞, vendar, ker za izračun FFT uporabljamo zgolj 2048 vrednosti, je prikaz nekoliko netočen.',
                    }
                },
                {
                    label: 'Gauss',
                    key: 'gauss',
                    drawingValues: () => this.createEmptyArrayOfFFTSize().map(t => Math.E ** (-2 * (t * 0.0165 * this.frequency) ** 2) * -this.unitBox(t * this.frequency * 0.0005)),
                    spectrumValues: () => this.createEmptyArrayOfFFTSize().map(t => Math.E ** (-2 * (t * 0.042 * this.frequency) ** 2) * -this.unitBox(t * this.frequency * 0.0005)),
                    periods: [
                        {label: '1/4', key: 0.25},
                        {label: '1/2', key: 0.5},
                        {label: '1', key: 1},
                        {label: '2', key: 2},
                        {label: '3', key: 3},
                    ],
                    spectrumGraphTexts: {
                        description: '',
                        note: '',
                    },
                    logarithmGraphTexts: {
                        description: '',
                        note: 'Vrednosti grafa v točkah, kjer je vrednost spektra enaka 0 (glej zgornji graf), bi morale biti -∞, vendar, ker za izračun FFT uporabljamo zgolj 2048 vrednosti, je prikaz nekoliko netočen.',
                    }
                },
                {
                    label: 'Sinc',
                    key: 'sinc',
                    drawingValues: () => this.createEmptyArrayOfFFTSize().map(t => (t === 0) ? -1 : -Math.sin(t * this.frequency * 0.062) / (t * this.frequency * 0.062) * this.unitBox(t * this.frequency * 0.0033)),
                    spectrumValues: () => this.createEmptyArrayOfFFTSize().map(t => (t === 0) ? -1 : -Math.sin(t * this.frequency * 0.152) / (t * this.frequency * 0.152) * this.unitBox(t * this.frequency * 0.008)),
                    spectrumGraphTexts: {
                        description: '',
                        note: '',
                    },
                    logarithmGraphTexts: {
                        description: '',
                        note: 'Vrednosti grafa v točkah, kjer je vrednost spektra enaka 0 (glej zgornji graf), bi morale biti -∞, vendar, ker za izračun FFT uporabljamo zgolj 2048 vrednosti, je prikaz nekoliko netočen.',
                    }
                },
            ],
        }
    },
    methods: {
        createEmptyArrayOfFFTSize() {
            return [...[...Array(this.fftSize / 2).keys()].map(el => el * -1 - 1).reverse(), ...Array(this.fftSize / 2).keys()];
        },
        /**
         * Sets spectrum type in the store
         * @param key {string} - possible values: sin, cos, gauss, square
         */
        changeSelected(key) {
            this.period = 1;
            this.selected = key;
        },
        /**
         * Updates period property with currently selected value
         * @param {number} period
         */
        changePeriod(period) {
            this.period = period;
        },
        unitBox(n) {
            return Math.abs(n) <= 1/2 ? 1 : 0;
        },

        /**
         * @param {number[]} array
         * @returns {number[]}
         **/
        cutArray(array) {
            return array.filter((el, index) => (index >= (array.length / 2 - 300) && index <= (array.length / 2 + 300)));
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
        periods() {
            return ('periods' in this.selectedObject) ? this.selectedObject.periods :
                [
                    {label: '1/4', key: 0.25},
                    {label: '1/2', key: 0.5},
                    {label: '1', key: 1},
                    {label: '2', key: 2},
                    {label: '4', key: 4},
                ];
        },
        frequency() {
            return this.period ** -1;
        },
        /**
         * Since fft.size used in fft calculation does not fit on the canvas, we remove excess numbers
         * of input array and return array of size 512
         * @returns {number[]}
         */
        canvasInput() {
            return this.cutArray(this.selectedObject.drawingValues());
        },
        /**
         * Returns an array of FFT transformed numbers. Because fft.realTransform returns Complex array,
         * we filter the array to return only each even number
         * @returns {number[]}
         */
        output() {
            const out = this.fft.createComplexArray();
            this.fft.realTransform(out, this.selectedObject.spectrumValues());
            return out.filter((el, index) => index % 2 === 0).map(el => Math.abs(el));
        },
    },
}
</script>




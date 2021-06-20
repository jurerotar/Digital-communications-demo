<template>
    <div class="lg:ml-72">
        <main class="p-4 container lg:mx-auto transition-colors duration-300 dark:bg-gray-800">
            <h1 class="text-3xl font-medium mb-4 transition-colors duration-300 dark:text-white">Spekter</h1>
            <collapsible>
                <theory-spectrum></theory-spectrum>
            </collapsible>
            <h2 class="font-semibold text-xl mb-2 transition-colors duration-300 dark:text-white">Oblika impulza</h2>
            <button-container>
                <styled-button
                    :class="{'dark:bg-blue-500 bg-blue-500': pulse.key === shape.key}"
                    @click="changePulse(shape.key)"
                    v-for="shape in pulseShapes" :key="shape.key">
                    {{ shape.label }}
                </styled-button>
            </button-container>
            <h2 class="font-semibold text-xl mb-2 transition-colors duration-300 dark:text-white">Dolžina impulza (T)</h2>
            <button-container>
                <styled-button
                    :class="{'dark:bg-blue-500 bg-blue-500': pulseLength === length.key}"
                    @click="changePulseLength(length.key)"
                    v-for="length in pulseLengths" :key="length.key">
                    {{ length.label }}
                </styled-button>
            </button-container>
            <full-signal
                :canvas_id="'spectrum-original-signal'"
                :data="canvasInput"
                :title="'Impulz'"
                :vertical_pool="[1, 0.5, -0.5, -1]"
                :horizontal_pool="pulse.horizontal_pool"
                :type = "pulse.key"
            >
            </full-signal>
            <spectrum-canvas
                :canvas_id="'spectrum-signal-spectrum'"
                :data="output"
                :title="'Spekter'"
                :type="pulse.key"
                :pulseLength="pulseLength"
                :description="pulse.spectrumGraphTexts.description"
                :note="pulse.spectrumGraphTexts.note"
            >
            </spectrum-canvas>
            <logarithmic
                :canvas_id="'spectrum-signal-logarithmic'"
                :data="output"
                :title="'Spekter [dB]'"
                :type="pulse.key"
                :pulseLength="pulseLength"
                :description="pulse.logarithmGraphTexts.description"
                :note="pulse.logarithmGraphTexts.note"
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
import ButtonContainer from "@/components/global/ButtonContainer";
import StyledButton from "@/components/global/StyledButton";
import '@/types.js';

export default {
    name: "Spectrum",
    components: {StyledButton, ButtonContainer, FullSignal, Collapsible, TheorySpectrum, SpectrumCanvas, Logarithmic},
    data() {
        return {
            pulseShape: 'cos',
            fftSize: 2 ** 11,
            emptyArray: null,
            fft: null,
            pulseLength: 1,
            /** @type {Array<Pulse>} */
            pulseShapes: [
                {
                    label: 'Kosinusni',
                    key: 'cos',
                    drawingValues: () => this.emptyArray.map(t => (-Math.cos(Math.PI * t * this.frequency * 0.01) - 1) * this.unitBox(t * this.frequency * 0.01 / 2)),
                    spectrumValues: () => this.emptyArray.map(t => (-Math.cos(Math.PI * t * this.frequency * 0.05) - 1) * this.unitBox(t * this.frequency * 0.05 / 2)),
                    horizontal_pool: [-3, -2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3],
                    pulseLengths: [
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
                    drawingValues: () => this.emptyArray.map(t => -this.unitBox(t * this.frequency * 0.01)),
                    spectrumValues: () => this.emptyArray.map(t => -this.unitBox(t * this.frequency * 0.05)),
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
                    drawingValues: () => this.emptyArray.map(t => Math.E ** (-2 * (t * 0.0165 * this.frequency) ** 2) * -this.unitBox(t * this.frequency * 0.0005)),
                    spectrumValues: () => this.emptyArray.map(t => Math.E ** (-2 * (t * 0.042 * this.frequency) ** 2) * -this.unitBox(t * this.frequency * 0.0005)),
                    pulseLengths: [
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
                    drawingValues: () => this.emptyArray.map(t => (t === 0) ? -1 : -Math.sin(t * this.frequency * 0.062) / (t * this.frequency * 0.062) * this.unitBox(t * this.frequency * 0.0033)),
                    spectrumValues: () => this.emptyArray.map(t => (t === 0) ? -1 : -Math.sin(t * this.frequency * 0.152) / (t * this.frequency * 0.152) * this.unitBox(t * this.frequency * 0.008)),
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
        /**
         * Set pulse type
         * @param key {string} - possible values: cos, gauss, square, sinc
         */
        changePulse(key) {
            this.pulseLength = 1;
            this.pulseShape = key;
        },
        /**
         * Updates pulseLength property with currently selected value
         * @param {number} pulseLength
         */
        changePulseLength(pulseLength) {
            this.pulseLength = pulseLength;
        },
        /**
         * Returns 1 if value of n is between [-0.5, 0.5] or 0 if not
         * @param {number} n
         */
        unitBox(n) {
            return Math.abs(n) <= 1/2 ? 1 : 0;
        },

        /**
         * Returns an array with only $size values around the middle
         * @param {number[]} array
         * @returns {number[]}
         **/
        cutArray(array) {
            const size = 600;
            return array.filter((el, index) => (index >= (array.length / 2 - size / 2) && index <= (array.length / 2 + size / 2)));
        }

    },
    created() {
        const FFT = require('fft.js');
        this.fft = new FFT(this.fftSize);
        this.emptyArray = [...[...Array(this.fftSize / 2).keys()].map(el => el * -1 - 1).reverse(), ...Array(this.fftSize / 2).keys()];
    },
    computed: {
        /**
         * Returns currently selected pulse shape object
         * @returns {Pulse}
         */
        pulse() {
            return this.pulseShapes.find(el => el.key === this.pulseShape);
        },
        /**
         * @returns {Array<pulseLengths>}
         */
        pulseLengths() {
            return ('pulseLengths' in this.pulse) ? this.pulse.pulseLengths :
                [{label: '1/4', key: 0.25}, {label: '1/2', key: 0.5}, {label: '1', key: 1}, {label: '2', key: 2}, {label: '4', key: 4}];
        },
        frequency() {
            return this.pulseLength ** -1;
        },
        /**
         * Since fft.size used in fft calculation does not fit on the canvas, we remove excess numbers
         * of input array and return array of size fft size / 2
         * @returns {number[]}
         */
        canvasInput() {
            return this.cutArray(this.pulse.drawingValues());
        },
        /**
         * Returns an array of FFT transformed numbers. Because fft.realTransform returns Complex array,
         * we filter the array to return only absolute value of each even number
         * @returns {number[]}
         */
        output() {
            const out = this.fft.createComplexArray();
            this.fft.realTransform(out, this.pulse.spectrumValues());
            return out.filter((el, index) => index % 2 === 0).map(el => Math.abs(el));
        },
    },
}
</script>




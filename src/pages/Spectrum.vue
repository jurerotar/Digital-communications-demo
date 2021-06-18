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
            <h2 class="font-semibold text-xl mb-2 transition-colors duration-300 dark:text-white">T</h2>
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
            selected: 'sin',
            fftSize: 2 ** 11,
            fft: null,
            period: 1,
            samplingFrequency: 16.66664,
            /** @type {Array<Signal>} */
            signalShapes: [
                {
                    label: 'Sinusni',
                    key: 'sin',
                    fn: () => this.createEmptyArrayOfFFTSize().map((n) => -Math.sin(2 * Math.PI * n * this.frequency / this.samplingFrequency)),
                    horizontal_pool: [-18, -15, -12, -9, -6, -3, 0, 3, 6, 9, 12, 15, 18],
                    spectrumGraphTexts: {
                        description: 'Vrednost grafa v točkah, ki niso 1, je enak 0, ker je signal neskončno dolg. Če signal ne bi bil neskončno dolg, bi prehod bil zvezen.',
                        note: 'Prikazan je spekter signala omejenega na intervalu od [0 do 2^11 / 16.667]. Vzorčna frekvenca torej znaša 16.667 Hz.',
                    },
                    logarithmGraphTexts: {
                        description: '',
                        note: 'Vrednosti grafa v točkah, ki niso 1, bi morale biti -∞, če bi dejansko imeli neskončno dolg signal. Vendar, ker za izračun uporabljamo zgolj 2^11 vrednosti, opazimo prehod.',
                    }
                },
                {
                    label: 'Kosinusni',
                    key: 'cos',
                    fn: () => this.createEmptyArrayOfFFTSize().map((n) => -Math.cos(2 * Math.PI * n * this.frequency / this.samplingFrequency)),
                    horizontal_pool: [-18, -15, -12, -9, -6, -3, 0, 3, 6, 9, 12, 15, 18],
                    spectrumGraphTexts: {
                        description: 'Vrednost grafa v točkah, ki niso 1, je enak 0, ker je signal neskončno dolg. Če signal ne bi bil neskončno dolg, bi prehod bil zvezen.',
                        note: 'Prikazan je spekter signala omejenega na intervalu od [0 do 2^11 / 16.667]. Vzorčna frekvenca torej znaša 16.667 Hz.',
                    },
                    logarithmGraphTexts: {
                        description: '',
                        note: 'Vrednosti grafa v točkah, ki niso 1, bi morale biti -∞, če bi dejansko imeli neskončno dolg signal. Vendar, ker za izračun uporabljamo zgolj 2^11 vrednosti, opazimo prehod.',
                    }
                },
                {
                    label: 'Kvadratni',
                    key: 'square',
                    fn: () => Array(Math.trunc(41 * this.period)).fill(-1),
                    spectrumGraphTexts: {
                        description: '',
                        note: '',
                    },
                    logarithmGraphTexts: {
                        description: '',
                        note: '',
                    }
                },
                {
                    label: 'Gauss',
                    key: 'gauss',
                    fn: () => {
                        const gauss = [0.0001, 0.0001, 0.0001, 0.0001, 0.0001, 0.0002, 0.0002, 0.0002, 0.0003, 0.0004, 0.0004, 0.0005, 0.0006, 0.0007, 0.0009, 0.0010, 0.0012, 0.0015, 0.0017, 0.0020, 0.0024, 0.0028, 0.0033, 0.0038, 0.0044, 0.0051, 0.0060, 0.0069, 0.0079, 0.0091, 0.0104, 0.0119, 0.0136, 0.0154, 0.0175, 0.0198, 0.0224, 0.0252, 0.0283, 0.0317, 0.0355, 0.0396, 0.0440, 0.0488, 0.0540, 0.0596, 0.0656, 0.0721, 0.0790, 0.0863, 0.0940, 0.1023, 0.1109, 0.1200, 0.1295, 0.1394, 0.1497, 0.1604, 0.1714, 0.1826, 0.1942, 0.2059, 0.2179, 0.2299, 0.2420, 0.2541, 0.2661, 0.2780, 0.2897, 0.3011, 0.3123, 0.3230, 0.3332, 0.3429, 0.3521, 0.3605, 0.3683, 0.3752, 0.3814, 0.3867, 0.3910, 0.3945, 0.3970, 0.3984, 0.3989, 0.3989, 0.3984, 0.3970, 0.3945, 0.3910, 0.3867, 0.3814, 0.3752, 0.3683, 0.3605, 0.3521, 0.3429, 0.3332, 0.3230, 0.3123, 0.3011, 0.2897, 0.2780, 0.2661, 0.2541, 0.2420, 0.2299, 0.2179, 0.2059, 0.1942, 0.1826, 0.1714, 0.1604, 0.1497, 0.1394, 0.1295, 0.1200, 0.1109, 0.1023, 0.0940, 0.0863, 0.0790, 0.0721, 0.0656, 0.0596, 0.0540, 0.0488, 0.0440, 0.0396, 0.0355, 0.0317, 0.0283, 0.0252, 0.0224, 0.0198, 0.0175, 0.0154, 0.0136, 0.0119, 0.0104, 0.0091, 0.0079, 0.0069, 0.0060, 0.0051, 0.0044, 0.0038, 0.0033, 0.0028, 0.0024, 0.0020, 0.0017, 0.0015, 0.0012, 0.0010, 0.0009, 0.0007, 0.0006, 0.0005, 0.0004, 0.0004, 0.0003, 0.0002, 0.0002, 0.0002, 0.0001, 0.0001, 0.0001, 0.0001, 0.0001].map((el) => -el * 3);
                        if (this.period > 1) {
                            return gauss.map(el => Array(Math.trunc(this.period)).fill(el)).flat();
                        }
                        if (this.period < 1) {
                            return [...gauss.filter((el, index) => index % Math.trunc(this.frequency) === 0)];
                        }
                        return gauss;
                    },
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
                        note: '',
                    }
                },
                {
                    label: 'Sinc',
                    key: 'sinc',
                    fn: () => this.createEmptyArrayOfFFTSize().map(t => (t === 0) ? -1 : -Math.sin(t * this.frequency * 0.062) / (t * this.frequency * 0.062)),
                    spectrumGraphTexts: {
                        description: '',
                        note: '',
                    },
                    logarithmGraphTexts: {
                        description: '',
                        note: '',
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
         * Pads the array with zeros to match fft.size if array length is smaller than fft.size
         * @returns {number[]}
         */
        padArray(array) {
            if (array.length === this.fftSize) {
                return array;
            }
            const padSize = (this.fftSize - array.length) / 2;
            const zerosArray = [...Array(Math.trunc(padSize)).keys()].fill(0);
            array.unshift(...zerosArray);
            array.push(...zerosArray);
            if (array.length % 2 === 1) {
                array.push(0);
            }
            return array;
        },
        /**
         * Updates period property with currently selected value
         * @param {number} period
         */
        changePeriod(period) {
            this.period = period;
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
            for (let i = 0; i < out.length; i += 2) {
                absoluteSpectrumValues.push(Math.sqrt(out[i] ** 2 + out[i + 1] ** 2));
            }
            return absoluteSpectrumValues;
        },
    },
}
</script>




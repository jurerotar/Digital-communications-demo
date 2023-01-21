<template>
  <app-main-container>
    <app-main-heading>
      Spekter
    </app-main-heading>
    <app-collapsible>
      <theory-spectrum />
    </app-collapsible>
    <app-section-heading>
      Oblika impulza
    </app-section-heading>
    <button-container>
      <app-button
        v-for="shape in pulses"
        :key="shape.key"
        :active="pulse.key === shape.key"
        @click="setPulseShape(shape.key)"
      >
        {{ shape.label }}
      </app-button>
    </button-container>
    <app-section-heading>
      Dolžina impulza
    </app-section-heading>
    <button-container>
      <app-button
        v-for="length in pulse.pulseLengths"
        :key="length.key"
        :active="pulseLength === length.key"
        @click="setPulseLength(length.key)"
      >
        {{ length.label }}
      </app-button>
    </button-container>
    <full-signal
      :canvas-id="'spectrum-original-signal'"
      :data="baseSignal"
      :title="'Impulz'"
      :vertical-pool="[1, 0.5, -0.5, -1]"
      :horizontal-pool="pulse.horizontalPool"
      :type="pulse.key"
    />
    <spectrum-canvas
      :canvas-id="'spectrum-signal-spectrum'"
      :data="transformedSignal"
      :title="'Spekter'"
      :type="pulse.key"
      :pulse-length="pulseLength"
      :description="pulse?.spectrumGraphTexts?.description"
      :note="pulse?.spectrumGraphTexts?.note"
    />
    <logarithmic
      :canvas-id="'spectrum-signal-logarithmic'"
      :data="transformedSignal"
      :title="'Spekter [dB]'"
      :type="pulse.key"
      :pulse-length="pulseLength"
      :description="pulse?.logarithmGraphTexts?.description"
      :note="pulse?.logarithmGraphTexts?.note"
    />
  </app-main-container>
</template>

<script
  setup
  lang="ts"
>
import TheorySpectrum from "@/js/components/theory/TheorySpectrum.vue";
import SpectrumCanvas from "@/js/components/canvas/Spectrum.vue";
import FullSignal from "@/js/components/canvas/FullSignal.vue";
import Logarithmic from "@/js/components/canvas/Logarithmic.vue";
import ButtonContainer from "@/js/components/common/buttons/AppButtonContainer.vue";
import AppButton from "@/js/components/common/buttons/AppButton.vue";
import AppMainHeading from "@/js/components/common/AppMainHeading.vue";
import AppCollapsible from "@/js/components/common/AppCollapsible.vue";
import FFT from "fft.js";
import {computed, ref} from "vue";
import AppSectionHeading from "@/js/components/common/AppSectionHeading.vue";
import AppMainContainer from "@/js/components/common/AppMainContainer.vue";

export interface Pulse {
  key: PulseShape;
  // Button label
  label: string;
  // Original pulse values (displayed on upper chart)
  drawingValues: (frequency: number) => number[];
  // Transformed values (displayed on lower chart)
  spectrumValues: (frequency: number) => number[];
  // Pool of numbers to use on the chart
  horizontalPool?: number[],
  // Custom pool lengths, since some charts look clunky with defaults
  pulseLengths: PulseLengthOption[];
  // Additional texts displayed along spectrum chart
  spectrumGraphTexts?: PulseGraphText;
  // Additional texts displayed along logarithmic chart
  logarithmGraphTexts?: PulseGraphText;
}

interface PulseGraphText {
  description?: string;
  note?: string;
}

interface PulseLengthOption {
  label: string;
  key: PulseLength;
}

type PulseShape = 'cos' | 'sinc' | 'gauss' | 'square';
type PulseLength = 0.25 | 0.5 | 1 | 2 | 3 | 4;

// Amount of values used for FFT
const fftSize: number = 2 ** 11;

const fft: FFT = new FFT(fftSize);

// We create an array of time values from [-2**11 / 2, 2**11 / 2] on which we'll apply our fft
const baseValues: number[] = [...[...Array(fftSize / 2).keys()].map(el => el * -1 - 1).reverse(), ...Array(fftSize / 2).keys()];

// Default pulse length options we give to the users
const defaultPulseLengthOptions: PulseLengthOption[] = [
  {label: '1/4', key: 0.25},
  {label: '1/2', key: 0.5},
  {label: '1', key: 1},
  {label: '2', key: 2},
  {label: '4', key: 4},
];

const pulses: Pulse[] = [
  {
    label: 'Kosinusni',
    key: 'cos',
    drawingValues: (frequency: number): number[] => baseValues.map((t: number) => {
      return (-Math.cos(Math.PI * t * frequency * 0.01) - 1) * Math.unitBox(t * frequency * 0.01 / 2, [-0.5, 0.5]);
    }),
    spectrumValues: (frequency: number): number[] => baseValues.map((t: number) => {
      return (-Math.cos(Math.PI * t * frequency * 0.05) - 1) * Math.unitBox(t * frequency * 0.05 / 2, [-0.5, 0.5]);
    }),
    horizontalPool: [-3, -2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3],
    // Remove length of 4, add length of 3
    pulseLengths: defaultPulseLengthOptions
      .filter((pulseLength: PulseLengthOption) => pulseLength.key !== 4)
      .concat([{label: '3', key: 3}]),
    logarithmGraphTexts: {
      note: `Vrednosti grafa v točkah, kjer je vrednost spektra enaka 0 (glej zgornji graf), bi morale biti -∞, vendar,
      ker za izračun FFT uporabljamo zgolj 2048 vrednosti, je prikaz nekoliko netočen.`,
    }
  },
  {
    label: 'Kvadratni',
    key: 'square',
    drawingValues: (frequency: number): number[] => baseValues.map((t: number) => {
      return -Math.unitBox(t * frequency * 0.01, [-0.5, 0.5]);
    }),
    spectrumValues: (frequency: number): number[] => baseValues.map((t: number) => {
      return -Math.unitBox(t * frequency * 0.05, [-0.5, 0.5]);
    }),
    pulseLengths: defaultPulseLengthOptions,
    logarithmGraphTexts: {
      note: `Vrednosti grafa v točkah, kjer je vrednost spektra enaka 0 (glej zgornji graf), bi morale biti -∞, vendar,
      ker za izračun FFT uporabljamo zgolj 2048 vrednosti, je prikaz nekoliko netočen.`,
    }
  },
  {
    label: 'Gauss',
    key: 'gauss',
    drawingValues: (frequency: number): number[] => baseValues.map((t: number) => {
      return Math.E ** (-2 * (t * 0.0165 * frequency) ** 2) * -Math.unitBox(t * frequency * 0.0005, [-0.5, 0.5]);
    }),
    spectrumValues: (frequency: number): number[] => baseValues.map((t: number) => {
      return Math.E ** (-2 * (t * 0.028 * frequency) ** 2) * -Math.unitBox(t * frequency * 0.0005, [-0.5, 0.5]);
    }),
    // Remove length of 4, add length of 3
    pulseLengths: defaultPulseLengthOptions
      .filter((pulseLength: PulseLengthOption) => pulseLength.key !== 4)
      .concat([{label: '3', key: 3}]),
    logarithmGraphTexts: {
      note: `Vrednosti grafa v točkah, kjer je vrednost spektra enaka 0 (glej zgornji graf), bi morale biti -∞, vendar,
      ker za izračun FFT uporabljamo zgolj 2048 vrednosti, je prikaz nekoliko netočen.`,
    }
  },
  {
    label: 'Sinc',
    key: 'sinc',
    drawingValues: (frequency: number): number[] => baseValues.map((t: number) => {
      return t === 0 ? -1 : -Math.sin(t * frequency * 0.062) / (t * frequency * 0.062) * Math.unitBox(t * frequency * 0.0033, [-0.5, 0.5]);
    }),
    spectrumValues: (frequency: number): number[] => baseValues.map((t: number) => {
      return t === 0 ? -1 : -Math.sin(t * frequency * 0.152) / (t * frequency * 0.152) * Math.unitBox(t * frequency * 0.008, [-0.5, 0.5]);
    }),
    pulseLengths: defaultPulseLengthOptions,
    logarithmGraphTexts: {
      note: `Vrednosti grafa v točkah, kjer je vrednost spektra enaka 0 (glej zgornji graf), bi morale biti -∞, vendar,
      ker za izračun FFT uporabljamo zgolj 2048 vrednosti, je prikaz nekoliko netočen.`,
    }
  },
];

// User selected pulse length
const pulseLength = ref<PulseLength>(1);
const setPulseLength = (length: PulseLength): void => {
  pulseLength.value = length;
}
const frequency = computed<number>(() => pulseLength.value ** -1);

// User selected pulse shape
const pulseShape = ref<PulseShape>('cos');
const setPulseShape = (shape: PulseShape): void => {
  // Reset length to 1, since some lengths might be missing on certain shapes
  setPulseLength(1);
  pulseShape.value = shape;
}

// Pulse object determined by user selection
const pulse = computed<Pulse>(() => pulses.find((pulse: Pulse) => pulse.key === pulseShape.value)!);

const baseSignal = computed<number[]>(() => takeMiddleValues(pulse.value.drawingValues(frequency.value)));

const transformedSignal = computed<number[]>(() => {
  const out: number[] = fft.createComplexArray();
  fft.realTransform(out, pulse.value.spectrumValues(frequency.value));
  return out.filter((el: number, index: number) => index % 2 === 0).map((el: number) => Math.abs(el));
});

// Returns an array with only $size values around the middle
const takeMiddleValues = (values: number[]): number[] =>  {
  const size = 600;
  return values.filter((el: number, index: number) => (index >= (values.length / 2 - size / 2) && index <= (values.length / 2 + size / 2)));
}
</script>




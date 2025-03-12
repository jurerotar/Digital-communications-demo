<template>
  <AppMainContainer>
    <AppMainHeading>Spekter</AppMainHeading>
    <AppCollapsible>
      <SpectrumTheory />
    </AppCollapsible>
    <AppSectionHeading>Oblika impulza</AppSectionHeading>
    <ButtonContainer>
      <AppButton
        v-for="shape in pulses"
        :key="shape.key"
        :active="pulse.key === shape.key"
        @click="setPulseShape(shape.key)"
      >
        {{ shape.label }}
      </AppButton>
    </ButtonContainer>
    <AppSectionHeading>Dolžina impulza</AppSectionHeading>
    <ButtonContainer>
      <AppButton
        v-for="length in pulse.pulseLengths"
        :key="length.key"
        :active="pulseLength === length.key"
        @click="setPulseLength(length.key)"
      >
        {{ length.label }}
      </AppButton>
    </ButtonContainer>
    <FullSignalGraph
      :canvas-id="'spectrum-original-signal'"
      :data="shapedSignal"
      :title="'Impulz'"
      :vertical-pool="[1, 0.5, -0.5, -1]"
      :horizontal-pool="pulse.horizontalPool"
      :type="pulse.key"
    />
    <SpectrumGraph
      :canvas-id="'spectrum-signal-spectrum'"
      :data="transformedSignal"
      :title="'Spekter'"
      :type="pulse.key"
      :pulse-length="pulseLength"
      :description="pulse?.spectrumGraphTexts?.description"
      :note="pulse?.spectrumGraphTexts?.note"
    />
    <LogarithmicGraph
      :canvas-id="'spectrum-signal-logarithmicGraph'"
      :data="transformedSignal"
      :title="'Spekter [dB]'"
      :type="pulse.key"
      :pulse-length="pulseLength"
      :description="pulse?.logarithmGraphTexts?.description"
      :note="pulse?.logarithmGraphTexts?.note"
    />
  </AppMainContainer>
</template>

<script setup lang="ts">
import FullSignalGraph from '@components/canvas/FullSignalGraph.vue';
import LogarithmicGraph from '@components/canvas/LogarithmicGraph.vue';
import ButtonContainer from '@components/common/buttons/AppButtonContainer.vue';
import AppButton from '@components/common/buttons/AppButton.vue';
import AppMainHeading from '@components/common/AppMainHeading.vue';
import AppCollapsible from '@components/common/AppCollapsible.vue';
import { computed, ref } from 'vue';
import AppSectionHeading from '@components/common/AppSectionHeading.vue';
import AppMainContainer from '@components/common/AppMainContainer.vue';
import { PulseLength, PulseShape } from '@interfaces/spectrum';
import { useShapedSignal } from '@composables/use-shaped-signal';
import { useFft } from '@composables/use-fft';
import SpectrumTheory from './components/SpectrumTheory.vue';
import SpectrumGraph from './components/SpectrumGraph.vue';

export interface Pulse {
  key: PulseShape;
  // Button label
  label: string;
  // Pool of numbers to use on the chart
  horizontalPool?: number[];
  // Custom pool lengths, since some charts look clunky with defaults
  pulseLengths: PulseLengthOption[];
  // Additional texts displayed along spectrum chart
  spectrumGraphTexts?: PulseGraphText;
  // Additional texts displayed along logarithmicGraph chart
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

// Default pulse length options we give to the users
const defaultPulseLengthOptions: PulseLengthOption[] = [
  { label: '1/4', key: 0.25 },
  { label: '1/2', key: 0.5 },
  { label: '1', key: 1 },
  { label: '2', key: 2 },
  { label: '4', key: 4 },
];

const pulses: Pulse[] = [
  {
    label: 'Kosinusni',
    key: 'cos',
    horizontalPool: [-3, -2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3],
    // Remove length of 4, add length of 3
    pulseLengths: defaultPulseLengthOptions
      .filter((pulseLength: PulseLengthOption) => pulseLength.key !== 4)
      .concat([{ label: '3', key: 3 }]),
    logarithmGraphTexts: {
      note: `Vrednosti grafa v točkah, kjer je vrednost spektra enaka 0 (glej zgornji graf), bi morale biti -∞, vendar,
      ker za izračun FFT uporabljamo zgolj 2048 vrednosti, je prikaz nekoliko netočen.`,
    },
  },
  {
    label: 'Kvadratni',
    key: 'square',
    pulseLengths: defaultPulseLengthOptions,
    logarithmGraphTexts: {
      note: `Vrednosti grafa v točkah, kjer je vrednost spektra enaka 0 (glej zgornji graf), bi morale biti -∞, vendar,
      ker za izračun FFT uporabljamo zgolj 2048 vrednosti, je prikaz nekoliko netočen.`,
    },
  },
  {
    label: 'Gauss',
    key: 'gauss',
    // Remove length of 4, add length of 3
    pulseLengths: defaultPulseLengthOptions
      .filter((pulseLength: PulseLengthOption) => pulseLength.key !== 4)
      .concat([{ label: '3', key: 3 }]),
    logarithmGraphTexts: {
      note: `Vrednosti grafa v točkah, kjer je vrednost spektra enaka 0 (glej zgornji graf), bi morale biti -∞, vendar,
      ker za izračun FFT uporabljamo zgolj 2048 vrednosti, je prikaz nekoliko netočen.`,
    },
  },
  {
    label: 'Sinc',
    key: 'sinc',
    pulseLengths: defaultPulseLengthOptions,
    logarithmGraphTexts: {
      note: `Vrednosti grafa v točkah, kjer je vrednost spektra enaka 0 (glej zgornji graf), bi morale biti -∞, vendar,
      ker za izračun FFT uporabljamo zgolj 2048 vrednosti, je prikaz nekoliko netočen.`,
    },
  },
];

// User selected pulse length
const pulseLength = ref<PulseLength>(1);

const setPulseLength = (length: PulseLength): void => {
  pulseLength.value = length;
};

// User selected pulse shape
const pulseShape = ref<PulseShape>('cos');

const setPulseShape = (shape: PulseShape): void => {
  // Reset length to 1, since some lengths might be missing on certain shapes
  setPulseLength(1);
  pulseShape.value = shape;
};

const frequency = computed<number>(() => pulseLength.value ** -1);

// Pulse object determined by user selection
const pulse = computed<Pulse>(() => pulses.find((pulse: Pulse) => pulse.key === pulseShape.value)!);

const { shapedSignal, shapedSpectrumSignal } = useShapedSignal(pulseShape, frequency);
const { transformedSignal } = useFft(shapedSpectrumSignal);
</script>

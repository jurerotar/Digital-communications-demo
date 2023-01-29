<template>
  <AppMainContainer>
    <AppMainHeading>
      Modulacije
    </AppMainHeading>

    <AppCollapsible>
      <theory-modulations />
    </AppCollapsible>

    <AppAnimationPauseButton
      :state="isPlaying ? 'playing' : 'paused'"
      @click="toggleIsPlaying()"
    />

    <AppSectionHeading>
      Analogne modulacije
    </AppSectionHeading>
    <!-- Analog modulations buttons -->
    <AppButtonContainer>
      <AppButton
        v-for="modulation in analogModulations"
        :key="modulation.key"
        :active="selectedModulationKey === modulation.key"
        @click="changeSelectedModulationKey(modulation.key)"
      >
        {{ modulation.label }}
      </AppButton>
    </AppButtonContainer>
    <AppSectionHeading>
      Digitalne modulacije
    </AppSectionHeading>
    <!-- Digital modulations buttons -->
    <AppButtonContainer>
      <AppButton
        v-for="modulation in digitalModulations"
        :key="modulation.key"
        :active="selectedModulationKey === modulation.key"
        @click="changeSelectedModulationKey(modulation.key)"
      >
        {{ modulation.label }}
      </AppButton>
    </AppButtonContainer>
    <!-- Sine/bipolar/unipolar signal carrying data -->
    <PositiveOnlySignalGraph
      v-if="dataSignalCanvasData.type !== 'binaryLevel4'"
      :data="dataSignalCanvasData.data.data"
      :canvas-id="'data-signal'"
      :title="dataSignalCanvasData.data.title"
      :vertical-pool="[1, 0.5, -0.5, -1]"
      :description="dataSignalCanvasData.data.description"
      :is-binary="dataSignalCanvasData.data.isBinary"
    />
    <!-- 4 level signal carrying data -->
    <Level4SignalGraph
      v-if="dataSignalCanvasData.type === 'binaryLevel4'"
      :data="binaryLevel4SignalValues"
      :title="dataSignalCanvasData.data.title"
      :description="dataSignalCanvasData.data.description"
      :is-binary="true"
    />
    <!-- All modulations must have a carrier, so we always display this canvas -->
    <PositiveOnlySignalGraph
      :data="carrierSignalValues"
      :canvas-id="'carrier-signal'"
      :title="'Nosilec'"
      :vertical-pool="[1, 0.5, -0.5, -1]"
      :description="'Nosilec je visokofrekvenčni signal, s katerim moduliramo podatkovni signal.'"
      :is-binary="false"
    />
    <PositiveOnlySignalGraph
      :data="modulatedSignalValues"
      :canvas-id="'modulated-signal'"
      :title="'Moduliran signal'"
      :vertical-pool="[1, 0.5, -0.5, -1]"
      :is-modulated="true"
      :description="selectedModulation.description"
      :is-binary="false"
    />
  </AppMainContainer>
</template>

<script
  setup
  lang="ts"
>
import {computed, onBeforeUnmount, onMounted, ref} from 'vue';
import AppCollapsible from "@/js/components/common/AppCollapsible.vue";
import TheoryModulations from "@/js/components/theory/TheoryModulations.vue";
import AppMainHeading from "@/js/components/common/AppMainHeading.vue";
import AppButton from "@/js/components/common/buttons/AppButton.vue";
import AppButtonContainer from "@/js/components/common/buttons/AppButtonContainer.vue";
import Level4SignalGraph from "@/js/components/canvas/Level4SignalGraph.vue";
import PositiveOnlySignalGraph from "@/js/components/canvas/PositiveOnlySignalGraph.vue";
import {binaryValues} from "@/js/helpers/functions";
import AppSectionHeading from "@/js/components/common/AppSectionHeading.vue";
import {
  Modulation,
  ModulationKey,
  DataSignalCanvas,
  DataSignalCanvasOptions,
  ModulationAmplitudeModifier,
  ModulationToDataArrayMap
} from "@/js/types/modulations";
import AppMainContainer from "@/js/components/common/AppMainContainer.vue";
import AppAnimationPauseButton from "@/js/components/common/buttons/AppAnimationPauseButton.vue";

// We'll be increasing the time by this amount
const timeDifference = 0.005;
// Amount in pixels
const binarySignalWidth = 120;

const isPlaying = ref<boolean>(true);

const toggleIsPlaying = () => {
  isPlaying.value = !isPlaying.value;
}

const carrierValueGenerator = (time: number): number => Math.sin(time * 15 * Math.PI);
const sineModulationValueGenerator = (time: number): number => Math.sin(time * Math.PI);
const binaryLevel2ValueGenerator: () => number = binaryValues([-1, 1], binarySignalWidth);
const binaryLevel4ValueGenerator: () => number = binaryValues([-3, -1, 1, -3], binarySignalWidth);

// Available modulations
const modulations: Modulation[] = [
  {
    key: 'am-lc',
    label: 'AM-LC',
    type: 'analog',
    generator: (carrier: number, sine: number): number => {
      return carrier * (1.5 + sine);
    },
    description: `Pri AM-DSB-LC modulaciji se modulacijskemu signalu dodaja enosmerna komponenta, kar zagotovi konstantno
    polariteto signala pred množenjem z nosilcem. Modulacijski indeks m = 0.66.`,
    canvas: ['sine']
  },
  {
    key: 'am-sc',
    label: 'AM-SC',
    type: 'analog',
    generator: (carrier: number, sine: number): number => {
      return carrier * sine;
    },
    description: `AM-DSB-SC je dvobočno amplitudno modulirani signal brez nosilca v spektru.`,
    canvas: ['sine']
  },
  {
    key: 'fm',
    label: 'FM',
    type: 'analog',
    generator: (time: number): number => {
      return Math.cos(15 * Math.PI * time + (10 * (Math.cos(Math.PI * time) + 150)));
    },
    description: `Frekvenčna modulacija je postopek spreminjanja frekvence nosilnega signala v ritmu modulacijskega signala-informacije.
    Frekvenčna deviacija: Δf = +-10.`,
    canvas: ['sine']
  },
  {
    key: '2ask',
    label: '2ASK',
    type: 'digital',
    generator: (carrier: number, level2BinaryValue: number): number => {
      const ASK2Amplitudes: ModulationAmplitudeModifier = {
        '-1': -1,
        '1': 0
      }
      return carrier * ASK2Amplitudes[level2BinaryValue];
    },
    description: `2ASK modulacijo pridobimo z množenjem unipolarnega binarnega podatkovnega signala in harmoničnega nosilca.`,
    canvas: ['binaryLevel1']
  },
  {
    key: '4ask',
    label: '4ASK',
    type: 'digital',
    generator: (carrier: number, level4BinaryValue: number): number => {
      return carrier * level4BinaryValue;
    },
    description: `4ASK modulacijo pridobimo z množenjem digitalnega niza {-3,-1,1,3} in harmoničnega nosilca. 4ASK modulacija sicer
    predpostavlja 4 različne amplitude nivoje. Izkaže pa se, da je to neekonomično, ker porabi več energije. Zato v praksi 4ASK izvedemo
    z dvema amplitudnima nivojema in dvema fazama.`,
    canvas: ['binaryLevel4']
  },
  {
    key: '2psk',
    label: '2PSK',
    type: 'digital',
    generator: (carrier: number, level2BinaryValue: number): number => {
      return carrier * level2BinaryValue;
    },
    description: `2PSK modulacijo pridobimo z množenjem bipolarnega binarnega podatkovnega signala in harmoničnega nosilca.`,
    canvas: ['binaryLevel2']

  },
  {
    key: '4psk',
    label: '4PSK',
    type: 'digital',
    generator: (time: number, level4BinaryValue: number): number => {
      const PSK4Amplitudes: ModulationAmplitudeModifier = {
        '3': Math.PI / 2,
        '1': Math.PI,
        '-1': 3 * Math.PI / 2,
        '-3': 2 * Math.PI
      };
      return Math.sin(15 * Math.PI * time + PSK4Amplitudes[level4BinaryValue]);
    },
    description: `4PSK modulacijo pridobimo z množenjem bipolarnega binarnega podatkovnega signala in harmoničnega nosilca.`,
    canvas: ['binaryLevel4']
  },
  {
    key: '2fsk',
    label: '2FSK',
    type: 'digital',
    generator: (time: number, level2BinaryValue: number): number => {
      const FSK2Multipliers: ModulationAmplitudeModifier = {
        '1': 12,
        '-1': 30
      };
      // We change frequency multiplier discretely based on current value of bipolar signal
      return Math.sin(Math.PI * time * FSK2Multipliers[level2BinaryValue]);
    },
    description: `2FSK je postopek, pri katerem so binarni podatki posredovani preko spremembe frekvence nosilnega signala. Pri 2FSK
    uporabljamo 2 različni frekvenci.`,
    canvas: ['binaryLevel2']
  },
  {
    key: '4fsk',
    label: '4FSK',
    type: 'digital',
    generator: (time: number, level4BinaryValue: number): number => {
      const FSK4Multipliers: ModulationAmplitudeModifier = {
        '3': 5,
        '1': 15,
        '-1': 30,
        '-3': 60
      };
      // We change frequency multiplier discretely based on current value of 4-level binary signal
      return Math.sin(Math.PI * time * FSK4Multipliers[level4BinaryValue]);
    },
    description: `4FSK je postopek, pri katerem so binarni podatki posredovani preko spremembe frekvence nosilnega signala.
    Pri 4FSK uporabljamo 4 različne frekvence.`,
    canvas: ['binaryLevel4']
  },
];

// Modulation types, used for displaying buttons
const analogModulations = computed<Modulation[]>(() => modulations.filter((modulation: Modulation) => modulation.type === 'analog'));
const digitalModulations = computed<Modulation[]>(() => modulations.filter((modulation: Modulation) => modulation.type === 'digital'));

const selectedModulationKey = ref<ModulationKey>('am-lc');
const selectedModulation = computed<Modulation>(
  () => modulations.find((modulation: Modulation) => modulation.key === selectedModulationKey.value)!
);

const timeValues: number[] = [...Array(600).fill(0)].map((t: number, i: number) => i * timeDifference);
const carrierSignalValues = ref<number[]>(timeValues.map((t: number) => carrierValueGenerator(t)));
const sineModulationSignalValues = ref<number[]>(timeValues.map((t: number) => sineModulationValueGenerator(t)));

// Bipolar signal
const binaryLevel2SignalValues = ref<number[]>(Array(5).fill(0)
  .map((el: number, i: number) => Array(binarySignalWidth).fill((i % 2 === 1) ? 1 : -1))
  .flat()
);

// 4 level signal
const binaryLevel4SignalValues = ref<number[]>([
  Array(binarySignalWidth).fill(3),
  Array(binarySignalWidth).fill(1),
  Array(binarySignalWidth).fill(-1),
  Array(binarySignalWidth).fill(-3),
  Array(binarySignalWidth).fill(3)
].flat());

// Calculates next modulated value based on currently selected key
const nextModulatedValue = (index: number): number => {
  const key: ModulationKey = selectedModulationKey.value;
  const modulation: Modulation = selectedModulation.value;

  const modulationToDataArraysMap: ModulationToDataArrayMap = {
    'am-lc': modulation.generator(carrierSignalValues.value[index], sineModulationSignalValues.value[index]),
    'am-sc': modulation.generator(carrierSignalValues.value[index], sineModulationSignalValues.value[index]),
    'fm': modulation.generator(timeValues[index]),
    '2ask': modulation.generator(carrierSignalValues.value[index], binaryLevel2SignalValues.value[index]),
    '4ask': modulation.generator(carrierSignalValues.value[index], binaryLevel4SignalValues.value[index]),
    '2psk': modulation.generator(carrierSignalValues.value[index], binaryLevel2SignalValues.value[index]),
    '4psk': modulation.generator(timeValues[index], binaryLevel4SignalValues.value[index]),
    '2fsk': modulation.generator(timeValues[index], binaryLevel2SignalValues.value[index]),
    '4fsk': modulation.generator(timeValues[index], binaryLevel4SignalValues.value[index]),
  }

  return modulationToDataArraysMap[key];
}

// Used for populating props in data-signal canvas
const dataSignalCanvasData = computed<DataSignalCanvas>(() => {
  const [canvasType] = selectedModulation.value.canvas;
  const canvasData: DataSignalCanvasOptions = {
    'sine': {
      title: 'Sinusni modulacijski signal',
      description: 'Sinusni podatkovni signal.',
      isBinary: false,
      data: sineModulationSignalValues.value
    },
    'binaryLevel1': {
      title: 'Unipolarni signal',
      description: 'Unipolarni signal je sestavljen iz vrednosti 0 in 1.',
      isBinary: false,
      data: binaryLevel2SignalValues.value
    },
    'binaryLevel2': {
      title: 'Binarni signal',
      description: 'Bipolarni signal je sestavljen iz vrednosti 1 in -1.',
      isBinary: true,
      data: binaryLevel2SignalValues.value
    },
    'binaryLevel4': {
      title: '4-nivojski bipolarni signal',
      description: '4-nivojski bipolarni signal je sestavljen iz vrednosti 3, 1, -1, -3.',
      isBinary: true,
      data: binaryLevel4SignalValues.value
    }
  }
  return {
    type: canvasType,
    data: canvasData[canvasType]
  }
});

// Create an array of fixed width and populate it with default modulation
const modulatedSignalValues = ref<number[]>([...Array(600)].map((el: number, index: number) => {
  return nextModulatedValue(index);
}));

// Recalculate modulated values and update modulation key on change
const changeSelectedModulationKey = (key: ModulationKey): void => {
  selectedModulationKey.value = key;
  const length: number = modulatedSignalValues.value.length;
  for (let i = 0; i < length; i++) {
    modulatedSignalValues.value[i] = nextModulatedValue(i);
  }
}

let intervalId: number;
onMounted(() => {
  // Start time at 600 * 0.005, because we initiate arrays with 600 values already in
  let time = 600 * 0.005;
  // Create interval to push new signal values to arrays
  intervalId = window.setInterval(() => {
    if(!isPlaying.value) {
      return;
    }

    // Loop through arrays and remove last values if lengths are too big
    // Remove last element first, so we don't change array size
    [
      timeValues,
      carrierSignalValues.value,
      sineModulationSignalValues.value,
      binaryLevel2SignalValues.value,
      binaryLevel4SignalValues.value,
      modulatedSignalValues.value
    ].forEach((array: number[]) => {
      if (array.length >= 599) {
        array.pop();
      }
    });

    // Push new values to the start of the arrays
    carrierSignalValues.value.unshift(carrierValueGenerator(time));
    sineModulationSignalValues.value.unshift(sineModulationValueGenerator(time));
    binaryLevel2SignalValues.value.unshift(binaryLevel2ValueGenerator());
    binaryLevel4SignalValues.value.unshift(binaryLevel4ValueGenerator());
    modulatedSignalValues.value.unshift(nextModulatedValue(0));
    timeValues.unshift(time);
    time += timeDifference;
  }, 30);
});

onBeforeUnmount(() => {
  // Clear interval when component unmounts
  window.clearInterval(intervalId);
});
</script>
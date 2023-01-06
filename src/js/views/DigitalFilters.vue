<template>
  <app-main-container>
    <app-main-heading>
      Digitalni filtri
    </app-main-heading>
    <app-collapsible>
      <theory-digital-filters />
    </app-collapsible>
    <app-section-heading>
      Red filtra
    </app-section-heading>
    <!-- Range slider -->
    <div class="inline-flex flex-col mb-2 w-fit-content gap-2">
      <label
        :for="'filter-order'"
        class="text-xl transition-colors duration-300 dark:text-white"
      >
        Red filtra:
        <span class="font-medium">
          {{ FilterOrder }}
        </span>
      </label>
      <input
        :id="'filter-order'"
        v-model.number="FilterOrder"
        type="range"
        min="1"
        max="9"
        step="1"
        @change="UpdateFiltOrd(FilterOrder)"
      >
    </div>
    <app-section-heading>
      Tip filtra
    </app-section-heading>
    <button-container>
      <app-button
        v-for="shape in filter.filterType"
        :key="shape"
        :active="filter.filterType === shape.label"
        @click="setFilterType(shape.label)"
      >
        {{ shape.label }}
      </app-button>
    </button-container>

    <app-section-heading>
      Okenska funkcija
    </app-section-heading>
    <button-container>
      <app-button
        v-for="windov in filter.windovFunc"
        :key="windov.label"
        :active="filter.windovFunc === windov.label"
        @click="setFilterFunc(windov.key)"
      >
        {{ windov.key }}
      </app-button>
    </button-container>
    <!-- <full-signal
      :canvas-id="'transfer-function'"
      :data="baseSignal"
      :title="'Transfer function of selected filter'"
      :vertical-pool="[1, 0.5, -0.5, -1]"
      :horizontal-pool="pulse.horizontalPool"
      :type="pulse.key"
    /> -->
    <transfer-function
      :canvas-id="'transfer-graph'"
      :data="baseSignal"
      :title="'Impulz'"
      :vertical-pool="[1, 0.5, -0.5, -1]"
      :horizontal-pool="filter.filtOrder"
      :type="filter.key"
    />
    <!-- <spectrum-canvas
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
    /> -->
  </app-main-container>
</template>

<script
  setup
  lang="ts"
>
import TheoryDigitalFilters from "@/js/components/theory/TheoryDigitalFilters.vue";
import ButtonContainer from "@/js/components/common/buttons/AppButtonContainer.vue";
import AppButton from "@/js/components/common/buttons/AppButton.vue";
import AppMainHeading from "@/js/components/common/AppMainHeading.vue";
import AppCollapsible from "@/js/components/common/AppCollapsible.vue";

import IndividualHarmonics from "@/js/components/canvas/TransferFunction.vue";
import SummedHarmonics from "@/js/components/canvas/SummedHarmonics.vue";
import TransferFunction from "@/js/components/canvas/TransferFunction.vue";

/* Polar form conversion */
import Complex from 'Complex';

/* Window functions for FIR filter */
import {
    lanczos, rectangular, triangular, bartlett, bartlettHann, welch, hann,
    hamming, blackman, nuttall, blackmanHarris, blackmanNuttall, exactBlackman,
    flatTop, cosine, gaussian, tukey
} from 'window-function';

import {ref} from "vue";
import AppSectionHeading from "@/js/components/common/AppSectionHeading.vue";
import AppMainContainer from "@/js/components/common/AppMainContainer.vue";

export interface Filter {
  // filter label
  label: string;
  //
  key?: FilterType;
  //
  currType?: FilterType;
  // filter type
  filterType?: FiltType[];
  //
  currFunc?: WindowFunc;
  // window func
  windovFunc?: FiltFunc[];
  // order
  filtOrder?: number;
}

type FilterType = 'FIR' | 'IIR';

type WindowFunc = "lanczos" | "rectangular" | "triangular" | "bartlett" |
                  "bartlettHann" | "welch" | "hann" |
                  "hamming" | "blackman" | "nuttall" |
                  "blackmanHarris" | "blackmanNuttall" | "exactBlackman" |
                  "flatTop" | "cosine" | "gaussian" | "tukey";

interface FiltFunc {
  label: string;
  key: WindowFunc;
}

interface FiltType {
  label: string;
  key: FilterType;
}

const FilterTypes: FiltType[] = [
  {label: 'FIR', key: 'FIR'}, 
  {label: 'IIR', key: 'IIR'},
]

// Default pulse length options we give to the users
const WindowFunctions: FiltFunc[] = [
  {label: 'lanc', key: "lanczos"},
  {label: 'rect', key: "rectangular"},
  {label: 'tri', key: "triangular"},
  {label: 'bar', key: "bartlett"},
  {label: 'barH', key: "bartlettHann"},
  {label: 'wel', key: "welch"},
  {label: 'hann', key: "hann"},
  {label: 'hamm', key: "hamming"},
  {label: 'blck', key: "blackman"},
  {label: 'nutt', key: "nuttall"},
  {label: 'blkH', key: "blackmanHarris"},
  {label: 'blkN', key: "blackmanNuttall"},
  {label: 'exblk', key: "exactBlackman"},
  {label: 'fTop', key: "flatTop"},
  {label: 'cos', key: "cosine"},
  {label: 'gaus', key: "gaussian"},
  {label: 'tuk', key: "tukey"}
];

const FilterOrder = ref<number>(1);

const filter: Filter = {
  // filter label
  label: "MojFiltr",
  // filter type
  currType: 'FIR',
  // filter type
  filterType: FilterTypes,
  // window func
  currFunc: "hamming",
  // window func
  windovFunc: WindowFunctions,
  // order
  filtOrder: 3,
};

const UpdateFiltOrd = (value: number): void => {
  // setFiltOrder(value);
  filter.filtOrder = value;
  console.log(filter.filtOrder)
}

const setFilterType = (tip: FilterType): void => {
  // Reset length to 1, since some lengths might be missing on certain shapes
  filter.currType = tip;
  console.log(filter.currType);
}

const setFilterFunc = (tip: WindowFunc): void => {
  // Reset length to 1, since some lengths might be missing on certain shapes
  filter.currFunc = tip;
  console.log(filter.currFunc);
}

const baseSignal: number[] = [0, 1, 2, 3, 4, 5];

/*
*   FIR filter - generates transfer function based on window type and order
*   
*   Paramters:
*   .winLen     (length of a window and also order of a FIR filter)
*   .winFunct   (window function)
*   .winParam   (optional parameter to some window functions)
*   .freqRes    (number of frequency point in range 0 to f_s)
*
*   Returns:
*   freq        (normalized frequency or f/(2*f_s))
*   mag         (magnitude in decibels)
*   magMin      (magnitude minimum)
*   magMax      (magnitude maximum)
*/
// export function FirFilter(filter: Filter) {
//     let bn = new Array(filter.winLen);
//     let wSum = 0;

//     /* Generates window weights */
//     for (let idx = 0; idx < filter.winLen; idx++) {
//         switch (filter.winFunct) {
//             case "lanczos": bn[idx] = lanczos(idx, filter.winLen); break;
//             case "rectangular": bn[idx] = rectangular(idx, filter.winLen); break;
//             case "triangular": bn[idx] = triangular(idx, filter.winLen); break;
//             case "bartlett": bn[idx] = bartlett(idx, filter.winLen); break;
//             case "bartlettHann": bn[idx] = bartlettHann(idx, filter.winLen); break;
//             case "welch": bn[idx] = welch(idx, filter.winLen); break;
//             case "hann": bn[idx] = hann(idx, filter.winLen); break;
//             case "hamming": bn[idx] = hamming(idx, filter.winLen); break;
//             case "blackman": bn[idx] = blackman(idx, filter.winLen); break;
//             case "nuttall": bn[idx] = nuttall(idx, filter.winLen); break;
//             case "blackmanHarris": bn[idx] = blackmanHarris(idx, filter.winLen); break;
//             case "blackmanNuttall": bn[idx] = blackmanNuttall(idx, filter.winLen); break;
//             case "exactBlackman": bn[idx] = exactBlackman(idx, filter.winLen); break;
//             case "flatTop": bn[idx] = flatTop(idx, filter.winLen); break;
//             case "cosine": bn[idx] = cosine(idx, filter.winLen); break;
//             case "gaussian": bn[idx] = gaussian(idx, filter.winLen, filter.winParam); break;
//             case "tukey": bn[idx] = tukey(idx, filter.winLen, filter.winParam); break;
//         }
//         wSum = wSum + bn[idx];
//     }

//     /* Divide each weight by total sum to get "b_n" coefficients ("a_n" are zero except 1st equals one) */
//     for (let idx = 0; idx < filter.winLen; idx++) {
//         bn[idx] = bn[idx] / wSum;
//     }

//     let freq = Array(filter.freqRes);
//     let mag = Array(filter.freqRes);
//     let magMin, magMax;

//     /* Generates frequency and magnitude arrays */
//     for (let idxa = 0; idxa < filter.freqRes; idxa++) {
//         freq[idxa] = idxa * (0.5 / (filter.freqRes + 1));
//         let temp = new Complex(bn[0], 0);
//         let ejw = new Complex(0, 0);

//         /* bn[0] + bn[1]*exp(-jw) + bn[2]*exp(-2jw) + ... + b[N]*exp(-Njw) */
//         for (let idxb = 1; idxb < filter.winLen; idxb++) {
//             temp = temp.add(ejw.fromPolar(bn[idxb], -idxb * 2 * Math.PI * freq[idxa]));
//         }
//         mag[idxa] = gainToDecibels(temp.abs());     // H(jw) = Y(jw) / X(jw)
//         freq[idxa] = freq[idxa] * 2;                // correct the scale

//         /* Due to notches, some values go towards -Ininity */
//         if ((mag[idxa] == -Infinity) || (mag[idxa] <= -200)) {
//             mag[idxa] = -200;
//         }

//         /* Min/Max of magnitude */
//         if (idxa == 0) {
//             magMin = magMax = mag[idxa];
//         }
//         else if (mag[idxa] < magMin) {
//             magMin = mag[idxa];
//         }
//         else if (mag[idxa] > magMax) {
//             magMax = mag[idxa];
//         }
//         else { }
//     }

//     return [freq, mag, magMin, magMax];
// }

function gainToDecibels(value: number) {
    if (value == null) return 0
    return 20 * (0.43429 * Math.log(value))
}

function decibelsToGain(value: number) {
    return Math.exp(value / 8.6858)
}

</script>

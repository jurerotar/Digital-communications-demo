<template>
  <app-main-container>
    <app-main-heading>
      Digitalni filtri
    </app-main-heading>
    <app-collapsible>
      <theory-digital-filters />
    </app-collapsible>
    <app-section-heading>
      FIR filter
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
        max="32"
        step="1"
        @change="UpdateFiltOrd(FilterOrder)"
      >
    </div>
    <app-section-heading>
      Okenska funkcija
    </app-section-heading>
    <button-container>
      <app-button
        v-for="windov in filter.windovFunc"
        :key="windov.key"
        :active="selectedWinFunct === windov.key"
        @click="changeSelectedWinFunc(windov.key)"
      >
      {{ windov.label }}
    </app-button>
    </button-container>
    <graph 
      title = title1 
      :g_width = width
      :signal_1 = "filter.signal_1" 
      :g_height = "500"
      :trig_draw = "trig_1" 
      :o_x = "5" 
      :o_y = "5"
      :auto_scale = 'true'
    />

    <app-section-heading>
      IIR filter
    </app-section-heading>
    <app-section-heading>
      IIR tip
    </app-section-heading>
    <button-container>
      <app-button
        v-for="windov in filter.types_iir"
        :key="windov.key"
        :active="selectedFilterType === windov.key"
        @click="changeSelectedFilterType(windov.key)"
      >
        {{ windov.label }}
      </app-button>
    </button-container>
    <graph
      title = title2 
      :g_width = width
      :signal_1 = "filter.signal_2"
      :g_height = "500"
      :trig_draw = "trig_2"
      :o_x = "5"
      :o_y = "5"
      :auto_scale = 'true'
    />
    <!-- Range slider -->
    <div class="inline-flex flex-col mb-2 w-fit-content gap-2">
      <label
        :for="'filter-gain'"
        class="text-xl transition-colors duration-300 dark:text-white"
      >
        Ojačanje filtra [dB]:
        <span class="font-medium">
          {{ FilterGain }}
        </span>
      </label>
      <input
        :id="'filter-gain'"
        v-model.number="FilterGain"
        type="range"
        min="-30"
        max="30"
        step="0.1"
        @change="UpdateFiltGain(FilterGain, FilterCutoff, FilterQuality)"
      >
    </div>
    <div class="inline-flex flex-col mb-2 w-fit-content gap-2">
      <label
        :for="'filter-cutoff'"
        class="text-xl transition-colors duration-300 dark:text-white"
      >
        Mejna frekvenca:
        <span class="font-medium">
          {{ FilterCutoff }}
        </span>
      </label>
      <input
        :id="'filter-cutoff'"
        v-model.number="FilterCutoff"
        type="range"
        min="0"
        max="1"
        step="0.01"
        @change="UpdateFiltGain(FilterGain, FilterCutoff, FilterQuality)"
      >
    </div>
    <div class="inline-flex flex-col mb-2 w-fit-content gap-2">
      <label
        :for="'filter-quality'"
        class="text-xl transition-colors duration-300 dark:text-white"
      >
        Kvaliteta filtra:
        <span class="font-medium">
          {{ FilterQuality }}
        </span>
      </label>
      <input
        :id="'filter-quality'"
        v-model.number="FilterQuality"
        type="range"
        min="0.01"
        max="20"
        step="0.01"
        @change="UpdateFiltGain(FilterGain, FilterCutoff, FilterQuality)"
      >
    </div>
  </app-main-container>
</template>

<script setup lang="ts" >

import TheoryDigitalFilters from "@/js/components/theory/TheoryDigitalFilters.vue";
import ButtonContainer from "@/js/components/common/buttons/AppButtonContainer.vue";
import AppButton from "@/js/components/common/buttons/AppButton.vue";
import AppMainHeading from "@/js/components/common/AppMainHeading.vue";
import AppCollapsible from "@/js/components/common/AppCollapsible.vue";

import Graph from "@/js/components/canvas/graph.vue";
import {
  FilterType,
  WindowFunc,
  IIR_type,
  FiltFunc,
  FiltType,
  IIR_Types
} from "@/js/types/Filters";
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
  // filter type
  currType?: FilterType;
  filterType?: FiltType[];
  // window func
  winFunct?: WindowFunc;
  windovFunc?: FiltFunc[];
  // order
  winLen: number;

  trig_draw_1: boolean;
  trig_draw_2: boolean;
  signal_1: {x:number, y:number}[];
  signal_2: {x:number, y:number}[];

  winParam: number;

  freqRes: number;

  type_iir: IIR_type;
  types_iir: IIR_Types[];

  gain: number;

  cutoff: number;

  quality: number;
}

var trig1: boolean = true;
var trig2: boolean = true;
const selectedWinFunct = ref<WindowFunc>('hamming');
const selectedFilterType = ref<IIR_type>('bandpass');


const FilterTypes: FiltType[] = [
  {label: 'FIR', key: 'FIR'}, 
  {label: 'IIR', key: 'IIR'},
];

const IIRTypes: IIR_Types[] = [
  {key: "lowpass",    label: "Lowpass"},
  {key: "highpass",   label: "Highpass"},
  {key: "bandpass",   label: "Bandpass"},
  {key: "notch",      label: "Notch"},
  {key: "one-pole-lp", label: "Enopolni LP"},
  {key: "peak",       label: "Peak"},
  {key: "low-shelf",  label: "LowShelf"},
  {key: "high-shelf", label: "HighShelf"},
];

// Default pulse length options we give to the users
const WindowFunctions: FiltFunc[] = [
  {key: 'lanczos', label: "lanczos"},
  {key: 'rectangular', label: "rectangular"},
  {key: 'triangular',  label: "triangular"},
  {key: 'bartlett',  label: "bartlett"},
  {key: 'bartlettHann', label: "bartlettHann"},
  {key: 'welch',  label: "welch"},
  {key: 'hann', label: "hann"},
  {key: 'hamming', label: "hamming"},
  {key: 'blackman', label: "blackman"},
  {key: 'nuttall', label: "nuttall"},
  {key: 'blackmanHarris', label: "blackmanHarris"},
  {key: 'blackmanNuttall', label: "blackmanNuttall"},
  {key: 'exactBlackman', label: "exactBlackman"},
  {key: 'flatTop', label: "flatTop"},
  {key: 'cosine',  label: "cosine"},
  {key: 'gaussian', label: "gaussian"},
  {key: 'tukey',  label: "tukey"}
];

const FilterOrder = ref<number>(1);
const FilterGain = ref<number>(1);
const FilterCutoff = ref<number>(1);
const FilterQuality = ref<number>(1);
const trig_1 = ref<boolean>(false);
const trig_2 = ref<boolean>(false);

const filter: Filter = {
  label: "MojFiltr",
  currType: 'IIR',
  filterType: FilterTypes,
  winFunct: "gaussian",
  windovFunc: WindowFunctions,
  winLen: 3,
  trig_draw_1: true,
  trig_draw_2: true,
  signal_1: [{x:0, y:0}],
  signal_2: [{x:0, y:0}],
  winParam: 0.2,
  freqRes: 10000,
  type_iir: "bandpass",
  types_iir: IIRTypes,
  gain: 1,
  cutoff: 0.2,
  quality: 10,
};

const UpdateFiltOrd = (value: number): void => {
  filter.winLen = value; 
  // trig1 = filter.trig_draw_1;
  FirFilter();
  trig_1.value = !trig_1.value;
  console.log(filter.trig_draw_1)
  // console.log(trig2 != filter.trig_draw_2)
}

// const setFilterType = (tip: FilterType ): void => {
//   // Reset length to 1, since some lengths might be missing on certain shapes
//   if (filter.currType == 'FIR') {
//     FirFilter();
//     filter.currType = tip;
//   } else {
  //     IirFilter();
//   }
//   console.log(filter.currType);
// }

const changeSelectedWinFunc = (tip: WindowFunc): void => {
  // Reset length to 1, since some lengths might be missing on certain shapes
  selectedWinFunct.value = tip;
  filter.winFunct = tip;

  FirFilter();
  trig_1.value = !trig_1.value;
  console.log(filter.trig_draw_1);
}

/*
*   FIR filter - generates transfer function based on window type and order
*/
function FirFilter() {
    let bn = new Array(filter.winLen);
    let wSum = 0;

    /* Generates window weights */
    for (let idx = 0; idx < filter.winLen; idx++) {
      switch (filter.winFunct) {
        case "lanczos": bn[idx] = lanczos(idx, filter.winLen); break;
        case "rectangular": bn[idx] = rectangular(idx, filter.winLen); break;
        case "triangular": bn[idx] = triangular(idx, filter.winLen); break;
        case "bartlett": bn[idx] = bartlett(idx, filter.winLen); break;
        case "bartlettHann": bn[idx] = bartlettHann(idx, filter.winLen); break;
        case "welch": bn[idx] = welch(idx, filter.winLen); break;
        case "hann": bn[idx] = hann(idx, filter.winLen); break;
        case "hamming": bn[idx] = hamming(idx, filter.winLen); break;
        case "blackman": bn[idx] = blackman(idx, filter.winLen); break;
        case "nuttall": bn[idx] = nuttall(idx, filter.winLen); break;
        case "blackmanHarris": bn[idx] = blackmanHarris(idx, filter.winLen); break;
        case "blackmanNuttall": bn[idx] = blackmanNuttall(idx, filter.winLen); break;
        case "exactBlackman": bn[idx] = exactBlackman(idx, filter.winLen); break;
        case "flatTop": bn[idx] = flatTop(idx, filter.winLen); break;
        case "cosine": bn[idx] = cosine(idx, filter.winLen); break;
        case "gaussian": bn[idx] = gaussian(idx, filter.winLen, filter.winParam); break;
        case "tukey": bn[idx] = tukey(idx, filter.winLen, filter.winParam); break;
      }
      wSum = wSum + bn[idx];
    }
    
    /* Divide each weight by total sum to get "b_n" coefficients ("a_n" are zero except 1st equals one) */
    for (let idx = 0; idx < filter.winLen; idx++) {
      bn[idx] = bn[idx] / wSum;
    }

    var freq: number[] = [filter.freqRes];
    var mag: number[] = [filter.freqRes];
    let magMin = 0, magMax = 0;

    /* Generates frequency and magnitude arrays */
    for (let idxa = 0; idxa < filter.freqRes; idxa++) {
        freq[idxa] = idxa * (0.5 / (filter.freqRes + 1));
        let temp = new Complex(bn[0], 0);
        let ejw = new Complex(0, 0);
        
        /* bn[0] + bn[1]*exp(-jw) + bn[2]*exp(-2jw) + ... + b[N]*exp(-Njw) */
        for (let idxb = 1; idxb < filter.winLen; idxb++) {
            temp = temp.add(ejw.fromPolar(bn[idxb], -idxb * 2 * Math.PI * freq[idxa]));
        }
        mag[idxa] = gainToDecibels(temp.abs());     // H(jw) = Y(jw) / X(jw)
        freq[idxa] = freq[idxa] * 2;                // correct the scale

        /* Due to notches, some values go towards -Ininity */
        if ((mag[idxa] == -Infinity) || (mag[idxa] <= -200)) {
            mag[idxa] = -200;
        }

        /* Min/Max of magnitude */
        if (idxa == 0) {
            magMin = magMax = mag[idxa];
        } else if (mag[idxa] < magMin) {
            magMin = mag[idxa];
        } else if (mag[idxa] > magMax) {
            magMax = mag[idxa];
        } else { }
    }
    // console.log(mag[idxa]);
    for (let idxa = 0; idxa < filter.freqRes; idxa++) {
      filter.signal_1[idxa] = {x:freq[idxa], y:mag[idxa]}
    }
    
  console.log("Calculating Fir");
}
  
const title1: string = "FIR"
const title2: string = "IIR"
// Recalculate modulated values and update modulation key on change
const changeSelectedFilterType = (key: IIR_type): void => {
  selectedFilterType.value = key;
  filter.type_iir = key;
  // trig2 = filter.trig_draw_2;
  IirFilter();
  trig_2.value = !trig_2.value;
  console.log(filter.trig_draw_2)
}

const UpdateFiltGain = (gain: number, cutoff: number, quality: number): void => {
  filter.gain = gain;
  filter.cutoff = cutoff; 
  filter.quality = quality; 
  IirFilter();
  trig_2.value = !trig_2.value;
  console.log(filter.gain)
  console.log(filter.cutoff)
  console.log(filter.quality)
}

/*
*   IIR filter - generates transfer function based on biquad type, cuttoff, quality, and gain
*/
function IirFilter() {
    let a0, a1, a2, b1, b2, norm;
    let V = Math.pow(10, Math.abs(filter.gain) / 20);  // gain in linear units
    let K = Math.tan(Math.PI * (filter.cutoff / 2));    // f_cutoff as normalized frequency

    /* Calculate window weights */
    switch (filter.type_iir) {
        case "one-pole-lp":
            b1 = Math.exp(-2.0 * Math.PI * (filter.cutoff / 2));
            a0 = 1.0 - b1;
            b1 = -b1;
            a1 = a2 = b2 = 0;
            break;

        case "one-pole-hp":
            b1 = -Math.exp(-2.0 * Math.PI * (0.5 - filter.cutoff / 2));
            a0 = 1.0 + b1;
            b1 = -b1;
            a1 = a2 = b2 = 0;
            break;

        case "lowpass":
            norm = 1 / (1 + K / filter.quality + K * K);
            a0 = K * K * norm;
            a1 = 2 * a0;
            a2 = a0;
            b1 = 2 * (K * K - 1) * norm;
            b2 = (1 - K / filter.quality + K * K) * norm;
            break;

        case "highpass":
            norm = 1 / (1 + K / filter.quality + K * K);
            a0 = 1 * norm;
            a1 = -2 * a0;
            a2 = a0;
            b1 = 2 * (K * K - 1) * norm;
            b2 = (1 - K / filter.quality + K * K) * norm;
            break;

        case "bandpass":
            norm = 1 / (1 + K / filter.quality + K * K);
            a0 = K / filter.quality * norm;
            a1 = 0;
            a2 = -a0;
            b1 = 2 * (K * K - 1) * norm;
            b2 = (1 - K / filter.quality + K * K) * norm;
            break;

        case "notch":
            norm = 1 / (1 + K / filter.quality + K * K);
            a0 = (1 + K * K) * norm;
            a1 = 2 * (K * K - 1) * norm;
            a2 = a0;
            b1 = a1;
            b2 = (1 - K / filter.quality + K * K) * norm;
            break;

        case "peak":
            /* Simplify for positive/negative gains */
            if (filter.gain >= 0) {
                norm = 1 / (1 + 1 / filter.quality * K + K * K);
                a0 = (1 + V / filter.quality * K + K * K) * norm;
                a1 = 2 * (K * K - 1) * norm;
                a2 = (1 - V / filter.quality * K + K * K) * norm;
                b1 = a1;
                b2 = (1 - 1 / filter.quality * K + K * K) * norm;
            } else {
                norm = 1 / (1 + V / filter.quality * K + K * K);
                a0 = (1 + 1 / filter.quality * K + K * K) * norm;
                a1 = 2 * (K * K - 1) * norm;
                a2 = (1 - 1 / filter.quality * K + K * K) * norm;
                b1 = a1;
                b2 = (1 - V / filter.quality * K + K * K) * norm;
            }
            break;

        case "low-shelf":
            /* Simplify for positive/negative gains */
            if (filter.gain >= 0) {
                norm = 1 / (1 + Math.SQRT2 * K + K * K);
                a0 = (1 + Math.sqrt(2 * V) * K + V * K * K) * norm;
                a1 = 2 * (V * K * K - 1) * norm;
                a2 = (1 - Math.sqrt(2 * V) * K + V * K * K) * norm;
                b1 = 2 * (K * K - 1) * norm;
                b2 = (1 - Math.SQRT2 * K + K * K) * norm;
            } else {
                norm = 1 / (1 + Math.sqrt(2 * V) * K + V * K * K);
                a0 = (1 + Math.SQRT2 * K + K * K) * norm;
                a1 = 2 * (K * K - 1) * norm;
                a2 = (1 - Math.SQRT2 * K + K * K) * norm;
                b1 = 2 * (V * K * K - 1) * norm;
                b2 = (1 - Math.sqrt(2 * V) * K + V * K * K) * norm;
            }
            break;
        case "high-shelf":
            /* Simplify for positive/negative gains */
            if (filter.gain >= 0) {
                norm = 1 / (1 + Math.SQRT2 * K + K * K);
                a0 = (V + Math.sqrt(2 * V) * K + K * K) * norm;
                a1 = 2 * (K * K - V) * norm;
                a2 = (V - Math.sqrt(2 * V) * K + K * K) * norm;
                b1 = 2 * (K * K - 1) * norm;
                b2 = (1 - Math.SQRT2 * K + K * K) * norm;
            } else {
                norm = 1 / (V + Math.sqrt(2 * V) * K + K * K);
                a0 = (1 + Math.SQRT2 * K + K * K) * norm;
                a1 = 2 * (K * K - 1) * norm;
                a2 = (1 - Math.SQRT2 * K + K * K) * norm;
                b1 = 2 * (K * K - V) * norm;
                b2 = (V - Math.sqrt(2 * V) * K + K * K) * norm;
            }
            break;
    }

    let freq = Array(filter.freqRes);
    let mag = Array(filter.freqRes);
    let yMin, yMax;

    /* Generates frequency and magnitude arrays */
    for (let idx = 0; idx < filter.freqRes; idx++) {
        freq[idx] = (idx / (filter.freqRes - 1)) * Math.PI;

        /* BiQuad filer transfer function of 2nd order */
        let phi = Math.pow(Math.sin(freq[idx] / 2), 2);
        mag[idx] = Math.log(Math.pow(a0 + a1 + a2, 2) - 4 * (a0 * a1 + 4 * a0 * a2 + a1 * a2) * phi + 16 * a0 * a2 * phi * phi) - Math.log(Math.pow(1 + b1 + b2, 2) - 4 * (b1 + 4 * b2 + b1 * b2) * phi + 16 * b2 * phi * phi);
        mag[idx] = mag[idx] * 10 / Math.LN10;

        /* Due to notches, some values go towards -Ininity */
        if ((mag[idx] == -Infinity) || (mag[idx] <= -200)) {
            mag[idx] = -200;
        }

        /* Min/Max of magnitude */
        if (idx == 0) {
            yMin = yMax = mag[idx];
        } else if (mag[idx] < yMin) {
            yMin = mag[idx];
        } else if (mag[idx] > yMax) {
            yMax = mag[idx];
        } else { }
        freq[idx] = idx / (filter.freqRes - 1);
    }

    for (let idxa = 0; idxa < filter.freqRes; idxa++) {
      filter.signal_2[idxa] = {x:freq[idxa], y:mag[idxa]}
    }

    console.log("Calculating Iir");
    let magMin, magMax;

    /* Adapt y-axis if magnitude values are less than some default values */
    switch (filter.type_iir) {
        default:
        case "lowpass" || "highpass" || "bandpass" || "notch":
            magMin = -100;
            magMax = 0;
            if (yMax > magMax) {
                magMax = yMax;
            }
            break;
        case "peak" || "lowShelf" || "highShelf":
            magMin = -10;
            magMax = 10;
            if (yMax > magMax) {
                magMax = yMax;
            } else if (yMin < magMin) {
                magMin = yMin;
            } else { }
            break;
        case "one-pole-lp" || "one-pole-hp":
            magMin = -40;
            magMax = 0;
            break;
    }
}

function gainToDecibels(value: number) {
  if (value == null) return 0
  return 20 * (0.43429 * Math.log(value))
}

function decibelsToGain(value: number) {
  return Math.exp(value / 8.6858)
}

const width: number = 1000;

</script>

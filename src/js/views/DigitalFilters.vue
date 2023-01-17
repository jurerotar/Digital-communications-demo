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
    <app-paragraph>
      Predstavljena oblika FIR filtra je ena izmed možnih izvedb tega filtra.
      V osnovi gre za operacijo povprečenja, kjer uteži vzorcev, ki jih povprečimo, določimo s pomočjo danih okenskih funkcij.
      Pomembno je dejstvo, da dolžina okenske funkcije določa red filtra (in obratno).
      Ob izbiranju različnih kombinacij okenskih funkcij in njihovih dolžin hitro ugotovimo, da je takšen filter vedno nizkoprepusten.
      To pa ustreza naravi povprečenja, ki ga izvaja predstavljeni FIR filter.
    </app-paragraph>
    <app-section-heading>
      Red filtra: <br>
    </app-section-heading>

    <app-paragraph>
      Red FIR filtra določa dolžino okenske funkcije. Le-ta pride do izraza pri večji dolžini okna. <br>
    </app-paragraph>

    <!-- Range slider -->
    <div class="inline-flex flex-col mb-2 w-fit-content gap-2">
      <label
        :for="'filter-gain'"
        class="text-xl transition-colors duration-300 dark:text-white"
      >
        <span class="font-medium">
          {{ FilterOrder }}
        </span>
      </label>
      <input
        :id="'filter-order'"
        v-model.number="FilterOrder"
        type="range"
        min="4"
        max="100"
        step="1"
        @change="UpdateFiltOrd(FilterOrder)"
      >
    </div>
    <app-section-heading>
      Okenska funkcija <br>
    </app-section-heading>
    <app-paragraph style="padding-left:0cm;">
      Okenska funkcija določa uteži filtra. Z naklonom zvončaste oblike okna prilagajamo prenosno funkcijo sita našim zahtevam. <br>
    </app-paragraph>
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
    <app-section-heading>
      Prenosna funkcija FIR filtra
    </app-section-heading>
    <graph 
      title = "FIR"
      :g_width = width
      :signal_1 = "filter.signal_1" 
      :g_height = "500"
      :trig_draw = "trig_1" 
      :o_x = "5" 
      :o_y = "5"
      :auto_scale = 'true'
      @loaded="UpdateFiltOrd(FilterOrder)"
    />

    <app-section-heading>
      IIR filter
    </app-section-heading>
    <app-paragraph>
      Podani tipi IIR filtra so znani analogni filtri ("Biquad"), ki jih izvedemo z digitalnim filtrom.
      Sistemske funkcije posameznih tipov se med seboj razlikujejo in jih ne moremo podati v nekakšni splošni obliki,
      kot je to izvedeno za FIR filter na osnovi povprečenja. Zato je tudi red predstavljenih IIR filtrov nespremenljiv (2. red).
      Uteži takšnega IIR filtra določimo tako, da najprej določimo sistemsko funkcijo analogne filtra.
      Koeficienti poleg s-členov analognega filtra predstavljajo uteži <span>a<sub>k</sub></span> in <span>b<sub>k</sub></span> digitalnega filtra.
    </app-paragraph>
    <app-section-heading>
      IIR tip <br>
    </app-section-heading>

    <app-paragraph style="padding-left:0cm;">
      IIR filter posnema karakteristiko analognih filtrov. <br>
    </app-paragraph>

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
    <app-section-heading>
      Prenosna funkcija IIR filtra <br>
    </app-section-heading>
    <graph
      title = "IIR"
      :g_width = width
      :signal_1 = "filter.signal_2"
      :g_height = "500"
      :trig_draw = "trig_2"
      :o_x = "5"
      :o_y = "5"
      :auto_scale = 'true'
      @loaded="UpdateFiltGain(FilterGain, FilterCutoff, FilterQuality)"
    />

    <app-section-heading>
      Mejna frekvenca [pi x rad/sample]: <br>
    </app-section-heading>
    <div>
      <app-paragraph style="padding-left:0cm;">
        Mejna frekvenca je podana kot normalizirana frekvenca glede na polovico Nyquistove frekvence in določa frekvenco, kjer se začne prehod med prepustnim in zapornim pasom. <br>
      </app-paragraph>
    </div>

    <!-- Range slider -->
    <div class="inline-flex flex-col mb-2 w-fit-content gap-2">
      <label
        :for="'filter-cutoff'"
        class="text-xl transition-colors duration-300 dark:text-white"
      >
        <span class="font-medium">
          {{ FilterCutoff }}
        </span>
      </label>
      <input
        :id="'filter-cutoff'"
        v-model.number="FilterCutoff"
        type="range"
        min="0.01"
        max="0.99"
        step="0.01"
        @change="UpdateFiltGain(FilterGain, FilterCutoff, FilterQuality)"
      >
    </div>
    
    <!-- Range slider -->
    <app-section-heading>
      Ojačanje filtra [dB]: <br>
    </app-section-heading>
    <div>
      <app-paragraph style="padding-left:0cm;">
        Ojačenje vpliva na prepusntni (pozitivno ojačenje) ali zaporni (negativno ojačenje) pas in igra vlogo le pri tipih "Peak", "Low-shelf" in "High-shelf". <br>
      </app-paragraph>
    </div>
    <div class="inline-flex flex-col mb-2 w-fit-content gap-2">
      <label
        :for="'filter-gain'"
        class="text-xl transition-colors duration-300 dark:text-white"
      >
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
        step="1"
        @change="UpdateFiltGain(FilterGain, FilterCutoff, FilterQuality)"
      >
    </div>

    <app-section-heading>
      Kvaliteta filtra: <br>
    </app-section-heading>
    <div>
      <app-paragraph style="padding-left:0cm;">
        Kvaliteta določa prisotnost resonance, ki se nahaja na mejni frekvenci. <br>
        Pri tipih "Low-pass", "High-pass" in "Band-pass" je navadno željena kvaliteta magGain okolici vrednosti 1, pri "Notch" in "Peak" tipu pa večanje kvalitete rezultira magGain ožjem prepusnem pasu. <br>
      </app-paragraph>
    </div>
    
    <!-- Range slider -->
    <div class="inline-flex flex-col mb-2 w-fit-content gap-2">
      <label
        :for="'filter-quality'"
        class="text-xl transition-colors duration-300 dark:text-white"
      >
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
  label: string;
  key?: FilterType;
  currType?: FilterType;
  filterType?: FiltType[];
  winFunct?: WindowFunc;
  windovFunc?: FiltFunc[];
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

const selectedWinFunct = ref<WindowFunc>('lanczos');
const selectedFilterType = ref<IIR_type>('lowpass');

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
  {key: "low-shelf",  label: "Low shelf"},
  {key: "high-shelf", label: "High shelf"},
];

// Default pulse length options we give to the users
const WindowFunctions: FiltFunc[] = [
  {key: 'lanczos', label: "Lanczos"},
  {key: 'rectangular', label: "Rectangular"},
  {key: 'triangular',  label: "Triangular"},
  {key: 'bartlett',  label: "Bartlett"},
  {key: 'bartlettHann', label: "Bartlett-Hann"},
  {key: 'welch',  label: "Welch"},
  {key: 'hann', label: "Hann"},
  {key: 'hamming', label: "Hamming"},
  {key: 'blackman', label: "Blackman"},
  {key: 'nuttall', label: "Nuttall"},
  {key: 'blackmanHarris', label: "Blackman harris"},
  {key: 'blackmanNuttall', label: "Blackman nuttall"},
  {key: 'exactBlackman', label: "Exact blackman"},
  {key: 'flatTop', label: "Flat top"},
  {key: 'cosine',  label: "Cosine"},
  {key: 'gaussian', label: "Gaussian"},
  {key: 'tukey',  label: "Tukey"}
];

const FilterOrder = ref<number>(4);
const FilterGain = ref<number>(0);
const FilterCutoff = ref<number>(0.5);
const FilterQuality = ref<number>(0.01);
const trig_1 = ref<boolean>(false);
const trig_2 = ref<boolean>(false);

const filter: Filter = {
  label: "MojFiltr",
  currType: 'IIR',
  filterType: FilterTypes,
  winFunct: "lanczos",
  windovFunc: WindowFunctions,
  winLen: 4,
  trig_draw_1: true,
  trig_draw_2: true,
  signal_1: [{x:0, y:0}],
  signal_2: [{x:0, y:0}],
  winParam: 0.2,
  freqRes: 10000,
  type_iir: "lowpass",
  types_iir: IIRTypes,
  gain: 1,
  cutoff: 0.2,
  quality: 10,
};

const UpdateFiltOrd = (value: number): void => {
  filter.winLen = value; 
  FirFilter();
  trig_1.value = !trig_1.value;
}

const changeSelectedWinFunc = (tip: WindowFunc): void => {
  // Reset length to 1, since some lengths might be missing on certain shapes
  selectedWinFunct.value = tip;
  filter.winFunct = tip;

  FirFilter();
  trig_1.value = !trig_1.value;
}

/*
*   FIR filter - generates transfer function based on window type and order
*/
function FirFilter() {
  const numCoeff = new Array(filter.winLen); //windov koeficients
  let wSum = 0; // sum of coeficients

  /* Generates window weights */
  for (let idx = 0; idx < filter.winLen; idx++) {
    switch (filter.winFunct) {
      case "lanczos": numCoeff[idx] = lanczos(idx, filter.winLen); break;
      case "rectangular": numCoeff[idx] = rectangular(idx, filter.winLen); break;
      case "triangular": numCoeff[idx] = triangular(idx, filter.winLen); break;
      case "bartlett": numCoeff[idx] = bartlett(idx, filter.winLen); break;
      case "bartlettHann": numCoeff[idx] = bartlettHann(idx, filter.winLen); break;
      case "welch": numCoeff[idx] = welch(idx, filter.winLen); break;
      case "hann": numCoeff[idx] = hann(idx, filter.winLen); break;
      case "hamming": numCoeff[idx] = hamming(idx, filter.winLen); break;
      case "blackman": numCoeff[idx] = blackman(idx, filter.winLen); break;
      case "nuttall": numCoeff[idx] = nuttall(idx, filter.winLen); break;
      case "blackmanHarris": numCoeff[idx] = blackmanHarris(idx, filter.winLen); break;
      case "blackmanNuttall": numCoeff[idx] = blackmanNuttall(idx, filter.winLen); break;
      case "exactBlackman": numCoeff[idx] = exactBlackman(idx, filter.winLen); break;
      case "flatTop": numCoeff[idx] = flatTop(idx, filter.winLen); break;
      case "cosine": numCoeff[idx] = cosine(idx, filter.winLen); break;
      case "gaussian": numCoeff[idx] = gaussian(idx, filter.winLen, filter.winParam); break;
      case "tukey": numCoeff[idx] = tukey(idx, filter.winLen, filter.winParam); break;
    }
    wSum = wSum + numCoeff[idx];
  }
  
  /* Divide each weight by total sum to get "b_n" coefficients ("a_n" are zero except 1st equals one) */
  for (let idx = 0; idx < filter.winLen; idx++) {
    numCoeff[idx] = numCoeff[idx] / wSum;
  }

  const freq: number[] = [filter.freqRes];
  const mag: number[] = [filter.freqRes];
  let magMin = 0, magMax = 0;

  /* Generates frequency and magnitude arrays */
  for (let idxa = 0; idxa < filter.freqRes; idxa++) { // describe idxa
      freq[idxa] = idxa * (0.5 / (filter.freqRes + 1));
      let temp = new Complex(numCoeff[0], 0); // komentarji
      let ejw = new Complex(0, 0);
      
      /* numCoeff[0] + numCoeff[1]*exp(-jw) + numCoeff[2]*exp(-2jw) + ... + b[N]*exp(-Njw) */
      for (let idxb = 1; idxb < filter.winLen; idxb++) {
        temp = temp.add(ejw.fromPolar(numCoeff[idxb], -idxb * 2 * Math.PI * freq[idxa]));
      }
      mag[idxa] = gainToDecibels(temp.abs());     // H(jw) = Y(jw) / X(jw)
      freq[idxa] = freq[idxa] * 2;                // correct the scale

      /* Due to notches, some values go towards -Ininity 

      */
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

  for (let idxa = 0; idxa < filter.freqRes; idxa++) {
    filter.signal_1[idxa] = {x:freq[idxa], y:mag[idxa]}
  }    
}
  
// Recalculate modulated values and update modulation key on change
const changeSelectedFilterType = (key: IIR_type): void => {
  selectedFilterType.value = key;
  filter.type_iir = key;
  IirFilter();
  trig_2.value = !trig_2.value;
}

const UpdateFiltGain = (gain: number, cutoff: number, quality: number): void => {
  filter.gain = gain;
  filter.cutoff = cutoff; 
  filter.quality = quality; 
  IirFilter();
  trig_2.value = !trig_2.value;
}

/*
*   IIR filter - generates transfer function based on biquad type, cuttoff, quality, and gain
*/
function IirFilter() {
  // denumerator coefficients are coefficients of transfer function's denumerator
  // numerator coefficients are coefficients of transfer function's numerator 
  let denumCoeff_0, denumCoeff_1, denumCoeff_2, numCoeff_1, numCoeff_2, norm;
  const magGain = Math.pow(10, Math.abs(filter.gain) / 20);  // gain in linear units
  const normFreq = Math.tan(Math.PI * (filter.cutoff / 2));    // f_cutoff as normalized frequency

  switch (filter.type_iir) {
      case "one-pole-lp":
          numCoeff_1 = Math.exp(-2.0 * Math.PI * (filter.cutoff / 2));
          denumCoeff_0 = 1.0 - numCoeff_1;
          numCoeff_1 = -numCoeff_1;
          denumCoeff_1 = denumCoeff_2 = numCoeff_2 = 0;
          break;

      case "one-pole-hp":
          numCoeff_1 = -Math.exp(-2.0 * Math.PI * (0.5 - filter.cutoff / 2));
          denumCoeff_0 = 1.0 + numCoeff_1;
          numCoeff_1 = -numCoeff_1;
          denumCoeff_1 = denumCoeff_2 = numCoeff_2 = 0;
          break;

      case "lowpass":
          norm = 1 / (1 + normFreq / filter.quality + normFreq * normFreq);
          denumCoeff_0 = normFreq * normFreq * norm;
          denumCoeff_1 = 2 * denumCoeff_0;
          denumCoeff_2 = denumCoeff_0;
          numCoeff_1 = 2 * (normFreq * normFreq - 1) * norm;
          numCoeff_2 = (1 - normFreq / filter.quality + normFreq * normFreq) * norm;
          break;

      case "highpass":
          norm = 1 / (1 + normFreq / filter.quality + normFreq * normFreq);
          denumCoeff_0 = 1 * norm;
          denumCoeff_1 = -2 * denumCoeff_0;
          denumCoeff_2 = denumCoeff_0;
          numCoeff_1 = 2 * (normFreq * normFreq - 1) * norm;
          numCoeff_2 = (1 - normFreq / filter.quality + normFreq * normFreq) * norm;
          break;

      case "bandpass":
          norm = 1 / (1 + normFreq / filter.quality + normFreq * normFreq);
          denumCoeff_0 = normFreq / filter.quality * norm;
          denumCoeff_1 = 0;
          denumCoeff_2 = -denumCoeff_0;
          numCoeff_1 = 2 * (normFreq * normFreq - 1) * norm;
          numCoeff_2 = (1 - normFreq / filter.quality + normFreq * normFreq) * norm;
          break;

      case "notch":
          norm = 1 / (1 + normFreq / filter.quality + normFreq * normFreq);
          denumCoeff_0 = (1 + normFreq * normFreq) * norm;
          denumCoeff_1 = 2 * (normFreq * normFreq - 1) * norm;
          denumCoeff_2 = denumCoeff_0;
          numCoeff_1 = denumCoeff_1;
          numCoeff_2 = (1 - normFreq / filter.quality + normFreq * normFreq) * norm;
          break;

      case "peak":
          /* Simplify for positive/negative gains */
          if (filter.gain >= 0) {
              norm = 1 / (1 + 1 / filter.quality * normFreq + normFreq * normFreq);
              denumCoeff_0 = (1 + magGain / filter.quality * normFreq + normFreq * normFreq) * norm;
              denumCoeff_1 = 2 * (normFreq * normFreq - 1) * norm;
              denumCoeff_2 = (1 - magGain / filter.quality * normFreq + normFreq * normFreq) * norm;
              numCoeff_1 = denumCoeff_1;
              numCoeff_2 = (1 - 1 / filter.quality * normFreq + normFreq * normFreq) * norm;
          } else {
              norm = 1 / (1 + magGain / filter.quality * normFreq + normFreq * normFreq);
              denumCoeff_0 = (1 + 1 / filter.quality * normFreq + normFreq * normFreq) * norm;
              denumCoeff_1 = 2 * (normFreq * normFreq - 1) * norm;
              denumCoeff_2 = (1 - 1 / filter.quality * normFreq + normFreq * normFreq) * norm;
              numCoeff_1 = denumCoeff_1;
              numCoeff_2 = (1 - magGain / filter.quality * normFreq + normFreq * normFreq) * norm;
          }
          break;

      case "low-shelf":
          /* Simplify for positive/negative gains */
          if (filter.gain >= 0) {
              norm = 1 / (1 + Math.SQRT2 * normFreq + normFreq * normFreq);
              denumCoeff_0 = (1 + Math.sqrt(2 * magGain) * normFreq + magGain * normFreq * normFreq) * norm;
              denumCoeff_1 = 2 * (magGain * normFreq * normFreq - 1) * norm;
              denumCoeff_2 = (1 - Math.sqrt(2 * magGain) * normFreq + magGain * normFreq * normFreq) * norm;
              numCoeff_1 = 2 * (normFreq * normFreq - 1) * norm;
              numCoeff_2 = (1 - Math.SQRT2 * normFreq + normFreq * normFreq) * norm;
          } else {
              norm = 1 / (1 + Math.sqrt(2 * magGain) * normFreq + magGain * normFreq * normFreq);
              denumCoeff_0 = (1 + Math.SQRT2 * normFreq + normFreq * normFreq) * norm;
              denumCoeff_1 = 2 * (normFreq * normFreq - 1) * norm;
              denumCoeff_2 = (1 - Math.SQRT2 * normFreq + normFreq * normFreq) * norm;
              numCoeff_1 = 2 * (magGain * normFreq * normFreq - 1) * norm;
              numCoeff_2 = (1 - Math.sqrt(2 * magGain) * normFreq + magGain * normFreq * normFreq) * norm;
          }
          break;
      case "high-shelf":
          /* Simplify for positive/negative gains */
          if (filter.gain >= 0) {
              norm = 1 / (1 + Math.SQRT2 * normFreq + normFreq * normFreq);
              denumCoeff_0 = (magGain + Math.sqrt(2 * magGain) * normFreq + normFreq * normFreq) * norm;
              denumCoeff_1 = 2 * (normFreq * normFreq - magGain) * norm;
              denumCoeff_2 = (magGain - Math.sqrt(2 * magGain) * normFreq + normFreq * normFreq) * norm;
              numCoeff_1 = 2 * (normFreq * normFreq - 1) * norm;
              numCoeff_2 = (1 - Math.SQRT2 * normFreq + normFreq * normFreq) * norm;
          } else {
              norm = 1 / (magGain + Math.sqrt(2 * magGain) * normFreq + normFreq * normFreq);
              denumCoeff_0 = (1 + Math.SQRT2 * normFreq + normFreq * normFreq) * norm;
              denumCoeff_1 = 2 * (normFreq * normFreq - 1) * norm;
              denumCoeff_2 = (1 - Math.SQRT2 * normFreq + normFreq * normFreq) * norm;
              numCoeff_1 = 2 * (normFreq * normFreq - magGain) * norm;
              numCoeff_2 = (magGain - Math.sqrt(2 * magGain) * normFreq + normFreq * normFreq) * norm;
          }
          break;
  }

    const freq = Array(filter.freqRes);
    const mag = Array(filter.freqRes);
    let yMin, yMax;

    /* Generates frequency and magnitude arrays */
    for (let idx = 0; idx < filter.freqRes; idx++) {
        freq[idx] = (idx / (filter.freqRes - 1)) * Math.PI;

        /* BiQuad filer transfer function of 2nd order */
        const phi = Math.pow(Math.sin(freq[idx] / 2), 2);
        mag[idx] = Math.log(Math.pow(denumCoeff_0 + denumCoeff_1 + denumCoeff_2, 2) - 4 * (denumCoeff_0 * denumCoeff_1 + 4 * denumCoeff_0 * denumCoeff_2 + denumCoeff_1 * denumCoeff_2) * phi + 16 * denumCoeff_0 * denumCoeff_2 * phi * phi) - Math.log(Math.pow(1 + numCoeff_1 + numCoeff_2, 2) - 4 * (numCoeff_1 + 4 * numCoeff_2 + numCoeff_1 * numCoeff_2) * phi + 16 * numCoeff_2 * phi * phi);
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

const width: number = 1000;

</script>

<template>
  <AppMainContainer>
    <AppMainHeading>
      Digitalni filtri
    </AppMainHeading>
    <AppCollapsible>
      <theory-digital-filters/>
    </AppCollapsible>
    <AppSectionHeading>
      Povprečevalnik (FIR)
    </AppSectionHeading>
    <AppParagraph>
      Predstavljena oblika FIR filtra je ena izmed možnih izvedb tega filtra.
      V osnovi gre za operacijo povprečenja, kjer uteži vzorcev, ki jih povprečimo, določimo s pomočjo danih okenskih funkcij.
      Pomembno je dejstvo, da dolžina okenske funkcije določa red filtra (in obratno).
      Ob izbiranju različnih kombinacij okenskih funkcij in njihovih dolžin hitro ugotovimo, da je takšen filter vedno nizko-prepusten.
      To pa ustreza naravi povprečenja, ki ga izvaja predstavljeni FIR filter.
    </AppParagraph>
    <AppSectionHeading>
      Red filtra:
    </AppSectionHeading>

    <AppParagraph>
      Red FIR filtra določa dolžino okenske funkcije. Le-ta pride do izraza pri večji dolžini okna.
      <br>
      Mejno frekvenco takšnega FIR filtra spreminjamo posredno preko dolžino okenske funkcije, katera določa uteži filtra.
    </AppParagraph>

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
        class="slider_active"
        @change="UpdateFiltOrd(FilterOrder)"
      >
    </div>
    <AppSectionHeading>
      Okenska funkcija
    </AppSectionHeading>
    <AppParagraph>
      Okenska funkcija določa uteži filtra. Z naklonom zvončaste oblike okna prilagajamo prenosno funkcijo sita našim zahtevam.
    </AppParagraph>
    <ButtonContainer>
      <AppButton
        v-for="windov in filter.windovFunc"
        :key="windov.key"
        :active="selectedWindowFunction === windov.key"
        @click="changeSelectedWinFunc(windov.key)"
      >
        {{ windov.label }}
      </AppButton>
    </ButtonContainer>
    <div style="display: flex;">
      <AppSectionHeading>
        Prenosna funkcija povprečevalnega filtra
      </AppSectionHeading>
      <AppSectionHeading style="margin-left: 200px;">
        Okenska funkcija
      </AppSectionHeading>
    </div>
    <div style="display: flex;">
      <AppCanvasContainer>
        <graph
          title="FIR"
          :g_width=600
          :signal_1="filter.signal_1"
          :g_height="350"
          :trig_draw="trig_1"
          :o_x="5"
          :o_y="5"
          @loaded="UpdateFiltOrd(FilterOrder)"
        />
      </AppCanvasContainer>
      <AppCanvasContainer style="margin-left: 100px;">
        <graph
          title="Okenska funkcija"
          :g_width=600
          :signal_1="filter.signal_3"
          :g_height="350"
          :trig_draw="trig_1"
          :o_x="5"
          :o_y="5"
          :Mirror="false"
          X_label="Vzorci[N]                "
          Y_label="Amplituda"
          :Y_label_pos="320"
          @loaded="UpdateFiltOrd(FilterOrder)"
        />
      </AppCanvasContainer>
    </div>

    <AppSectionHeading>
      Biquad (IIR)
    </AppSectionHeading>
    <AppParagraph>
      Podani tipi IIR filtra so znani analogni filtri ("Biquad"), ki jih izvedemo z digitalnim filtrom.
      Sistemske funkcije posameznih tipov se med seboj razlikujejo in jih ne moremo podati v nekakšni splošni obliki,
      kot je to izvedeno za FIR filter na osnovi povprečenja. Zato je tudi red predstavljenih IIR filtrov nespremenljiv (2. red).
      Uteži takšnega IIR filtra določimo tako, da najprej določimo sistemsko funkcijo analogne filtra.
      Koeficienti poleg s-členov analognega filtra predstavljajo uteži <span>a<sub>k</sub></span> in <span>b<sub>k</sub></span> digitalnega
      filtra.
      <br>
      Poleg predstavljenih IIR filtrov obstajajo tudi drugačni. Ena izmed skupin IIR filtrov, kjer imajo posamezne topologije podobne
      lastnosti, zajema sledeče filtre: Butterworth, Chebyshev, Elliptic in Bessel.
    </AppParagraph>

    <AppSectionHeading>
      Mejna frekvenca [pi x rad/sample]:
    </AppSectionHeading>
    <div>
      <AppParagraph>
        Podana je normirana mejna frekvenca, pri čemer vrednost 1 ustreza polovici vzorčevalne frekvence. Normirana mejna frekvenca določa
        prehod med prepusnim in zapornim pasom.

      </AppParagraph>
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
        class="slider_active"
        @change="UpdateFiltGain(FilterGain, FilterCutoff, FilterQuality)"
      >
    </div>

    <!-- Range slider -->
    <AppSectionHeading>
      Ojačenje filtra [dB]:
    </AppSectionHeading>
    <div>
      <AppParagraph>
        Ojačenje vpliva na prepusntni (pozitivno ojačenje) ali zaporni (negativno ojačenje) pas in igra vlogo le pri tipih "Peak",
        "Low-shelf" in "High-shelf".
      </AppParagraph>
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
        class="slider_active"
        y-label="Magnituda [dB]"
        @change="UpdateFiltGain(FilterGain, FilterCutoff, FilterQuality)"
      >
    </div>

    <AppSectionHeading>
      Kvaliteta filtra:
    </AppSectionHeading>
    <div>
      <AppParagraph>
        Kvaliteta določa lastnost resonance, ki se nahaja na mejni frekvenci pri tipih "Notch" in "Peak".
      </AppParagraph>
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
        class="slider_active"
        @change="UpdateFiltGain(FilterGain, FilterCutoff, FilterQuality)"
      >
    </div>

    <AppSectionHeading>
      Tip filtra
    </AppSectionHeading>

    <AppParagraph>
      Podani tipi Biquad filtrov posnemajo karakteristiko znanih analognih filtrov.
    </AppParagraph>

    <ButtonContainer>
      <AppButton
        v-for="windov in filter.types_iir"
        :key="windov.key"
        :active="selectedFilterType === windov.key"
        @click="changeSelectedFilterType(windov.key)"
      >
        {{ windov.label }}
      </AppButton>
    </ButtonContainer>
    <AppSectionHeading>
      Prenosna funkcija Biquad filtra
    </AppSectionHeading>
    <AppCanvasContainer>
      <graph
        title="IIR"
        :g_width="800"
        :signal_1="filter.signal_2"
        :g_height="350"
        :trig_draw="trig_2"
        :o_x="5"
        :o_y="5"
        y-label="Magnituda [dB]"
        @loaded="UpdateFiltGain(FilterGain, FilterCutoff, FilterQuality)"
      />
    </AppCanvasContainer>
  </AppMainContainer>
</template>

<script setup lang="ts">
import {ref} from "vue";
import AppSectionHeading from "@/js/components/common/AppSectionHeading.vue";
import AppMainContainer from "@/js/components/common/AppMainContainer.vue";
import AppParagraph from "@/js/components/common/AppParagraph.vue";
import AppCanvasContainer from "@/js/components/common/AppCanvasContainer.vue";
import TheoryDigitalFilters from "@/js/components/theory/TheoryDigitalFilters.vue";
import ButtonContainer from "@/js/components/common/buttons/AppButtonContainer.vue";
import AppButton from "@/js/components/common/buttons/AppButton.vue";
import AppMainHeading from "@/js/components/common/AppMainHeading.vue";
import AppCollapsible from "@/js/components/common/AppCollapsible.vue";
import Graph from "@/js/components/canvas/DigitalFiltersGraph.vue";
import {
  FilterType,
  WindowFunc,
  IIR_type,
  FiltFunc,
  FiltType,
  IIR_Types
} from "@/js/types/Filters";
import Complex from 'Complex';
import {
  lanczos,
  rectangular,
  triangular,
  bartlett,
  bartlettHann,
  welch,
  hann,
  hamming,
  blackman,
  nuttall,
  blackmanHarris,
  blackmanNuttall,
  exactBlackman,
  flatTop,
  cosine
} from 'window-function';

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
  signal_1: { x: number, y: number }[];
  signal_2: { x: number, y: number }[];
  signal_3: { x: number, y: number }[];

  winParam: number;
  freqRes: number;
  type_iir: IIR_type;
  types_iir: IIR_Types[];
  gain: number;
  cutoff: number;
  quality: number;
}

const selectedWindowFunction = ref<WindowFunc>('rectangular');
const selectedFilterType = ref<IIR_type>('lowpass');

const FilterTypes: FiltType[] = [
  {label: 'FIR', key: 'FIR'},
  {label: 'IIR', key: 'IIR'},
];

const IIRTypes: IIR_Types[] = [
  {key: "lowpass", label: "Nizko-prepustno"},
  {key: "highpass", label: "Visoko-prepustno"},
  {key: "bandpass", label: "Pasovno-prepustno"},
  {key: "one-pole-lp", label: "Enopolni nizko-prepustni"},
  {key: "one-pole-hp", label: "Enopolni visoko-prepustni"},
  {key: "notch", label: "Notch"},
  {key: "peak", label: "Peak"},
  {key: "low-shelf", label: "Low shelf"},
  {key: "high-shelf", label: "High shelf"},
];

// Default pulse length options we give to the users
const WindowFunctions: FiltFunc[] = [
  {key: 'rectangular', label: "Pravokotno"},
  {key: 'triangular', label: "Trikotno"},
  {key: 'cosine', label: "Kosinusno"},
  {key: 'hann', label: "Hann"},
  {key: 'hamming', label: "Hamming"},
  {key: 'blackman', label: "Blackman"},
  {key: 'lanczos', label: "Lanczos"},
  {key: 'bartlett', label: "Bartlett"},
  {key: 'bartlettHann', label: "Bartlett-Hann"},
  {key: 'welch', label: "Welch"},
  {key: 'nuttall', label: "Nuttall"},
  {key: 'blackmanHarris', label: "Blackman-Harris"},
  {key: 'blackmanNuttall', label: "Blackman-Nuttall"},
  {key: 'exactBlackman', label: "Blackman"},
];

const FilterOrder = ref<number>(4);
const FilterGain = ref<number>(0);
const FilterCutoff = ref<number>(0.5);
const FilterQuality = ref<number>(1);
const trig_1 = ref<boolean>(false);
const trig_2 = ref<boolean>(false);

const filter: Filter = {
  label: "MojFiltr",
  currType: 'IIR',
  filterType: FilterTypes,
  winFunct: "rectangular",
  windovFunc: WindowFunctions,
  winLen: 4,
  trig_draw_1: true,
  trig_draw_2: true,
  signal_1: [{x: 0, y: 0}],
  signal_2: [{x: 0, y: 0}],
  signal_3: [{x: 0, y: 0}],
  //winParam: 0.2,
  freqRes: 10000,
  type_iir: "lowpass",
  types_iir: IIRTypes,
  gain: 1,
  cutoff: 0.2,
  quality: 1,
};

const UpdateFiltOrd = (value: number): void => {
  filter.winLen = value;
  FirFilter();
  trig_1.value = !trig_1.value;
}

const changeSelectedWinFunc = (tip: WindowFunc): void => {
  // Reset length to 1, since some lengths might be missing on certain shapes
  selectedWindowFunction.value = tip;
  filter.winFunct = tip;

  FirFilter();
  trig_1.value = !trig_1.value;
}

// FIR filter - generates transfer function based on window type and order
function FirFilter() {
  const numCoeff = new Array(filter.winLen); //window coefficients
  let wSum = 0; // sum of coeficients

  /* Generates window weights */
  for (let idx = 0; idx < filter.winLen; idx++) {
    switch (filter.winFunct) {
      case "lanczos":
        numCoeff[idx] = lanczos(idx, filter.winLen);
        break;
      case "rectangular":
        numCoeff[idx] = rectangular(idx, filter.winLen);
        break;
      case "triangular":
        numCoeff[idx] = triangular(idx, filter.winLen);
        break;
      case "bartlett":
        numCoeff[idx] = bartlett(idx, filter.winLen);
        break;
      case "bartlettHann":
        numCoeff[idx] = bartlettHann(idx, filter.winLen);
        break;
      case "welch":
        numCoeff[idx] = welch(idx, filter.winLen);
        break;
      case "hann":
        numCoeff[idx] = hann(idx, filter.winLen);
        break;
      case "hamming":
        numCoeff[idx] = hamming(idx, filter.winLen);
        break;
      case "blackman":
        numCoeff[idx] = blackman(idx, filter.winLen);
        break;
      case "nuttall":
        numCoeff[idx] = nuttall(idx, filter.winLen);
        break;
      case "blackmanHarris":
        numCoeff[idx] = blackmanHarris(idx, filter.winLen);
        break;
      case "blackmanNuttall":
        numCoeff[idx] = blackmanNuttall(idx, filter.winLen);
        break;
      case "exactBlackman":
        numCoeff[idx] = exactBlackman(idx, filter.winLen);
        break;
      case "flatTop":
        numCoeff[idx] = flatTop(idx, filter.winLen);
        break;
      case "cosine":
        numCoeff[idx] = cosine(idx, filter.winLen);
        break;
    }
    wSum = wSum + numCoeff[idx];
  }

  /* Divide each weight by total sum to get "b_n" coefficients ("a_n" are zero except 1st equals one) */
  while (filter.signal_3.length > 0) {
    filter.signal_3.pop();
  }
  if (filter.winFunct == "rectangular") {
    filter.signal_3.push({x: 0, y: 0});
    for (let idx = 0; idx < filter.winLen; idx++) {
      filter.signal_3.push({x: idx, y: numCoeff[idx]});  // Copy window function plot data into "filter" object
      numCoeff[idx] = numCoeff[idx] / wSum;
    }
    filter.signal_3.push({x: filter.winLen - 1, y: 0});
  } else {
    for (let idx = 0; idx < filter.winLen; idx++) {
      filter.signal_3[idx] = {x: idx, y: numCoeff[idx]};  // Copy window function plot data into "filter" object
      numCoeff[idx] = numCoeff[idx] / wSum;
    }
  }

  const freq: number[] = [filter.freqRes];
  const mag: number[] = [filter.freqRes];
  let magMin = 0, magMax = 0;

  /* Generates frequency and magnitude arrays */
  for (let idxa = 0; idxa < filter.freqRes; idxa++) { // describe idxa
    freq[idxa] = idxa * (0.5 / (filter.freqRes + 1));
    let temp = new Complex(numCoeff[0], 0); // komentarji
    const ejw = new Complex(0, 0);

    /* numCoeff[0] + numCoeff[1]*exp(-jw) + numCoeff[2]*exp(-2jw) + ... + b[N]*exp(-Njw) */
    for (let idxb = 1; idxb < filter.winLen; idxb++) {
      temp = temp.add(ejw.fromPolar(numCoeff[idxb], -idxb * 2 * Math.PI * freq[idxa]));
    }
    mag[idxa] = gainToDecibels(temp.abs());     // H(jw) = Y(jw) / X(jw)
    freq[idxa] = freq[idxa] * 2;                // correct the scale

    /* Due to notches, some values go towards -Infinity */
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
    }
  }

  /* Copy transfer function plot data into "filter" object */
  for (let idx = 0; idx < filter.freqRes; idx++) {
    filter.signal_1[idx] = {x: freq[idx], y: mag[idx]}
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

// IIR filter - generates transfer function based on biquad type, cutoff, quality, and gain
function IirFilter() {
  // Denumerator coefficients are coefficients of transfer function's denumerator
  // Numerator coefficients are coefficients of transfer function's numerator
  let denumCoeff_0, denumCoeff_1, denumCoeff_2, numCoeff_1, numCoeff_2, norm;
  const magGain = Math.pow(10, Math.abs(filter.gain) / 20);  // gain in linear units
  const normFreq = Math.tan(Math.PI * (filter.cutoff / 2));    // f_cutoff as normalized frequency

  let slider_gain = document.getElementById("filter-gain");
  let slider_quality = document.getElementById("filter-quality");

  switch (filter.type_iir) {
    case "one-pole-lp":
      numCoeff_1 = Math.exp(-2.0 * Math.PI * (filter.cutoff / 2));
      denumCoeff_0 = 1.0 - numCoeff_1;
      numCoeff_1 = -numCoeff_1;
      denumCoeff_1 = denumCoeff_2 = numCoeff_2 = 0;
      slider_gain.setAttribute("class", "slider_inactive");
      slider_gain.disabled = true;
      slider_quality.setAttribute("class", "slider_inactive");
      slider_quality.disabled = true;
      break;

    case "one-pole-hp":
      numCoeff_1 = -Math.exp(-2.0 * Math.PI * (0.5 - filter.cutoff / 2));
      denumCoeff_0 = 1.0 + numCoeff_1;
      numCoeff_1 = -numCoeff_1;
      denumCoeff_1 = denumCoeff_2 = numCoeff_2 = 0;
      slider_gain.setAttribute("class", "slider_inactive");
      slider_gain.disabled = true;
      slider_quality.setAttribute("class", "slider_inactive");
      slider_quality.disabled = true;
      break;

    case "lowpass":
      filter.quality = 1; // Default setting - values above 1 cause undesired resonance
      norm = 1 / (1 + normFreq / filter.quality + normFreq * normFreq);
      denumCoeff_0 = normFreq * normFreq * norm;
      denumCoeff_1 = 2 * denumCoeff_0;
      denumCoeff_2 = denumCoeff_0;
      numCoeff_1 = 2 * (normFreq * normFreq - 1) * norm;
      numCoeff_2 = (1 - normFreq / filter.quality + normFreq * normFreq) * norm;
      slider_gain.setAttribute("class", "slider_inactive");
      slider_gain.disabled = true;
      slider_quality.setAttribute("class", "slider_inactive");
      slider_quality.disabled = true;
      break;

    case "highpass":
      filter.quality = 1; // Default setting - values above 1 cause undesired resonance
      norm = 1 / (1 + normFreq / filter.quality + normFreq * normFreq);
      denumCoeff_0 = norm;
      denumCoeff_1 = -2 * denumCoeff_0;
      denumCoeff_2 = denumCoeff_0;
      numCoeff_1 = 2 * (normFreq * normFreq - 1) * norm;
      numCoeff_2 = (1 - normFreq / filter.quality + normFreq * normFreq) * norm;
      slider_gain.setAttribute("class", "slider_inactive");
      slider_gain.disabled = true;
      slider_quality.setAttribute("class", "slider_inactive");
      slider_quality.disabled = true;
      break;

    case "bandpass":
      filter.quality = 1; // Default setting - values above 1 cause undesired resonance
      norm = 1 / (1 + normFreq / filter.quality + normFreq * normFreq);
      denumCoeff_0 = normFreq / filter.quality * norm;
      denumCoeff_1 = 0;
      denumCoeff_2 = -denumCoeff_0;
      numCoeff_1 = 2 * (normFreq * normFreq - 1) * norm;
      numCoeff_2 = (1 - normFreq / filter.quality + normFreq * normFreq) * norm;
      slider_gain.setAttribute("class", "slider_inactive");
      slider_gain.disabled = true;
      slider_quality.setAttribute("class", "slider_inactive");
      slider_quality.disabled = true;
      break;

    case "notch":
      norm = 1 / (1 + normFreq / filter.quality + normFreq * normFreq);
      denumCoeff_0 = (1 + normFreq * normFreq) * norm;
      denumCoeff_1 = 2 * (normFreq * normFreq - 1) * norm;
      denumCoeff_2 = denumCoeff_0;
      numCoeff_1 = denumCoeff_1;
      numCoeff_2 = (1 - normFreq / filter.quality + normFreq * normFreq) * norm;
      slider_gain.setAttribute("class", "slider_inactive");
      slider_gain.disabled = true;
      slider_quality.setAttribute("class", "slider_active");
      slider_quality.disabled = false;
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
      slider_gain.setAttribute("class", "slider_active");
      slider_gain.disabled = false;
      slider_quality.setAttribute("class", "slider_active");
      slider_quality.disabled = false;
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
      slider_gain.setAttribute("class", "slider_active");
      slider_gain.disabled = false;
      slider_quality.setAttribute("class", "slider_inactive");
      slider_quality.disabled = true;
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
      slider_gain.setAttribute("class", "slider_active");
      slider_gain.disabled = false;
      slider_quality.setAttribute("class", "slider_inactive");
      slider_quality.disabled = true;
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
    }
    freq[idx] = idx / (filter.freqRes - 1);
  }

  /* Copy transfer function plot data into "filter" object */
  for (let idx = 0; idx < filter.freqRes; idx++) {
    filter.signal_2[idx] = {x: freq[idx], y: mag[idx]}
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
      }
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

</script>

<style scoped>

.slider_active {
  -webkit-appearance: none; /* Override default CSS styles */
  appearance: none;
  width: 300px; /* Full-width */
  height: 10px; /* Specified height */
  background: #ffffff; /* Grey background */
  outline: none; /* Remove outline */
  opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
  -webkit-transition: .2s; /* 0.2 seconds transition on hover */
  transition: opacity .2s;
}

.slider_active::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: #5cc3ff;
  border-radius: 50%;
  cursor: pointer;
}

.slider_inactive {
  -webkit-appearance: none; /* Override default CSS styles */
  appearance: none;
  width: 300px; /* Full-width */
  height: 10px; /* Specified height */
  background: #5c5c5c; /* Grey background */
  outline: none; /* Remove outline */
  opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
  -webkit-transition: .2s; /* 0.2 seconds transition on hover */
  transition: opacity .2s;
}

.slider_inactive::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: #444444;
  border-radius: 50%;
  cursor: pointer;
}
</style>
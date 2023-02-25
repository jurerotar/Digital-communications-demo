<template>
  <AppMainContainer>
    <AppMainHeading>
      Digitalni filtri
    </AppMainHeading>
    <AppCollapsible>
      <theory-digital-filters />
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
      Red filtra
    </AppSectionHeading>

    <AppParagraph>
      Red FIR filtra določa dolžino okenske funkcije. Le-ta pride do izraza pri večji dolžini okna.
      <br>
      Mejno frekvenco takšnega FIR filtra spreminjamo posredno preko dolžino okenske funkcije, katera določa uteži filtra.
    </AppParagraph>
    <AppSlider
      id="filter-order"
      v-model.number="FIRFilterOrder"
      :label="`Red: ${FIRFilterOrder.toString()}`"
      :min="4"
      :max="100"
      :step="1"
    />
    <AppSectionHeading>
      Okenska funkcija
    </AppSectionHeading>
    <AppParagraph>
      Okenska funkcija določa uteži filtra. Z naklonom zvončaste oblike okna prilagajamo prenosno funkcijo sita našim zahtevam.
    </AppParagraph>
    <ButtonContainer>
      <AppButton
        v-for="currentFIRFilter in availableFIRFilters"
        :key="currentFIRFilter.key"
        :active="selectedFIRFilterType === currentFIRFilter.key"
        @click="selectFIRFilterType(currentFIRFilter.key)"
      >
        {{ currentFIRFilter.label }}
      </AppButton>
    </ButtonContainer>
    <div class="flex flex-col lg:flex-row gap-8">
      <div class="flex flex-col flex-1 gap-4">
        <AppSectionHeading>
          Prenosna funkcija povprečevalnega filtra
        </AppSectionHeading>
        <AppCanvasContainer>
          <DigitalFiltersGraph
            :data="FIRFilterTransferFunctionSignalValues"
            :mirror="true"
            y-axis-label="Magnituda[dB]"
            x-axis-label="Normalizirana frekvenca"
            canvas-id="cID"
          />
        </AppCanvasContainer>
      </div>
      <div class="flex flex-col flex-1 gap-4">
        <AppSectionHeading>
          Okenska funkcija
        </AppSectionHeading>
        <AppCanvasContainer>
          <DigitalFiltersGraph
            :data="FIRFilterWindowFunctionSignalValues"
            :mirror="false"
            y-axis-label="Amplituda"
            x-axis-label="Vzorci[N]"
            canvas-id="cid"
          />
        </AppCanvasContainer>
      </div>
    </div>

    <AppSectionHeading>
      Biquad (IIR)
    </AppSectionHeading>
    <AppParagraph>
      Podani tipi IIR filtra so znani analogni filtri ("Biquad"), ki jih izvedemo z digitalnim filtrom.
      Sistemske funkcije posameznih tipov se med seboj razlikujejo in jih ne moremo podati v nekakšni splošni obliki,
      kot je to izvedeno za FIR filter na osnovi povprečenja. Zato je tudi red predstavljenih IIR filtrov nespremenljiv (2. red).
      Uteži takšnega IIR filtra določimo tako, da najprej določimo sistemsko funkcijo analogne filtra.
      Koeficienti poleg s-členov analognega filtra predstavljajo uteži
      <KatexEquation inline>
        {{ 'a_k' }}
      </KatexEquation>
      in
      <KatexEquation inline>
        {{ 'b_k' }}
      </KatexEquation>
      digitalnega filtra.
      <br>
      Poleg predstavljenih IIR filtrov obstajajo tudi drugačni. Ena izmed skupin IIR filtrov, kjer imajo posamezne topologije podobne
      lastnosti, zajema sledeče filtre: Butterworth, Chebyshev, Elliptic in Bessel.
    </AppParagraph>

    <AppSectionHeading>
      Mejna frekvenca [pi x rad/sample]
    </AppSectionHeading>
    <AppParagraph>
      Podana je normirana mejna frekvenca, pri čemer vrednost 1 ustreza polovici vzorčevalne frekvence.
      Normirana mejna frekvenca določa prehod med prepusnim in zapornim pasom.
    </AppParagraph>

    <AppSlider
      id="filter-cutoff"
      v-model.number="IIRFilterCutoff"
      :label="`Mejna frekvenca: ${IIRFilterCutoff.toString()}`"
      :min="0.01"
      :max="0.99"
      :step="0.01"
    />

    <AppSectionHeading>
      Ojačenje filtra [dB]
    </AppSectionHeading>
    <AppParagraph>
      Ojačenje vpliva na prepustni (pozitivno ojačenje) ali zaporni (negativno ojačenje) pas in igra vlogo le pri tipih "Peak",
      "Low-shelf" in "High-shelf".
    </AppParagraph>

    <AppSlider
      id="filter-gain"
      v-model.number="IIRFilterGain"
      :label="`Ojačenje filtra: ${IIRFilterGain.toString()}`"
      :min="-30"
      :max="30"
      :step="1"
      :disabled="!isFilterGainSliderEnabled"
    />

    <AppSectionHeading>
      Kvaliteta filtra
    </AppSectionHeading>
    <AppParagraph>
      Kvaliteta določa lastnost resonance, ki se nahaja na mejni frekvenci pri tipih "Notch" in "Peak".
    </AppParagraph>

    <AppSlider
      id="filter-quality"
      v-model.number="IIRFilterQuality"
      :label="`Kvaliteta filtra: ${Math.round(IIRFilterQuality).toString()}`"
      :min="0.1"
      :max="20.1"
      :step="0.1"
      :disabled="!isFilterQualitySliderEnabled"
    />

    <AppSectionHeading>
      Tip filtra
    </AppSectionHeading>

    <AppParagraph>
      Podani tipi Biquad filtrov posnemajo karakteristiko znanih analognih filtrov.
    </AppParagraph>

    <ButtonContainer>
      <AppButton
        v-for="currentIIRFilter in availableIIRFilters"
        :key="currentIIRFilter.key"
        :active="selectedIIRFilterType === currentIIRFilter.key"
        @click="selectIIRFilterType(currentIIRFilter.key)"
      >
        {{ currentIIRFilter.label }}
      </AppButton>
    </ButtonContainer>
    <AppSectionHeading>
      Prenosna funkcija Biquad filtra
    </AppSectionHeading>
    <AppCanvasContainer>
      <DigitalFiltersGraph
        :data="IIRFilterTransferFunctionSignalValues"
        :mirror="true"
        y-axis-label="Magnituda[dB]"
        x-axis-label="Normalizirana frekvenca"
        canvas-id="cIR"
      />
    </AppCanvasContainer>
  </AppMainContainer>
</template>

<script setup lang="ts">
import {computed, ref, watch} from "vue";
import AppSectionHeading from "@components/common/AppSectionHeading.vue";
import AppMainContainer from "@components/common/AppMainContainer.vue";
import AppParagraph from "@components/common/AppParagraph.vue";
import AppCanvasContainer from "@components/common/AppCanvasContainer.vue";
import TheoryDigitalFilters from "@components/theory/TheoryDigitalFilters.vue";
import ButtonContainer from "@components/common/buttons/AppButtonContainer.vue";
import AppButton from "@components/common/buttons/AppButton.vue";
import AppMainHeading from "@components/common/AppMainHeading.vue";
import AppCollapsible from "@components/common/AppCollapsible.vue";
import DigitalFiltersGraph from "@components/canvas/DigitalFiltersGraph.vue";
import KatexEquation from "@components/common/KatexEquation.vue";
import AppSlider from "@components/common/AppSlider.vue";
import {FIRFilter, IIRFilter} from "@types/digital-filters";
import Complex from 'Complex';
import {
  bartlett,
  bartlettHann,
  blackman,
  blackmanHarris,
  blackmanNuttall,
  cosine,
  exactBlackman,
  flatTop,
  hamming,
  hann,
  lanczos,
  nuttall,
  rectangular,
  triangular,
  welch
} from 'window-function';
import {Coordinates} from "@interfaces/common";

type AvailableFilter<T> = {
  key: T;
  label: string;
}

type WindowWeightCalculationReturn = {
  windowWeightCoefficients: number[],
  sumOfWindowWeightCoefficients: number;
}

// Graph points to show
const RESOLUTION = 1000;

const gainToDecibels = (value: number): number => {
  if (value == null) {
    return 0;
  }
  return 20 * (0.43429 * Math.log(value));
}

const calculateWindowWeights = (selectedFIRFilterType: FIRFilter, FIRFilterOrder: number): WindowWeightCalculationReturn => {
  const windowWeightCoefficients = new Array(FIRFilterOrder);
  for (let idx = 0; idx < FIRFilterOrder; idx++) {
    switch (selectedFIRFilterType) {
      case "lanczos":
        windowWeightCoefficients[idx] = lanczos(idx, FIRFilterOrder);
        break;
      case "rectangular":
        windowWeightCoefficients[idx] = rectangular(idx, FIRFilterOrder);
        break;
      case "triangular":
        windowWeightCoefficients[idx] = triangular(idx, FIRFilterOrder);
        break;
      case "bartlett":
        windowWeightCoefficients[idx] = bartlett(idx, FIRFilterOrder);
        break;
      case "bartlettHann":
        windowWeightCoefficients[idx] = bartlettHann(idx, FIRFilterOrder);
        break;
      case "welch":
        windowWeightCoefficients[idx] = welch(idx, FIRFilterOrder);
        break;
      case "hann":
        windowWeightCoefficients[idx] = hann(idx, FIRFilterOrder);
        break;
      case "hamming":
        windowWeightCoefficients[idx] = hamming(idx, FIRFilterOrder);
        break;
      case "blackman":
        windowWeightCoefficients[idx] = blackman(idx, FIRFilterOrder);
        break;
      case "nuttall":
        windowWeightCoefficients[idx] = nuttall(idx, FIRFilterOrder);
        break;
      case "blackmanHarris":
        windowWeightCoefficients[idx] = blackmanHarris(idx, FIRFilterOrder);
        break;
      case "blackmanNuttall":
        windowWeightCoefficients[idx] = blackmanNuttall(idx, FIRFilterOrder);
        break;
      case "exactBlackman":
        windowWeightCoefficients[idx] = exactBlackman(idx, FIRFilterOrder);
        break;
      case "flatTop":
        windowWeightCoefficients[idx] = flatTop(idx, FIRFilterOrder);
        break;
      case "cosine":
        windowWeightCoefficients[idx] = cosine(idx, FIRFilterOrder);
        break;
    }
  }

  const sumOfWindowWeightCoefficients = windowWeightCoefficients.reduce((currentElement: number, accumulator: number) => {
    return currentElement + accumulator;
  }, 0);

  return {
    windowWeightCoefficients,
    sumOfWindowWeightCoefficients
  };
}

// FIR
const availableFIRFilters: AvailableFilter<FIRFilter>[] = [
  {key: 'rectangular', label: "Pravokotno"},
  {key: 'triangular', label: "Trikotno"},
  {key: 'cosine', label: "Kosinusno"},
  {key: 'hann', label: "Hann"},
  {key: 'hamming', label: "Hamming"},
  {key: 'lanczos', label: "Lanczos"},
  {key: 'bartlett', label: "Bartlett"},
  {key: 'bartlettHann', label: "Bartlett-Hann"},
  {key: 'welch', label: "Welch"},
  {key: 'nuttall', label: "Nuttall"},
  {key: 'blackman', label: "Blackman"},
  {key: 'blackmanHarris', label: "Blackman-Harris"},
  {key: 'blackmanNuttall', label: "Blackman-Nuttall"},
  {key: 'exactBlackman', label: "Exact Blackman"},
];

const selectedFIRFilterType = ref<FIRFilter>('rectangular');

const selectFIRFilterType = (key: FIRFilter): void => {
  selectedFIRFilterType.value = key;
}

const FIRFilterOrder = ref<number>(4);

const FIRFilterWindowFunctionSignalValues = computed<Coordinates[]>(() => {
  const {windowWeightCoefficients} = calculateWindowWeights(selectedFIRFilterType.value, FIRFilterOrder.value);

  const xValues = [...new Array(FIRFilterOrder.value).keys()];

  const chartValues = xValues.map((el, index) => ({
    x: el,
    y: windowWeightCoefficients[index]
  }));

  // Push values to start and end if selected type is rectangular
  if (selectedFIRFilterType.value === 'rectangular') {
    return [{x: 0, y: 0}, ...chartValues, {x: FIRFilterOrder.value - 1, y: 0}];
  }

  return chartValues;
});

const FIRFilterTransferFunctionSignalValues = computed<Coordinates[]>(() => {
  const {
    windowWeightCoefficients,
    sumOfWindowWeightCoefficients
  } = calculateWindowWeights(selectedFIRFilterType.value, FIRFilterOrder.value);

  const dividedWindowWeightCoefficients = windowWeightCoefficients.map((el: number) => el / sumOfWindowWeightCoefficients);

  // x-axis values
  const frequencies: number[] = new Array(RESOLUTION);
  // y-axis values
  const magnitudes: number[] = new Array(RESOLUTION);

  const ejw = new Complex(0, 0);

  /* Generates frequency and magnitude arrays */
  for (let idxa = 0; idxa < RESOLUTION; idxa++) {
    frequencies[idxa] = idxa * (0.5 / (RESOLUTION + 1));
    let temp = new Complex(dividedWindowWeightCoefficients[0], 0);

    /* dividedWindowWeightCoefficients[0] + dividedWindowWeightCoefficients[1]*exp(-jw) + dividedWindowWeightCoefficients[2]*exp(-2jw) + ... + b[N]*exp(-Njw) */
    for (let idxb = 1; idxb < FIRFilterOrder.value; idxb++) {
      temp = temp.add(ejw.fromPolar(dividedWindowWeightCoefficients[idxb], -idxb * 2 * Math.PI * frequencies[idxa]));
    }

    // H(jw) = Y(jw) / X(jw)
    magnitudes[idxa] = gainToDecibels(temp.abs());

    // Correct the scale
    frequencies[idxa] = frequencies[idxa] * 2;

    if (magnitudes[idxa] <= -200) {
      magnitudes[idxa] = -200;
    }
  }

  return frequencies.map((el, index) => ({
    x: el,
    y: magnitudes[index]
  }));
});

// IIR
const availableIIRFilters: AvailableFilter<IIRFilter>[] = [
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

const IIR_FILTER_GAIN_DEFAULT_VALUE: number = 0.5;
const IIR_FILTER_QUALITY_DEFAULT_VALUE: number = 1;

const selectedIIRFilterType = ref<IIRFilter>('lowpass');

const selectIIRFilterType = (key: IIRFilter): void => {
  selectedIIRFilterType.value = key;
}

const IIRFilterCutoff = ref<number>(0.5);
const IIRFilterGain = ref<number>(IIR_FILTER_GAIN_DEFAULT_VALUE);
const IIRFilterQuality = ref<number>(IIR_FILTER_QUALITY_DEFAULT_VALUE);

watch(selectedIIRFilterType, () => {
  IIRFilterGain.value = IIR_FILTER_GAIN_DEFAULT_VALUE;
  IIRFilterQuality.value = IIR_FILTER_QUALITY_DEFAULT_VALUE;
});

const isFilterGainSliderEnabled = computed<boolean>(() => {
  const IIRFilterTypesWhereSliderIsEnabled: IIRFilter[] = ['peak', 'low-shelf', 'high-shelf'];
  return IIRFilterTypesWhereSliderIsEnabled.includes(selectedIIRFilterType.value);
});

const isFilterQualitySliderEnabled = computed<boolean>(() => {
  const IIRFilterTypesWhereSliderIsEnabled: IIRFilter[] = ['peak', 'notch'];
  return IIRFilterTypesWhereSliderIsEnabled.includes(selectedIIRFilterType.value);
});

const calculateIIRCoefficients = (selectedIIRFilterType: IIRFilter): number[] => {
  // Denumerator coefficients are coefficients of transfer function's denumerator
  // Numerator coefficients are coefficients of transfer function's numerator
  let denumCoeff_0, denumCoeff_1, denumCoeff_2, numCoeff_1, numCoeff_2, norm;
  const magGain = Math.pow(10, Math.abs(IIRFilterGain.value) / 20); // gain in linear units
  const normFreq = Math.tan(Math.PI * (IIRFilterCutoff.value / 2)); // f_cutoff as normalized frequency

  switch (selectedIIRFilterType) {
    case "one-pole-lp":
      numCoeff_1 = Math.exp(-2.0 * Math.PI * (IIRFilterCutoff.value / 2));
      denumCoeff_0 = 1.0 - numCoeff_1;
      numCoeff_1 = -numCoeff_1;
      denumCoeff_1 = denumCoeff_2 = numCoeff_2 = 0;
      break;
    case "one-pole-hp":
      numCoeff_1 = -Math.exp(-2.0 * Math.PI * (0.5 - IIRFilterCutoff.value / 2));
      denumCoeff_0 = 1.0 + numCoeff_1;
      numCoeff_1 = -numCoeff_1;
      denumCoeff_1 = denumCoeff_2 = numCoeff_2 = 0;
      break;
    case "lowpass":
      IIRFilterQuality.value = 1; // Default setting - values above 1 cause undesired resonance
      norm = 1 / (1 + normFreq / IIRFilterQuality.value + normFreq * normFreq);
      denumCoeff_0 = normFreq * normFreq * norm;
      denumCoeff_1 = 2 * denumCoeff_0;
      denumCoeff_2 = denumCoeff_0;
      numCoeff_1 = 2 * (normFreq * normFreq - 1) * norm;
      numCoeff_2 = (1 - normFreq / IIRFilterQuality.value + normFreq * normFreq) * norm;
      break;
    case "highpass":
      IIRFilterQuality.value = 1; // Default setting - values above 1 cause undesired resonance
      norm = 1 / (1 + normFreq / IIRFilterQuality.value + normFreq * normFreq);
      denumCoeff_0 = norm;
      denumCoeff_1 = -2 * denumCoeff_0;
      denumCoeff_2 = denumCoeff_0;
      numCoeff_1 = 2 * (normFreq * normFreq - 1) * norm;
      numCoeff_2 = (1 - normFreq / IIRFilterQuality.value + normFreq * normFreq) * norm;
      break;
    case "bandpass":
      IIRFilterQuality.value = 1; // Default setting - values above 1 cause undesired resonance
      norm = 1 / (1 + normFreq / IIRFilterQuality.value + normFreq * normFreq);
      denumCoeff_0 = normFreq / IIRFilterQuality.value * norm;
      denumCoeff_1 = 0;
      denumCoeff_2 = -denumCoeff_0;
      numCoeff_1 = 2 * (normFreq * normFreq - 1) * norm;
      numCoeff_2 = (1 - normFreq / IIRFilterQuality.value + normFreq * normFreq) * norm;
      break;
    case "notch":
      norm = 1 / (1 + normFreq / IIRFilterQuality.value + normFreq * normFreq);
      denumCoeff_0 = (1 + normFreq * normFreq) * norm;
      denumCoeff_1 = 2 * (normFreq * normFreq - 1) * norm;
      denumCoeff_2 = denumCoeff_0;
      numCoeff_1 = denumCoeff_1;
      numCoeff_2 = (1 - normFreq / IIRFilterQuality.value + normFreq * normFreq) * norm;
      break;
    case "peak":
      /* Simplify for positive/negative gains */
      if (IIRFilterGain.value >= 0) {
        norm = 1 / (1 + 1 / IIRFilterQuality.value * normFreq + normFreq * normFreq);
        denumCoeff_0 = (1 + magGain / IIRFilterQuality.value * normFreq + normFreq * normFreq) * norm;
        denumCoeff_1 = 2 * (normFreq * normFreq - 1) * norm;
        denumCoeff_2 = (1 - magGain / IIRFilterQuality.value * normFreq + normFreq * normFreq) * norm;
        numCoeff_1 = denumCoeff_1;
        numCoeff_2 = (1 - 1 / IIRFilterQuality.value * normFreq + normFreq * normFreq) * norm;
      } else {
        norm = 1 / (1 + magGain / IIRFilterQuality.value * normFreq + normFreq * normFreq);
        denumCoeff_0 = (1 + 1 / IIRFilterQuality.value * normFreq + normFreq * normFreq) * norm;
        denumCoeff_1 = 2 * (normFreq * normFreq - 1) * norm;
        denumCoeff_2 = (1 - 1 / IIRFilterQuality.value * normFreq + normFreq * normFreq) * norm;
        numCoeff_1 = denumCoeff_1;
        numCoeff_2 = (1 - magGain / IIRFilterQuality.value * normFreq + normFreq * normFreq) * norm;
      }
      break;
    case "low-shelf":
      /* Simplify for positive/negative gains */
      if (IIRFilterGain.value >= 0) {
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
      if (IIRFilterGain.value >= 0) {
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
  return [denumCoeff_0, denumCoeff_1, denumCoeff_2, numCoeff_1, numCoeff_2]
}

// IIR filter - generates transfer function based on biquad type, cutoff, quality, and gain
const IIRFilterTransferFunctionSignalValues = computed<Coordinates[]>(() => {
  const [denumCoeff_0, denumCoeff_1, denumCoeff_2, numCoeff_1, numCoeff_2] = calculateIIRCoefficients(selectedIIRFilterType.value)
  const freq: number[] = new Array(RESOLUTION);
  const mag: number[] = new Array(RESOLUTION);

  /* Generates frequency and magnitude arrays */
  for (let idx = 0; idx < RESOLUTION; idx++) {
    freq[idx] = (idx / (RESOLUTION - 1)) * Math.PI;

    /* BiQuad filer transfer function of 2nd order */
    const phi = Math.pow(Math.sin(freq[idx] / 2), 2);
    mag[idx] =
      Math.log(Math.pow(denumCoeff_0 + denumCoeff_1 + denumCoeff_2, 2) - 4 *
        (denumCoeff_0 * denumCoeff_1 + 4 * denumCoeff_0 * denumCoeff_2 + denumCoeff_1 * denumCoeff_2) *
        phi + 16 * denumCoeff_0 * denumCoeff_2 * phi * phi) -
      Math.log(Math.pow(1 + numCoeff_1 + numCoeff_2, 2) - 4 *
        (numCoeff_1 + 4 * numCoeff_2 + numCoeff_1 * numCoeff_2) *
        phi + 16 * numCoeff_2 * phi * phi);

    mag[idx] = mag[idx] * 10 / Math.LN10;

    /* Due to notches, some values go towards -Ininity */
    if ((mag[idx] == -Infinity) || (mag[idx] <= -200)) {
      mag[idx] = -200;
    }

    freq[idx] = idx / (RESOLUTION - 1);
  }

  return freq.map((el, index) => ({
    x: el,
    y: mag[index]
  }));
});

</script>
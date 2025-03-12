<template>
  <AppMainContainer>
    <AppMainHeading>Korelacijska Funkcija</AppMainHeading>
    <AppCollapsible>
      <CorrelationTheory />
    </AppCollapsible>
    <AppSectionHeading>Izbira tipa signalov:</AppSectionHeading>
    <AppButtonContainer>
      <AppButton
        v-for="signal in signals"
        :key="signal.label"
        :active="signal.label === signalType"
        @click="changeSignalType(signal.label)"
      >
        {{ signal.label }}
      </AppButton>
    </AppButtonContainer>

    <template v-if="signalType === 'Harmonični'">
      <AppSectionHeading>Izbira frekvence drugega signala:</AppSectionHeading>
      <AppButtonContainer>
        <AppButton
          v-for="signal in signals[0].signal"
          :key="signal.key"
          :active="choosedSecondSignal === signal.key"
          @click="changeSignal(signal.key, 'harmonični')"
        >
          {{ signal.label }}
        </AppButton>
      </AppButtonContainer>
      <AppSectionHeading>Izbira frekvence drugega signala:</AppSectionHeading>
      <AppButtonContainer>
        <AppButton
          v-for="frequency in signals[0].frequencyRange"
          :key="frequency"
          :active="signals[0].frequency === frequency"
          @click="changeFrequency(frequency)"
        >
          {{ frequency }}
        </AppButton>
      </AppButtonContainer>
      <!-- Slider -->
      <div class="inline-flex flex-col w-fit gap-4">
        <label
          :for="'tau'"
          class="font-semibold text-xl transition-colors duration-300 dark:text-white"
        >
          Časovni zamik drugega signala
          <span class="font-semibold text-2xl">τ</span>
          :
          <span class="font-medium">{{ tau }}</span>
        </label>
        <input
          :id="'tau'"
          v-model.number="tau"
          type="range"
          min="-1"
          max="1"
          step="0.1"
          @change="updateTau(tau)"
        />
      </div>
      <FullSignalGraph
        :canvas-id="'first-signal'"
        :data="canvasInputFirst"
        :title="'Prvi Signal'"
        :vertical-pool="[1, 0.5, -0.5, -1]"
        :horizontal-pool="horizontal_pool"
        :type="choosedFirstSignal"
        :y-axis-label="'x(t)'"
      />
      <FullSignalGraph
        :canvas-id="'second-signal'"
        :data="canvasInputSecond"
        :title="'Drugi Signal'"
        :vertical-pool="[1, 0.5, -0.5, -1]"
        :horizontal-pool="horizontal_pool"
        :type="choosedSecondSignal"
        :y-axis-label="'y(t)'"
      />
      <AppParagraph class="text-xl">Rezultat korelacijske funkcije: {{ correlationResult }}</AppParagraph>
      <FullSignalGraph
        :canvas-id="'correlation-signal'"
        :data="canvasInputCorrelation"
        :title="'Zmnožek prvega in drugega signala'"
        :vertical-pool="[1, 0.5, -0.5, -1]"
        :horizontal-pool="horizontal_pool"
        :type="correlation.type"
        :y-axis-label="'x(t)y(t)'"
      />
      <FullSignalGraph
        :canvas-id="'correlation-function-signal'"
        :data="canvasInputCorrelationFunction"
        :title="'Korelacijska Funkcija'"
        :vertical-pool="[1, 0.5, -0.5, -1]"
        :horizontal-pool="horizontal_pool"
        :type="correlationFunction.type"
        :y-axis-label="'R(τ)'"
        :x-axis-label="'τ'"
      />
    </template>

    <template v-if="signalType === 'Impulzni'">
      <AppSectionHeading>Izbira prvega signala:</AppSectionHeading>
      <AppButtonContainer>
        <AppButton
          v-for="signal in signals[1].signal"
          :key="signal.key"
          :class="{ 'bg-blue-600': choosedFirstSignal === signal.key }"
          @click="changeSignal(signal.key, 'impulzni', 1)"
        >
          {{ signal.label }}
        </AppButton>
      </AppButtonContainer>
      <AppSectionHeading>Izbira drugega signala:</AppSectionHeading>
      <AppButtonContainer>
        <AppButton
          v-for="signal in signals[1].signal"
          :key="signal.key"
          :class="{ 'bg-blue-600': choosedSecondSignal === signal.key }"
          @click="changeSignal(signal.key, 'impulzni', 2)"
        >
          {{ signal.label }}
        </AppButton>
      </AppButtonContainer>
      <!-- Slider -->
      <div class="inline-flex flex-col w-fit gap-4">
        <label
          :for="'tau-slider'"
          class="font-semibold text-xl transition-colors duration-300 dark:text-white"
        >
          Časovni zamik drugega signala
          <span class="font-semibold text-2xl">τ</span>
          :
          <span class="font-medium">{{ tau }}</span>
        </label>
        <input
          :id="'tau-slider'"
          v-model.number="tau"
          type="range"
          min="-1"
          max="1"
          step="0.1"
          @change="updateTau(tau)"
        />
      </div>
      <FullSignalGraph
        :canvas-id="'first-signal'"
        :data="canvasInputFirst"
        :title="'Prvi Signal'"
        :vertical-pool="[1, 0.5, -0.5, -1]"
        :horizontal-pool="horizontal_pool"
        :type="choosedFirstSignal"
        :y-axis-label="'x(t)'"
      />
      <FullSignalGraph
        :canvas-id="'second-signal'"
        :data="canvasInputSecond"
        :title="'Drugi Signal'"
        :vertical-pool="[1, 0.5, -0.5, -1]"
        :horizontal-pool="horizontal_pool"
        :type="choosedSecondSignal"
        :y-axis-label="'y(t)'"
      />
      <AppParagraph class="text-xl">Rezultat korelacijske funkcije: {{ correlationResult }}</AppParagraph>
      <FullSignalGraph
        :canvas-id="'correlation-signal'"
        :data="canvasInputCorrelation"
        :title="'Zmnožek prvega in drugega signala'"
        :vertical-pool="[1, 0.5, -0.5, -1]"
        :horizontal-pool="horizontal_pool"
        :type="correlation.type"
        :y-axis-label="'x(t)y(t)'"
      />
      <FullSignalGraph
        :canvas-id="'correlation-function-signal'"
        :data="canvasInputCorrelationFunction"
        :title="'Korelacijska Funkcija'"
        :vertical-pool="[1, 0.5, -0.5, -1]"
        :horizontal-pool="horizontal_pool"
        :type="correlationFunction.type"
        :y-axis-label="'R(τ)'"
        :x-axis-label="'τ'"
      />
    </template>
  </AppMainContainer>
</template>

<script>
import AppCollapsible from '@components/common/AppCollapsible.vue';
import AppMainContainer from '@components/common/AppMainContainer.vue';
import AppMainHeading from '@components/common/AppMainHeading.vue';
import AppParagraph from '@components/common/AppParagraph.vue';
import AppSectionHeading from '@components/common/AppSectionHeading.vue';
import AppButton from '@components/common/buttons/AppButton.vue';
import AppButtonContainer from '@components/common/buttons/AppButtonContainer.vue';
import FullSignalGraph from '@components/canvas/FullSignalGraph.vue';
import CorrelationTheory from './components/CorrelationTheory.vue';

export default {
  name: 'CorrelationView',
  components: {
    AppParagraph,
    AppMainContainer,
    AppSectionHeading,
    AppMainHeading,
    AppCollapsible,
    CorrelationTheory,
    AppButton,
    AppButtonContainer,
    FullSignalGraph,
  },
  data() {
    return {
      signalType: 'Harmonični',
      xAxisArray: [...[...Array(2 ** 10).keys()].map((el) => el * -1 - 1).reverse(), ...Array(2 ** 10).keys()],
      firstSignalArray: [...Array(601)],
      secondSignalArray: [...Array(601)],
      correlationSignalArray: [...Array(601)],
      correlationFunctionArray: [...Array(600)],
      choosedFirstSignal: 'baseCos',
      choosedSecondSignal: 'sin',
      horizontal_pool: [-1.5, -1.25, -1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1, 1.25, 1.5],
      typeLabel: 0, //0 for "Harmonični", 1 for "Impulzni"
      tau: 0,
      correlation: {
        type: 'correlation',
        drawingValues: () => {
          this.calculateArrays();
          return this.correlationSignalArray;
        },
      },
      correlationFunction: {
        type: 'correlationFunction',
        drawingValues: () => {
          this.calculateCorrelationFunction();
          return this.correlationFunctionArray;
        },
      },
      signals: [
        {
          label: 'Harmonični',
          frequencyRange: [1, 2, 3, 4, 5],
          frequency: 1,
          baseHarmonicSignal: {
            key: 'baseCos',
            drawingValues: () => this.xAxisArray.map((t) => Math.cos(Math.PI * t * 0.01 + 0.75)), //0.75 is pi/2
          },
          signal: [
            {
              key: 'sin',
              label: 'Sin(2πft)',
              drawingValues: (tau) =>
                this.xAxisArray.map((t) =>
                  Math.sin(
                    Math.PI * (t + (200 * tau) / this.signals[0].frequency) * this.signals[0].frequency * 0.01 +
                      (0.75 - (this.signals[0].frequency - 1) * 2.4)
                  )
                ), //start with 0.75 and continue with step -2.4
            },
            {
              key: 'cos',
              label: 'Cos(2πft)',
              drawingValues: (tau) =>
                this.xAxisArray.map((t) =>
                  Math.cos(
                    Math.PI * (t + (200 * tau) / this.signals[0].frequency) * this.signals[0].frequency * 0.01 +
                      (0.75 - (this.signals[0].frequency - 1) * 2.4)
                  )
                ),
            },
          ],
        },
        {
          label: 'Impulzni',
          signal: [
            {
              key: 'square',
              label: 'Pravokotni Impulz',
              drawingValues: () => this.xAxisArray.map((t) => -this.unitBox(t - 0.75)),
              drawingValuesSecondSignal: (tau) => this.xAxisArray.map((t) => -this.unitBox(t + 200 * tau - 0.75)),
            },
            {
              key: 'cos',
              label: 'Dvignjeni Kosinusni Impulz',
              drawingValues: () => this.xAxisArray.map((t) => Math.cos(((Math.PI * t) / 2) * 0.01 + 1.95) * this.unitBox(t)),
              drawingValuesSecondSignal: (tau) =>
                this.xAxisArray.map((t) => Math.cos(((Math.PI * (t + 200 * tau)) / 2) * 0.01 + 1.95) * this.unitBox(t + 200 * tau)),
            },
            {
              key: 'sin',
              label: 'Sinusni Impulz',
              drawingValues: () => this.xAxisArray.map((t) => Math.sin(Math.PI * t * 2 * 0.01 - 1.65) * this.unitBox(t)),
              drawingValuesSecondSignal: (tau) =>
                this.xAxisArray.map((t) => Math.sin(Math.PI * (t + 200 * tau) * 2 * 0.01 - 1.65) * this.unitBox(t + 200 * tau)),
            },
          ],
        },
      ],
    };
  },
  computed: {
    canvasInputFirst() {
      return this.signalType === 'Harmonični'
        ? this.cutArray(this.signals[0].baseHarmonicSignal.drawingValues())
        : this.cutArray(this.signals[1].signal.find((el) => el.key === this.choosedFirstSignal).drawingValues());
    },
    canvasInputSecond() {
      return this.signalType === 'Harmonični'
        ? this.cutArray(this.signals[0].signal.find((el) => el.key === this.choosedSecondSignal).drawingValues(this.tau))
        : this.cutArray(this.signals[1].signal.find((el) => el.key === this.choosedSecondSignal).drawingValuesSecondSignal(this.tau));
    },
    canvasInputCorrelation() {
      return this.cutArray(this.correlation.drawingValues());
    },
    canvasInputCorrelationFunction() {
      return this.cutArray(this.correlationFunction.drawingValues());
    },
    correlationResult() {
      const numberOfSamples = this.signalType === 'Harmonični' ? this.correlationSignalArray.length : 200;
      const correlation = -this.correlationSignalArray.reduce((prevVal, currVal) => prevVal + currVal) / numberOfSamples;
      return Math.abs(correlation) < 0.011 ? 0 : Math.trunc(correlation * 100) / 100;
    },
  },
  methods: {
    changeSignalType(signalType) {
      if (signalType === 'Harmonični') {
        this.typeLabel = 0;
        this.choosedFirstSignal = 'baseCos';
        this.choosedSecondSignal = 'sin';
      } else {
        this.typeLabel = 1;
        this.choosedFirstSignal = 'square';
        this.choosedSecondSignal = 'square';
      }
      this.tau = 0;
      this.signalType = signalType;
    },
    changeSignal(signal, type, channel = 0) {
      if (type === 'harmonični') {
        this.choosedSecondSignal = signal;
      } else {
        if (channel === 1) {
          this.choosedFirstSignal = signal;
        } else {
          this.choosedSecondSignal = signal;
        }
      }
    },
    cutArray(array) {
      array.length = 600;
      return array;
    },
    multiplyArrays(array1, array2, arrayLength) {
      const multipliedArray = [];
      for (let i = 0; i < arrayLength; i++) {
        multipliedArray[i] = -1 * array1[i] * array2[i];
      }
      return multipliedArray;
    },
    changeFrequency(frequency) {
      this.signals[0].frequency = frequency;
    },
    updateTau(value) {
      this.tau = value;
    },
    unitBox(n) {
      return n >= -824 && n <= -624 ? 1 : 0;
    },
    calculateArrays() {
      this.firstSignalArray = this.canvasInputFirst;
      this.secondSignalArray = this.canvasInputSecond;
      this.correlationSignalArray = this.multiplyArrays(this.firstSignalArray, this.secondSignalArray, this.firstSignalArray.length);
    },
    calculateCorrelationFunction() {
      if (this.signalType === 'Harmonični') {
        if (this.signals[0].frequency === 1) {
          if (this.choosedSecondSignal === 'sin') {
            for (let i = 0; i < 600; i++) {
              this.correlationFunctionArray[i] = 0.5 * Math.sin(Math.PI * i * 0.01);
            }
          } else {
            for (let i = 0; i < 600; i++) {
              this.correlationFunctionArray[i] = 0.5 * Math.cos(Math.PI * i * 0.01);
            }
          }
        } else {
          for (let i = 0; i < 600; i++) {
            this.correlationFunctionArray[i] = 0;
          }
        }
      } else {
        if (this.choosedFirstSignal === 'square' && this.choosedSecondSignal === 'square') {
          for (let i = 0; i < 600; i++) {
            const x = (i - 300) / 200;
            if (i <= 100 || i >= 500) {
              this.correlationFunctionArray[i] = 0;
            } else if (i > 100 && i <= 300) {
              this.correlationFunctionArray[i] = -x - 1;
            } else {
              this.correlationFunctionArray[i] = x - 1;
            }
          }
        } else if (this.choosedFirstSignal === 'square' && this.choosedSecondSignal === 'sin') {
          for (let i = 0; i < 600; i++) {
            if (i <= 100 || i >= 500) {
              this.correlationFunctionArray[i] = 0;
            } else if (i > 100 && i <= 300) {
              this.correlationFunctionArray[i] = 0.08 * Math.cos(Math.PI * i * 2 * 0.01) - 0.08;
            } else {
              this.correlationFunctionArray[i] = -0.08 * Math.cos(Math.PI * i * 2 * 0.01) + 0.08;
            }
          }
        } else if (this.choosedFirstSignal === 'sin' && this.choosedSecondSignal === 'square') {
          for (let i = 0; i < 600; i++) {
            if (i <= 100 || i >= 500) {
              this.correlationFunctionArray[i] = 0;
            } else if (i > 100 && i <= 300) {
              this.correlationFunctionArray[i] = -0.08 * Math.cos(Math.PI * i * 2 * 0.01) + 0.08;
            } else {
              this.correlationFunctionArray[i] = 0.08 * Math.cos(Math.PI * i * 2 * 0.01) - 0.08;
            }
          }
        } else if (
          (this.choosedFirstSignal === 'square' && this.choosedSecondSignal === 'cos') ||
          (this.choosedFirstSignal === 'cos' && this.choosedSecondSignal === 'square')
        ) {
          for (let i = 0; i < 600; i++) {
            if (i <= 100 || i >= 500) {
              this.correlationFunctionArray[i] = 0;
            } else {
              this.correlationFunctionArray[i] = 0.32 * Math.sin(Math.PI * i * 0.5 * 0.01) - 0.32;
            }
          }
        } else {
          const numberOfSamples = this.signalType === 'Harmonični' ? this.correlationSignalArray.length : 200;
          const firstSignal =
            this.signalType === 'Harmonični'
              ? this.cutArray(this.signals[0].baseHarmonicSignal.drawingValues())
              : this.cutArray(this.signals[1].signal.find((el) => el.key === this.choosedFirstSignal).drawingValues());
          let correlation;
          let secondSignal;
          let multipliedSignals;
          let j = 0;
          for (let tau = -1.5; tau <= 1.5; tau = tau + 1.5 / 300) {
            secondSignal =
              this.signalType === 'Harmonični'
                ? this.cutArray(this.signals[0].signal.find((el) => el.key === this.choosedSecondSignal).drawingValues(tau))
                : this.cutArray(this.signals[1].signal.find((el) => el.key === this.choosedSecondSignal).drawingValuesSecondSignal(tau));
            multipliedSignals = this.multiplyArrays(firstSignal, secondSignal, 600);
            correlation = multipliedSignals.reduce((prevVal, currVal) => prevVal + currVal) / numberOfSamples;
            this.correlationFunctionArray[j] = correlation;
            j++;
          }
        }
      }
    },
  },
};
</script>

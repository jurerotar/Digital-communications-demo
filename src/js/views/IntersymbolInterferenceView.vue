<template>
  <app-main-container>
    <app-main-heading>
      Intersimbolna interferenca
    </app-main-heading>
    <app-collapsible>
      <theory-intersymbol-interference />
    </app-collapsible>
    <div class="inline-flex flex-col mb-2">
      <label
        :for="`fCut-multiplier`"
        class="text-xl transition-colors duration-300 dark:text-white"
      >
        Mejna frekvenca kanala (NP filter):<span class="font-semibold"> f<sub>m</sub></span>=
        <span class="font-medium">{{ Number(transferFunctionParams.fCutMulti).toFixed(2) }}</span>
        <span class="font-semibold"> f<sub>s</sub></span>
      </label>
      <div class="slider_container">
        <input
          :id="`fCut-multiplier`"
          v-model.number="transferFunctionParams.fCutMulti"
          type="range"
          class="slider"
          min="0.1"
          max="2"
          step="0.05"
        >
      </div>
    </div>
    <positive-only-signal
      :data="transferFunction"
      :canvas-id="'transfer-function'"
      :title="'Ekvivalentni prenosni kanal'"
      :vertical-pool="[1, 0.5, -0.5, -1]"
      :description="''"
      :note="''"
      :is-binary="false"
      :x-ticks="{
        'text':transferFunctionParams.tickNames,
        'pos':transferFunctionParams.ticks
      }"
      :is-inverted="true"
      :speed="speed"
    />

    <app-button-container>
      <app-button
        v-for="sp in possibleSpeeds"
        :key="sp"
        :active="speed === sp"
        @click="changeSpeed(sp)"
      >
        {{ sp }}x
      </app-button>
      <div
        class="switcher__tab w-20 cursor-pointer flex flex-row relative bg-gray-200
          dark:bg-gray-700 p-1 rounded-3xl items-center justify-center h-8 transition-all duration-300 "
        @click="togglePlay()"
      >
        <div
          v-for="state in states"
          :key="state.key"
          :class="[isPlaying === state.key ? 'switcher__front' : 'switcher__back']"
          class="flex flex-row justify-center items-center w-full h-full absolute top-0 left-0 transition-transform duration-300"
        >
          <font-awesome-icon
            :icon="state.icon"
            class="text-sm mr-1 text-gray-800 transition-colors duration-300 dark:text-white"
          />
          <p class="text-sm text-gray-800 dark:text-white transition-colors duration-300 select-none font-medium">
            {{ state.label }}
          </p>
        </div>
      </div>
    </app-button-container>
    <level4-signal
      :data="binaryLevel4Signal.values"
      :title="'4-nivojski bipolarni signal'"
      :description="''"
      :note="''"
      :is-binary="true"
      :speed="speed"
    />
    <positive-only-signal
      :data="convolution"
      :canvas-id="'distorted-signal'"
      :title="'Popačen signal na izhodu prenosnega kanala'"
      :vertical-pool="[3, 1.5, -1.5, -3]"
      :description="'Signal na izhodu je konvolucija med vhodnim signalom in prenosno funkcijo kanala'"
      :is-binary="false"
      :x-ticks="{'text':['ts','ts','ts','ts','ts'],'pos':tsTicks}"
      :is-inverted="false"
      :abs-max="transferFunctionParams.maxConvValue"
      :speed="speed"
    />

    <div class="inline-flex flex-col mb-2">
      <label
        :for="`fCut-multiplier`"
        class="text-xl transition-colors duration-300 dark:text-white"
      >
        Mejna frekvenca kanala (NP filter):<span class="font-semibold"> f<sub>m</sub></span>=
        <span class="font-medium">{{ Number(transferFunctionParams.fCutMulti).toFixed(2) }}</span>
        <span class="font-semibold"> f<sub>s</sub></span>
      </label>
      <div class="slider_container">
        <input
          :id="`fCut-multiplier`"
          v-model.number="transferFunctionParams.fCutMulti"
          type="range"
          class="slider"
          min="0.1"
          max="2"
          step="0.05"
        >
      </div>
    </div>
    <app-button
      class="w-fit-content"
      @click="clearOscilloscope()"
    >
      <font-awesome-icon
        :icon="['fas', 'trash-alt']"
        class="text-sm mr-1"
      />
      Počisti
    </app-button>
    <oscilloscope
      :data="dataISI"
      :canvas-id="'eye-diagram'"
      :name="'Očesni diagram'"
      :symbol-length="binarySymbolLength"
      :speed="speed"
      :ticks="isiTicks"
    />
  </app-main-container>
</template>

<script>
import AppMainContainer from "@/js/components/common/AppMainContainer.vue";
import AppButtonContainer from "@/js/components/common/buttons/AppButtonContainer.vue";
import AppButton from "@/js/components/common/buttons/AppButton.vue";
import AppCollapsible from "@/js/components/common/AppCollapsible.vue";
import TheoryIntersymbolInterference from "@/js/components/theory/TheoryIntersymbolInterference.vue";
import AppMainHeading from "@/js/components/common/AppMainHeading.vue";
import Oscilloscope from "@/js/components/canvas/Oscilloscope.vue";
import Level4Signal from "@/js/components/canvas/Level4Signal.vue";
import PositiveOnlySignal from "@/js/components/canvas/PositiveOnlySignal.vue";
import '@/js/types/types.ts';
import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {faPlay, faStop, faTrashAlt} from '@fortawesome/free-solid-svg-icons'

library.add(faPlay, faStop, faTrashAlt);
export default {
  name: "IntersymbolInterferenceView",
  components: {
    AppMainContainer,
    TheoryIntersymbolInterference,
    Oscilloscope, Level4Signal, PositiveOnlySignal, FontAwesomeIcon,
    AppMainHeading, AppButtonContainer, AppButton, AppCollapsible
  },
  data() {
    return {
      /** @type {number} */
      speed: 1,

      /** @type {number[]} */
      possibleSpeeds: [1, 2, 3, 4, 5],
      /** @type {number} */
      binaryCounter: 0,
      /** @type {number} */
      binarySymbolLength: 100,
      /** @type {number} */
      binarySymbolLengthInit: 100,
      /** @type {number} */
      fs: 1 / this.binarySymbolLength,
      /** @type {number} */
      signalLength: 600,
      /** 4 level signal
       * @type {BinarySignal} */
      binaryLevel4Signal: {
        values: [...Array(600).fill(0)],
        pool: [-3, -1, 1, 3],
        currentlyReturns: 1,
      },

      /** used for generating source signal
       * @type {number[]} */
      combinationsSequence: {
        values: [-1, -3, 3, 3, 1, -1, 3, -3, -3, 1, 3, -1, 1, 1, -3, -1, -3, 1, 1, -1, 3, 1, -3, -3, 3, -1, 1, 3, 3, -3, -1],
        idx: 0
      },

      /** received signal, f*g convolution
       * @type {number[]} */
      convolution: [...Array(600).fill(0)],
      /**
       * transfer function of a channel
       * @type {number[]} */
      transferFunction: [...Array(600).fill(0)],
      /**
       * transfer function parameters
       * @type {number[]} */
      transferFunctionParams: {
        fCutMulti: 1,
        fCutMulti_old: 0,
        fCut: 1 / 100,
        tOffset: 100 / 2,
        tOffset_old: 100 / 2,
        maxConvValue: 3,
        ticks: [],
        tickNames: [],
      },
      /**
       * positions of sampling times
       * @type {number[]} */
      tsTicks: [],
      /**
       * current symbol data for eye diagram
       * @type {number[]} */
      dataIsiPartial: [],

      /**
       * older symbols data for eye diagram
       * @type {number[]} */
      dataISI: [],
      /**
       * positions of sampling times on eye diagram
       * @type {number[]} */
      isiTicks: [],
      /** @type {number[]} */
      timeValues: [...Array(600).fill(0)].map((t, i) => i * 0.005),
      // PLAY PAUSE BUTTON
      /** @type {dictionary[]} */
      states: [
        {
          key: false,
          label: 'Play',
          icon: ['fas', 'play']
        },
        {
          key: true,
          label: 'Stop',
          icon: ['fas', 'stop']
        },
      ],
      /**
       * Objects in this array determine which canvases will be drawn
       * @type {Boolean}
       */
      isPlaying: true,
    }
  },
  mounted() {
    // Start time at 600 * 0.005, because we initiate arrays with 600 values already in
    let time = this.signalLength * 0.005;
    this.changeSpeed(2);
    this.recalculateTicks(true)
    // Create interval to push new signal values to arrays
    this.intervalId = window.setInterval(() => {
      if (this.isPlaying) {
        if (this.transferFunctionParams.fCutMulti_old !== this.transferFunctionParams.fCutMulti) {
          this.transferFunctionParams.fCutMulti_old = this.transferFunctionParams.fCutMulti;
          this.updateTransferFunctionParams()
        }
        // CONVOLUTE
        // use map to multiply, use reduce to sum
        const newConvolutionValue = this.binaryLevel4Signal.values.map((f, i) => f * this.transferFunction[i]).reduce((a, b) => a + b, 0);
        this.convolution.unshift(newConvolutionValue);
        // ISI oscilloscope plot
        this.dataIsiPartial.push(newConvolutionValue / this.transferFunctionParams.maxConvValue);
        this.dataISI[0] = this.dataIsiPartial;
        // when vector fills up with 2 symbols unshift() to dataISI
        if (this.dataIsiPartial.length === 2 * this.binarySymbolLength) {
          this.dataISI.unshift([]);
          //if (this.dataISI.length === (this.combinationsSequence.values.length/2)){
          if (this.dataISI.length === 25) {
            this.dataISI.pop();
          }
          this.dataIsiPartial = [];
        }
        // Push new values to arrays
        this.binaryLevel4Signal.values.unshift(this.nextBinaryValue());
        this.timeValues.unshift(time);
        this.tsTicks = this.tsTicks.map(i => i < (this.signalLength - 1) ? i + 1 : 0);

        // Loop through arrays and remove last values if lengths are too big
        [
          this.binaryLevel4Signal.values,
          this.timeValues,
          this.convolution
        ].forEach(array => {
          if (array.length > this.signalLength) {
            array.pop();
          }
        });
        time += 0.005;
        this.binaryCounter = (this.binaryCounter === (this.binarySymbolLength - 1)) ? 0 : this.binaryCounter + 1;
      }
    }, 30);
  },
  methods: {
    /**
     * Changes selected property
     * @param {string} key
     */
    changeSelected(key) {
      this.selected = key;
    },
    /**
     * Returns binary values periodically from
     * @returns {number}
     */
    nextBinaryValue() {
      if (this.binaryCounter === (this.binarySymbolLength - 1)) {
        this.combinationsSequence.idx =
          this.combinationsSequence.idx === (this.combinationsSequence.values.length - 1) ? 0 : this.combinationsSequence.idx + 1;
        this.currentlyReturns = this.combinationsSequence.values[this.combinationsSequence.idx];
      } else {
        this.currentlyReturns = 0;
      }
      return this.currentlyReturns;
    },
    /**
     * is called when speed changes (buttons)
     * @param {Number} newSpeed
     */
    changeSpeed(newSpeed) {
      this.speed = newSpeed;
      this.binarySymbolLength = this.binarySymbolLengthInit / this.speed;
      this.signalLength = 600 / this.speed;
      this.updateTransferFunctionParams();
      this.recalculateTicks(true)
      this.binaryLevel4Signal.values = [];
      this.binaryCounter = 0;
      this.convolution = [];
      this.dataIsiPartial = [];
      this.dataISI = [];
    },
    /**
     * recalculates relative position of ticks at signal sampling positions
     * @param {Boolean} reset
     * if true, ticks will start at position 0 (when clearing the display)
     * if false, ticks will shift based on change of tOffset
     */
    recalculateTicks(reset) {
      // source and destination signals
      if (reset) {
        this.tsTicks = [...Array(Math.floor(this.signalLength / this.binarySymbolLength)).fill(0)]; // reset ticks
        for (let i = 0; i < this.tsTicks.length; i++) {
          this.tsTicks[i] = (i + this.transferFunctionParams.tOffset / this.binarySymbolLength) * this.binarySymbolLength;
          if (this.tsTicks[i] >= this.signalLength) {
            this.tsTicks[i] = this.tsTicks[i] - this.signalLength;
          }
        }
      } else {
        for (let i = 0; i < this.tsTicks.length; i++) {
          const dtOffset = this.transferFunctionParams.tOffset - this.transferFunctionParams.tOffset_old;
          this.tsTicks[i] = this.tsTicks[i] - dtOffset;
        }
        this.tsTicks.map(i => i >= (this.signalLength - 1) ? i - this.signalLength : i); // cut ticks that are out of range
        this.transferFunctionParams.tOffset_old = this.transferFunctionParams.tOffset;
      }
      // eye diagram ticks
      this.isiTicks = [];
      for (let i = 0; i < 2; i++) {
        this.isiTicks[i] = this.transferFunctionParams.tOffset + i * this.binarySymbolLength;
        if (this.isiTicks[i] >= 2 * this.binarySymbolLength) {
          this.isiTicks[i] = this.isiTicks[i] - 2 * this.binarySymbolLength;
        }
      }

      // transfer function ticks
      this.transferFunctionParams.ticks = []
      this.transferFunctionParams.ticksNames = [];
      //  ticks for past symbols (left from t0 on transfer function plot)
      const min = -Math.floor(this.transferFunctionParams.tOffset / this.binarySymbolLength);
      //  ticks for future symbols  (right from t0 on transfer function plot)
      const max = Math.floor((this.signalLength - this.transferFunctionParams.tOffset) / this.binarySymbolLength);
      for (let i = min; i <= max; i++) {
        this.transferFunctionParams.ticks.unshift(this.transferFunctionParams.tOffset + i * this.binarySymbolLength);
        this.transferFunctionParams.tickNames.unshift("ts".concat(i.toString()));
      }
    },
    /**
     * is called when fCutMulti changes (slider) by callback setInterval
     * is called by changeSpeed()
     */
    updateTransferFunctionParams() {
      this.transferFunctionParams.fCut = 1 / this.binarySymbolLength;  //
        this.transferFunctionParams.tOffset = 1.5 / (this.transferFunctionParams.fCut * this.transferFunctionParams.fCutMulti);
      this.recalculateTicks(false)
      this.updateTransferFunction();
    },
    /**
     * Calculates sinc transfer function
     */
    updateTransferFunction() {
      const multi = this.transferFunctionParams.fCutMulti;
      const fCut = this.transferFunctionParams.fCut;
      const tOffset = this.transferFunctionParams.tOffset;
      this.transferFunction = [...Array(this.signalLength).fill(0)];
      this.transferFunction = this.transferFunction.map((i, t) => {
        return Math.sin(2 * Math.PI * fCut * multi * (t - tOffset)) / (2 * Math.PI * fCut * multi * (t - tOffset));
      });
      this.transferFunction = this.transferFunction.map(i => isNaN(i) ? 1 : i); // 1/(t-tOffset); t=tOffset => NaN

      // think of a better way to calculate maximum possible value, this method is heavy
      // worst case signal consists of pulses with maximum amplitude (3)
      const worstCaseSignal = [...Array(this.signalLength).fill(0)].map((tf, t) => {
        return t % this.binarySymbolLength === (this.binarySymbolLength - 1) ? 3 : 0;
      });
      const worstCaseConv = [];
      // calculate convolution of such signal
      for (let n = 0; n < this.signalLength; n++) {
        const conv = [];
        for (let m = 0; m <= (this.signalLength - n - 1); m++) {
          conv.push(this.transferFunction[m] * worstCaseSignal[m + n]);
        }
        worstCaseConv.push(conv.reduce((a, b) => a + b));
      }
      // experimentally determined that value at this index will give the correct value to pass to plot elements
      this.transferFunctionParams.maxConvValue = worstCaseConv[Math.round(this.signalLength - 1 - this.transferFunctionParams.tOffset)];

      //this.transferFunctionParams.maxConvValue = this.transferFunction.map(tf => tf*3).reduce((a,b)=>a+b); // for square signal
    },
    togglePlay() {
      this.isPlaying = !this.isPlaying;
    },
    clearOscilloscope() {
      this.dataISI = Array.from(Array(1), () => new Array(600));
    },
  },
}
</script>

<style>
.switcher__tab {
  -webkit-tap-highlight-color: transparent;
}

.switcher__front {
  transform: rotateX(0);
  opacity: 1;
}

.switcher__back {
  opacity: 0;
  transform: rotateX(-180deg);
  backface-visibility: hidden;
}

.slider_container {
  width: 450px
}

.slider {
  width: 100%
}
</style>
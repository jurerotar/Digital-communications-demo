<template>
  <div class="lg:ml-72">
    <main class="p-4 container lg:mx-auto transition-colors duration-300 dark:bg-gray-800">
      <h1 class="text-3xl font-medium mb-4 transition-colors duration-300 dark:text-white">
        Korelacijska Funkcija
      </h1>
      <app-collapsible>
        <theory-correlation />
      </app-collapsible>

      <h2 class="font-semibold text-xl mb-2 transition-colors duration-300 dark:text-white">
        Izbira tipa signalov:
      </h2>
      <app-button-container>
        <app-button
          v-for="signal in signals"
          :key="signal.label"
          :class="{'bg-blue-600': signal.label===signalType}"
          @click="changeSignalType(signal.label)"
        >
          {{ signal.label }}
        </app-button>
      </app-button-container>

      <template v-if="signalType==='Harmonični'">
        <h2 class="font-semibold text-xl mb-2 transition-colors duration-300 dark:text-white">
          Izbira drugega signala:
        </h2>
        <app-button-container>
          <app-button
            v-for="signal in signals[0].signal"
            :key="signal.key"
            :class="{'bg-blue-600': choosedSecondSignal===signal.key}"
            @click="changeSignal(signal.key, 'harmonični')"
          >
            {{ signal.label }}
          </app-button>
        </app-button-container>
        <h2 class="font-semibold text-xl mb-2 transition-colors duration-300 dark:text-white">
          Izbira frekvence drugega signala:
        </h2>
        <app-button-container>
          <app-button
            v-for="frequency in signals[0].frequencyRange"
            :key="frequency"
            :class="{'bg-blue-600': signals[0].frequency===frequency}"
            @click="changeFrequency(frequency)"
          >
            {{ frequency }}
          </app-button>
        </app-button-container>
        <!-- Slider -->
        <div class="inline-flex flex-col mb-2">
          <label
            :for="'tau'"
            class="font-semibold text-xl transition-colors duration-300 dark:text-white"
          >Časovni zamik drugega signala <span class="font-semibold text-2xl">τ</span>: <span
            class="font-medium"
          > {{ tau }}</span></label>
          <input
            :id="'tau'"
            v-model.number="tau"
            type="range"
            min="-1"
            max="1"
            step="0.1"
            @change="updateTau(tau)"
          >
        </div>
        <full-signal
          :canvas-id="'first-signal'"
          :data="canvasInputFirst"
          :title="'Prvi Signal'"
          :vertical-pool="[1, 0.5, -0.5, -1]"
          :horizontal-pool="horizontal_pool"
          :type="choosedFirstSignal"
        />
        <full-signal
          :canvas-id="'second-signal'"
          :data="canvasInputSecond"
          :title="'Drugi Signal'"
          :vertical-pool="[1, 0.5, -0.5, -1]"
          :horizontal-pool="horizontal_pool"
          :type="choosedSecondSignal"
        />
        <h2 class="font-semibold text-xl mb-2 transition-colors duration-300 dark:text-white">
          Rezultat korelacijske funkcije: {{ correlationResult }}
        </h2>
        <full-signal
          :canvas-id="'correlation-signal'"
          :data="canvasInputCorrelation"
          :title="'Zmnožek prvega in drugega signala'"
          :vertical-pool="[1, 0.5, -0.5, -1]"
          :horizontal-pool="horizontal_pool"
          :type="correlation.type"
        />
      </template>

      <template v-if="signalType==='Impulzni'">
        <h2 class="font-semibold text-xl mb-2 transition-colors duration-300 dark:text-white">
          Izbira prvega signala:
        </h2>
        <app-button-container>
          <app-button
            v-for="signal in signals[1].signal"
            :key="signal.key"
            :class="{'bg-blue-600': choosedFirstSignal===signal.key}"
            @click="changeSignal(signal.key, 'impulzni', 1)"
          >
            {{ signal.label }}
          </app-button>
        </app-button-container>
        <h2 class="font-semibold text-xl mb-2 transition-colors duration-300 dark:text-white">
          Izbira drugega signala:
        </h2>
        <app-button-container>
          <app-button
            v-for="signal in signals[1].signal"
            :key="signal.key"
            :class="{'bg-blue-600': choosedSecondSignal===signal.key}"
            @click="changeSignal(signal.key, 'impulzni', 2)"
          >
            {{ signal.label }}
          </app-button>
        </app-button-container>
        <!-- Slider -->
        <div class="inline-flex flex-col mb-2">
          <label
            :for="'tau'"
            class="font-semibold text-xl transition-colors duration-300 dark:text-white"
          >Časovni zamik drugega signala <span class="font-semibold text-2xl">τ</span>: <span
            class="font-medium"
          > {{ tau }}</span></label>
          <input
            :id="'tau'"
            v-model.number="tau"
            type="range"
            min="-1"
            max="1"
            step="0.1"
            @change="updateTau(tau)"
          >
        </div>
        <full-signal
          :canvas-id="'first-signal'"
          :data="canvasInputFirst"
          :title="'Prvi Signal'"
          :vertical-pool="[1, 0.5, -0.5, -1]"
          :horizontal-pool="horizontal_pool"
          :type="choosedFirstSignal"
        />
        <full-signal
          :canvas-id="'second-signal'"
          :data="canvasInputSecond"
          :title="'Drugi Signal'"
          :vertical-pool="[1, 0.5, -0.5, -1]"
          :horizontal-pool="horizontal_pool"
          :type="choosedSecondSignal"
        />
        <h2 class="font-semibold text-xl mb-2 transition-colors duration-300 dark:text-white">
          Rezultat korelacijske funkcije: {{ correlationResult }}
        </h2>
        <full-signal
          :canvas-id="'correlation-signal'"
          :data="canvasInputCorrelation"
          :title="'Zmnožek prvega in drugega signala'"
          :vertical-pool="[1, 0.5, -0.5, -1]"
          :horizontal-pool="horizontal_pool"
          :type="correlation.type"
        />
      </template>
    </main>
  </div>
</template>

<script>
import AppCollapsible from "@/js/components/common/AppCollapsible.vue";
import TheoryCorrelation from '@/js/components/theory/TheoryCorrelation.vue';
import AppButton from "@/js/components/common/buttons/AppButton.vue";
import AppButtonContainer from "@/js/components/common/buttons/AppButtonContainer.vue";
import FullSignal from "@/js/components/canvas/FullSignal.vue";

export default {
    name: "Correlation",
    components: {AppCollapsible, TheoryCorrelation, AppButton, AppButtonContainer, FullSignal},
    data(){
        return{
            signalType: "Harmonični",
            signalSize: 2**11,
            xAxisArray: null,
            choosedFirstSignal: "baseCos",
            choosedSecondSignal: "sin",
            firstSignalArray: null, 
            secondSignalArray: null, 
            correlationSignalArray: null,
            horizontal_pool: [-1.5, -1.25, -1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1, 1.25, 1.5],
            typeLabel: 0, //0 for "Harmonični", 1 for "Impulzni"
            tau: 0,
            correlation: {
                type: "correlation",
                drawingValues: () => {
                    this.calculateArrays() ; 
                    return this.correlationSignalArray;
                }         
            },
            signals: [
                {
                    label: "Harmonični",
                    frequencyRange: [1, 2, 3, 4, 5],
                    frequency: 1,
                    baseHarmonicSignal: {
                            key: "baseCos",
                            drawingValues: () => this.xAxisArray.map(t => (Math.cos(Math.PI * t * 1 * 0.01 + 0.75))),   //0.75 is pi/2 
                    },
                    signal: [
                        {
                            key: "sin",
                            label: "Sin(2πft)",
                            drawingValues: () => this.xAxisArray.map(t => (Math.sin(Math.PI * (t + 200*this.tau/this.signals[0].frequency) * this.signals[0].frequency * 0.01 + (0.75 - (this.signals[0].frequency-1)*2.4)))),  //start with 0.75 and continue with step -2.4  
                        },
                        {
                            key: "cos",
                            label: "Cos(2πft)",
                            drawingValues: () => this.xAxisArray.map(t => (Math.cos(Math.PI * (t + 200*this.tau/this.signals[0].frequency) * this.signals[0].frequency * 0.01 + (0.75 - (this.signals[0].frequency-1)*2.4)))),
                        },
                    ],
                },
                {
                    label: "Impulzni",
                    signal: [
                        {
                            key: "square",
                            label: "Pravokotni Impulz",
                            drawingValues: () => this.xAxisArray.map((t) => -this.unitBox(t-0.75)),
                            drawingValuesSecondSignal: () => this.xAxisArray.map((t) => -this.unitBox((t + 200*this.tau)-0.75)),
                        },
                        {
                            key: "cos",
                            label: "Dvignjeni Kosinusni Impulz",
                            drawingValues: () => this.xAxisArray.map(t => (Math.cos(Math.PI * t * 1/2 * 0.01 + 1.95)*this.unitBox(t))),
                            drawingValuesSecondSignal: () =>  this.xAxisArray.map(t => (Math.cos(Math.PI * (t + 200*this.tau) * 1/2 * 0.01 + 1.95)*this.unitBox(t + 200*this.tau))),
                        },
                        {
                            key: "sin",
                            label: "Sinusni Impulz",
                            drawingValues: () => this.xAxisArray.map(t => (Math.sin(Math.PI * t * 2 * 0.01 - 1.65)*this.unitBox(t))),
                            drawingValuesSecondSignal: () => this.xAxisArray.map(t =>(Math.sin(Math.PI * (t + 200*this.tau) * 2 * 0.01 - 1.65)*this.unitBox(t + 200*this.tau))),
                        },
                    ],
                }
            ]
        }
    },
    computed: {
        canvasInputFirst() {
            return (this.signalType === "Harmonični") ? this.cutArray(
                this.signals[0].baseHarmonicSignal.drawingValues()) : this.cutArray(this.signals[1].signal.find(el => el.key === this.choosedFirstSignal).drawingValues());
        },
        canvasInputSecond() {
            return (this.signalType === "Harmonični") ? this.cutArray(this.signals[0].signal.find(el => el.key === this.choosedSecondSignal).drawingValues()) : this.cutArray(this.signals[1].signal.find(el => el.key === this.choosedSecondSignal).drawingValuesSecondSignal());
        },
        canvasInputCorrelation() {
            return this.cutArray(this.correlation.drawingValues());
        },
        correlationResult(){
            const N = (this.signalType === "Harmonični") ? this.correlationSignalArray.length : 200;
            let correlation = 0;
            correlation = -this.correlationSignalArray.reduce((prevVal, currVal) => prevVal + currVal)/N;
            if(Math.abs(correlation) < 0.011){
                correlation = 0;
            }  
            return Math.trunc(correlation*100)/100;
        },
    },
    created(){
        this.xAxisArray = [...[...Array(this.signalSize/2).keys()].map(el => el * -1 - 1).reverse(), ...Array(this.signalSize/2).keys()];
        this.firstSignalArray = [...Array(601)];
        this.secondSignalArray = [...Array(601)];
        this.correlationSignalArray = [...Array(601)];
    },
    methods: {
        changeSignalType(signalType){
            if(signalType === "Harmonični"){
                this.typeLabel = 0;
                this.choosedFirstSignal = "baseCos";
                this.choosedSecondSignal = "sin";
            }
            else{
                this.typeLabel = 1;
                this.choosedFirstSignal = "square";
                this.choosedSecondSignal = "square";
            }
            this.tau = 0;
            this.signalType = signalType;
        },
        changeSignal(signal, type, num = 0){
            if(type === "harmonični"){
                this.choosedSecondSignal = signal;
            }
            else{
                if(num === 1){
                    this.choosedFirstSignal=signal;
                }
                else{
                    this.choosedSecondSignal=signal;
                }
            }
        },
        cutArray(array) {
            const size = 600;
            return array.filter((el, index) => (index <=  size));
        },
        multiplyArrays(array1, array2, arrayLength){
            let multipliedArray = [];
            for(let i = 0; i < arrayLength; i++){
                multipliedArray[i] = -1*array1[i]*array2[i];
            }
            return multipliedArray;
        },
        changeFrequency(frequency){
            this.signals[0].frequency = frequency;
        },
        updateTau(value) {
            this.tau = value;
        },
        unitBox(n) {
            return (n >= -824 && n <= -624) ? 1 : 0;
        },
        calculateArrays(){
            this.firstSignalArray = this.canvasInputFirst;
            this.secondSignalArray = this.canvasInputSecond;
            this.correlationSignalArray = this.multiplyArrays(this.firstSignalArray, this.secondSignalArray, this.firstSignalArray.length);
        }
    }
}
</script>
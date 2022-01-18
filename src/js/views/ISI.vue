<template>
    <div class="lg:ml-72">
        <main class="p-4 container lg:mx-auto transition-colors duration-300 dark:bg-gray-800">
            <app-main-heading>
                Intersimbolna interferenca
            </app-main-heading>
            <br>
            <app-collapsible>
                <theory-isi></theory-isi>
            </app-collapsible>
            <br>
            <div class="inline-flex flex-col mb-2">
                <label :for="`fm-multiplier`" class="text-xl transition-colors duration-300 dark:text-white">
                    Mejna frekvenca kanala (VP filter):<span class="font-semibold"> f<sub>m</sub></span>=
                    <span class="font-medium">{{ Number(this.tfParams.fm_multi).toFixed(2) }}</span><span class="font-semibold"> f<sub>s</sub></span>
                </label>
                <div class="slider_container">
                    <input type="range" class = "slider" :id="`fm-multiplier`"
                        v-model.number="this.tfParams.fm_multi"
                        min="0.1" max="2" step="0.05"
                    >
                </div>
            </div>
            <positive-only-signal
                :data="transferFunction"
                :canvasId="'transfer-function'"
                :title="'Ekvivalentni prenosni kanal'"
                :verticalPool="[1, 0.5, -0.5, -1]"
                :description="''"
                :note="''"
                :isBinary=false
                :xTicks="{
                    'text':['ts1=t0','ts2','ts3','ts4','ts5'],
                    'pos':[
                        this.tfParams.t0+0*this.binarySymbolLength,
                        this.tfParams.t0+1*this.binarySymbolLength,
                        this.tfParams.t0+2*this.binarySymbolLength,
                        this.tfParams.t0+3*this.binarySymbolLength,
                        this.tfParams.t0+4*this.binarySymbolLength]
                        }"
                :isInverted=true
                :speed="speed"
            ></positive-only-signal>

            <app-button-container>
                <app-button
                    :class="[speed === sp ? 'dark:bg-blue-500 bg-blue-500': '']"
                    @click="changeSpeed(sp)"
                    v-for="sp in possibleSpeeds" :key="sp">
                    {{ sp }}x
                </app-button>
            
            
                <div @click = "togglePlay()"
                    class="switcher__tab w-20 cursor-pointer flex flex-row relative bg-gray-200 dark:bg-gray-700 p-1 rounded-3xl items-center justify-center h-8 transition-all duration-300 ">
                    <div v-for="state in states" 
                        :key="state.key"
                        :class="[mode === state.key ? 'switcher__front' : 'switcher__back']"
                        class="flex flex-row justify-center items-center w-full h-full absolute top-0 left-0 transition-transform duration-300">
                        <font-awesome-icon :icon = "state.icon" class = "text-sm mr-1 text-gray-800 transition-colors duration-300 dark:text-white"></font-awesome-icon>
                        <p class="text-sm text-gray-800 dark:text-white transition-colors duration-300 select-none font-medium">
                            {{ state.label }}
                        </p>
                    </div>
                </div>
            </app-button-container>
            <br>
            

            <level4-signal
                :data="binaryLevel4Signal.values"
                :title="'4-nivojski bipolarni signal'"
                :description="''"
                :note="''"
                :isBinary=true
                :speed="speed"
            ></level4-signal>

            <positive-only-signal
                :data="conv"
                :canvasId="'distorted-signal'"
                :title="'Popačen signal na izhodu prenosnega kanala'"
                :verticalPool="[3, 1.5, -1.5, -3]"
                :description="'Signal na izhodu je konvolucija med vhodnim signalom in prenosno funkcijo kanala'"
                :note="''"
                :isBinary=false
                :xTicks="{'text':['ts','ts','ts','ts','ts'],'pos':tsTicks}"
                :isInverted=false
                :absMax="this.tfParams.max_convoluted_value"
                :speed="speed"
            ></positive-only-signal>

            <oscilloscope
                :data = "dataISI"
                :canvasId = "'eye-diagram'"
                :name = "'Očesni diagram'"
                :symbolLength = "binarySymbolLength"
                :speed="speed"
                :ticks="oscTicks"
            ></oscilloscope> 

            <div @click = "clearOscilloscope"
                class="switcher__tab w-20 cursor-pointer flex flex-row relative bg-gray-200 dark:bg-gray-700 p-1 rounded-3xl items-center justify-center h-8 transition-all duration-300">
                <div  
                    :class="'switcher__front'"
                    class="flex flex-row justify-center items-center w-full h-full absolute top-0 left-0 transition-transform duration-300">
                    <font-awesome-icon :icon = "['fas', 'trash-alt']" class = "text-sm mr-1 text-gray-800 transition-colors duration-300 dark:text-white"></font-awesome-icon>
                    <p class="text-sm text-gray-800 dark:text-white transition-colors duration-300 select-none font-medium">
                        Počisti
                    </p>
                </div>
            </div>

        </main>
    </div>
</template>

<script>
import AppButtonContainer from "@/js/components/common/buttons/AppButtonContainer.vue";
import AppButton from "@/js/components/common/buttons/AppButton.vue";
import AppCollapsible from "@/js/components/common/AppCollapsible.vue";
import TheoryIsi from "@/js/components/theory/TheoryIsi.vue";
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
    name: "ISI",
    components : {Oscilloscope, Level4Signal, PositiveOnlySignal,FontAwesomeIcon,AppMainHeading,AppButtonContainer,AppButton,AppCollapsible,TheoryIsi},
    data(){
        return {
            /** @type {number} */
            speed: 1,

            possibleSpeeds: [1,2,3,4,5],

            /** @type {number} */
            binaryCounter: 0,

            /** @type {number} */
            binarySymbolLength: 120,

            /** @type {number} */
            binarySymbolLengthInit: 120,

            /** @type {number} */
            fs: 1/this.binarySymbolLength, 

            /** @type {number} */
            signalLength: 600,

            /** 4 level signal
             * @type {BinarySignal} */
            binaryLevel4Signal: {
                values: [...Array(600).fill(0)],
                pool: [-3, -1, 1, 3],
                currentlyReturns: 1,
            },

            combinationsSequence: {
                values : [-1,-3,3,3,1,-1,3,-3,-3,1,3,-1,1,1,-3,-1,-3,1,1,-1,3,1,-3,-3,3,-1,1,3,3,-3,-1],
                idx : 0
            },
        

            /** received signal, f*g convolution
             * @type {number[]} */
            conv: [...Array(600).fill(0)],

            /** @type {number[]} */
            transferFunction: [...Array(600).fill(0)],
            tfParams: {
                fm_multi: 1,
                fm_multi_old: 0,
                fm: 1/120,
                t0: 120/2,
                t0_old: 120/2,
                a: 1,
                max_convoluted_value: 3
            },

            tsTicks : [],

            dataPartial : [],
            
            dataISI : Array.from(Array(1), () => new Array()),

            oscTicks : [],

            /** @type {number[]} */
            timeValues: [...Array(600).fill(0)].map((t, i) => i * 0.005),

             /**
             * Objects in this array determine which canvases will be drawn
             * @type {Array<Modulation>}
             */           
            modulations: [
                {
                    label: '4ASK',
                    key: '4ask',
                    description: '4ASK modulacijo pridobimo z množenjem digitalnega niza {-3,-1,1,3} in harmoničnega nosilca.',
                    note: '4ASK modulacija sicer predpostavlja 4 različne amplitude nivoje. Izkaže pa se, da je to neekonomično, ker porabi več energije. Zato v praksi 4ASK izvedemo z dvemi amplitudnimi nivoji in dvemi fazami.',
                    hasCarrier: true,
                    hasSineModulation: false,
                    hasBinaryLevel1: false,
                    hasBinaryLevel2: false,
                    hasBinaryLevel4: true,
                },

            ],
            // PLAY PAUSE BUTTON
            states: [
                {
                    key: 'stop',
                    label: 'Play',
                    icon: ['fas', 'play']
                },
                {
                    key: 'play',
                    label: 'Stop',
                    icon: ['fas', 'stop']
                },
            ],

            /**
             * Objects in this array determine which canvases will be drawn
             * @type {String}
             */             
            play: 'play',
        }
    },
    computed: {
        mode() {
            //return this.$store.state.app.state;
            return this.play;
        },
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
         * @param {BinarySignal} obj
         * @returns {number}
         */
        nextBinaryValue(obj) {
            if (this.binaryCounter === (this.binarySymbolLength-1)) {
                let random = false;
                if (random){
                    let idx = Math.floor(Math.random()*4);
                    obj.currentlyReturns = this.binaryLevel4Signal.pool[idx];
                }else{
                    this.combinationsSequence.idx = this.combinationsSequence.idx + 1;
                    if(this.combinationsSequence.idx === this.combinationsSequence.values.length){
                        this.combinationsSequence.idx = 0;
                    }              
                    obj.currentlyReturns = this.combinationsSequence.values[this.combinationsSequence.idx];
                }
            }else{
                obj.currentlyReturns = 0;
            }
            return obj.currentlyReturns;
        },

        /**
         * is called when speed changes (buttons)
         * 
         */
        changeSpeed(sp){
            if(sp > this.speed){
                // if speed increases == signal data gets shorter take every <speed>-th element
                this.binaryLevel4Signal.values = this.binaryLevel4Signal.values.filter((i,t) => t % this.speed === 0);
            }else{
                // if speed decreases == signal data gets longer copy every element <speed>-th times
                this.binaryLevel4Signal.values = this.binaryLevel4Signal.values.filter((i,t) => t % this.speed === 0);
            }
            this.speed = sp;
            this.binarySymbolLength = this.binarySymbolLengthInit/this.speed;
            this.signalLength = 600/this.speed;

            this.updateTfParams();
            this.recalculateTicks(true)

            this.binaryLevel4Signal.values = [];
            this.binaryCounter = 0;
            this.conv = [];
            this.dataPartial = [];
            this.dataISI = Array.from(Array(1), () => new Array());
        },

        recalculateTicks(reset){
            if(reset){
                this.tsTicks = [...Array(Math.floor(this.signalLength/this.binarySymbolLength)).fill(0)]; // reset ticks
                for (var i = 0; i < this.tsTicks.length; i++){
                    this.tsTicks[i] = (i+this.tfParams.t0/this.binarySymbolLength)*this.binarySymbolLength;
                }
            }else{
                for (i = 0; i < this.tsTicks.length; i++){
                    let dt0 = this.tfParams.t0 - this.tfParams.t0_old;
                    this.tsTicks[i] = this.tsTicks[i]-dt0;
                }
                this.tsTicks.map(i => i >= (this.signalLength - 1) ? i - this.signalLength : i); // cut ticks that are out of range
                this.tfParams.t0_old = this.tfParams.t0;
            }

            this.oscTicks = [];
            for(i = 0; i <= 2; i++){
                this.oscTicks[i] = this.tfParams.t0 + i*this.binarySymbolLength;
                if (this.oscTicks[i] >= 2*this.binarySymbolLength){
                    this.oscTicks[i] = this.oscTicks[i] - 2*this.binarySymbolLength;
                }
            }
        },

        /**
         * is called when fm_multi changes (slider) by callback setInterval
         * is called by changeSpeed()
         * 
         * 
         */
        updateTfParams(){
            this.tfParams.fm = 1*1/this.binarySymbolLength,  //                    
            this.tfParams.t0 = 0.5*1/(this.tfParams.fm*this.tfParams.fm_multi); 

            this.recalculateTicks(false)
            this.updateTransferFunction();
        },

        /**
         * Calculates sinc transfer function
         * @param {number} fm
         * @param {number} t0
         * @param {number} a
         * @param {BinarySignal} obj
         * @returns {number}
         */
        updateTransferFunction(){
            let multi = this.tfParams.fm_multi;
            let fm = this.tfParams.fm;
            let t0 = this.tfParams.t0;
            let a  = this.tfParams.a;
            this.transferFunction = [...Array(this.signalLength).fill(0)];
            this.transferFunction = this.transferFunction.map((i,t) => Math.sin(2*Math.PI*fm*multi*(t-t0)/a)/(2*Math.PI*fm*multi*(t-t0)/a))
            this.transferFunction = this.transferFunction.map(i => isNaN(i) ? 1 : i); // 1/(t-t0); t=t0 => NaN
            
            let worstCaseSignal = [...Array(this.signalLength).fill(0)].map((tf,t) => t % this.binarySymbolLength === (this.binarySymbolLength - 1) ? 3 : 0);
            let worstCaseConvol = new Array;
            for(var n = 0; n < this.signalLength; n++){
                var conv = new Array;
                for(var m = 0; m <= (this.signalLength - n - 1); m++){
                    conv.push(this.transferFunction[m]*worstCaseSignal[m+n]);
                }
                worstCaseConvol.push(conv.reduce((a,b)=>a+b));
            }
            this.tfParams.max_convoluted_value = worstCaseConvol[Math.round(this.signalLength - 1 - this.tfParams.t0)];
            //this.tfParams.max_convoluted_value = this.transferFunction.map(tf => tf*3).reduce((a,b)=>a+b); // for square signal
        },


        /**
         * 
         * 
         */
        
        togglePlay(){
            this.play = this.play === 'play' ? 'stop' : 'play';
        },
        
        clearOscilloscope(){
            this.dataISI = Array.from(Array(1), () => new Array(600));
        },


    },
    mounted(){
        // Start time at 600 * 0.005, because we initiate arrays with 600 values already in
        let time = this.signalLength * 0.005;

        this.recalculateTicks(true)

        // Create interval to push new signal values to arrays
        this.intervalId = window.setInterval(() => {
            if (this.play === 'play'){
                if(this.tfParams.fm_multi_old != this.tfParams.fm_multi){
                    this.tfParams.fm_multi_old = this.tfParams.fm_multi;
                    this.updateTfParams()
                } 

                // CONVOLUTE
                let f = this.binaryLevel4Signal.values; 
                let g = this.transferFunction;
                
                // use map to multiply, use reduce to sum
                let conv0 = f.map((f,i)=>f*g[i]).reduce((a,b) => a+b,0);
                this.conv.unshift(conv0);

                // ISI oscilloscope plot
                this.dataPartial.push(conv0/this.tfParams.max_convoluted_value);
                this.dataISI[0] = this.dataPartial;

                if (this.dataPartial.length === 2*this.binarySymbolLength){
                    this.dataISI.unshift([]);
                    if (this.dataISI.length === this.combinationsSequence.values.length){
                        this.dataISI.pop();
                    }
                    this.dataPartial = [];
                }

                // Push new values to arrays
                this.binaryLevel4Signal.values.unshift(this.nextBinaryValue(this.binaryLevel4Signal));
                this.timeValues.unshift(time);
                this.tsTicks = this.tsTicks.map(i =>  i < (this.signalLength - 1) ? i+1 : 0);
                
                // Loop through arrays and remove last values if lengths are too big
                [
                    this.binaryLevel4Signal.values,
                    this.timeValues,
                    this.conv
                ].forEach(array => {
                    if (array.length > this.signalLength) {
                        array.pop();
                    }
                });
                time += 0.005;

                this.binaryCounter = (this.binaryCounter === (this.binarySymbolLength-1)) ? 0 : this.binaryCounter + 1;
            }  
        }, 30);
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

#buttons {
    width: 500px;
    height: 90px;
    background-color: yellow;
    overflow-x: auto;
}
</style>
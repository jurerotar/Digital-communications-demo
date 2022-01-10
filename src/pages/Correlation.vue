<template>
    <div class="lg:ml-72">
        <main class="p-4 container lg:mx-auto transition-colors duration-300 dark:bg-gray-800">
            <h1 class="text-3xl font-medium mb-4 transition-colors duration-300 dark:text-white">Korelacijska Funkcija</h1>
            <collapsible>
                <theory-correlation></theory-correlation>
            </collapsible>

            <h2 class="font-semibold text-xl mb-2 transition-colors duration-300 dark:text-white">Korelacija med:</h2>
            <button-container>
                <styled-button :class="{'dark:bg-blue-500 bg-blue-500': signal.label===signalType}" v-for="signal in signals" :key=signal.label @click="changeType(signal.label)">
                    {{signal.label}}
                </styled-button>
            </button-container>

            <template v-if="signalType==='Harmonični'">
                <h2 class="font-semibold text-xl mb-2 transition-colors duration-300 dark:text-white">Izbira drugega signala:</h2>
                <button-container>
                    <styled-button :class="{'dark:bg-blue-500 bg-blue-500': signals[0].choosedSignal===signal.key}" v-for="signal in signals[0].signal" :key=signal.key @click="changeSignal(signal.key, 'harmonični')">
                        {{signal.label}}
                    </styled-button>
                </button-container>
                <h2 class="font-semibold text-xl mb-2 transition-colors duration-300 dark:text-white">Izbira frekvence drugega signala:</h2>
                <button-container>
                    <styled-button :class="{'dark:bg-blue-500 bg-blue-500': signals[0].frequency===freq}" v-for="freq in signals[0].freqRange" :key=freq @click="changeFrequency(freq)">
                        {{freq}}
                    </styled-button>
                </button-container>
                <!-- Slider -->
                <div class="inline-flex flex-col mb-2">
                <label :for="'tau'" class="text-xl transition-colors duration-300 dark:text-white">Časovni zamik drugega signala <span class="font-semibold text-2xl">τ</span>: <span
                    class="font-medium"> {{ this.tau }}</span></label>
                <input type="range" :id="'tau'"
                       v-model.number="tau"
                       @change="updateTau(tau)"
                       min="-1" max="1" step="0.1"
                >
                </div>
                <full-signal
                    :canvas_id="'first-signal'"
                    :data="canvasInputFirstH"
                    :title="'Prvi Signal'"
                    :vertical_pool="[1, 0.5, -0.5, -1]"
                    :horizontal_pool=this.horizontal_pool
                    :type = type.firstSignal
                >
                </full-signal>
                <full-signal
                    :canvas_id="'second-signal'"
                    :data="canvasInputSecondH"
                    :title="'Drugi Signal'"
                    :vertical_pool="[1, 0.5, -0.5, -1]"
                    :horizontal_pool="horizontal_pool"
                    :type = type.secondSignal
                >
                </full-signal>
                <h2 class="font-semibold text-xl mb-2 transition-colors duration-300 dark:text-white">Rezultat korelacijske funkcije: {{correlationResult}}</h2>
                <full-signal
                    :canvas_id="'correlation-signal'"
                    :data="canvasInputCorrelationH"
                    :title="'Zmnožek prvega in drugega signala'"
                    :vertical_pool="[1, 0.5, -0.5, -1]"
                    :horizontal_pool="horizontal_pool"
                    :type = type.correlation
                >
                </full-signal>
            </template>

            <template v-if="signalType==='Impulzni'">
                <h2 class="font-semibold text-xl mb-2 transition-colors duration-300 dark:text-white">Izbira prvega signala:</h2>
                <button-container>
                    <styled-button :class="{'dark:bg-blue-500 bg-blue-500': signals[1].choosedFirstSignal===signal.key}" v-for="signal in signals[1].signal" :key=signal.key @click="changeSignal(signal.key, 'impulzni', 1)">
                        {{signal.label}}
                    </styled-button>
                </button-container>
                <h2 class="font-semibold text-xl mb-2 transition-colors duration-300 dark:text-white">Izbira drugega signala:</h2>
                <button-container>
                    <styled-button :class="{'dark:bg-blue-500 bg-blue-500': signals[1].choosedSecondSignal===signal.key}" v-for="signal in signals[1].signal" :key=signal.key @click="changeSignal(signal.key, 'impulzni', 2)">
                        {{signal.label}}
                    </styled-button>
                </button-container>
                <full-signal
                    :canvas_id="'first-signal'"
                    :data="canvasInputFirstI"
                    :title="'Prvi Signal'"
                    :vertical_pool="[1, 0.5, -0.5, -1]"
                    :horizontal_pool=this.horizontal_pool
                    :type = signals[1].choosedFirstSignal
                >
                </full-signal>
                <full-signal
                    :canvas_id="'second-signal'"
                    :data="canvasInputSecondI"
                    :title="'Drugi Signal'"
                    :vertical_pool="[1, 0.5, -0.5, -1]"
                    :horizontal_pool="horizontal_pool"
                    :type = signals[1].choosedSecondSignal
                >
                </full-signal>
                <!--<full-signal
                    :canvas_id="'correlation-signal'"
                    :data="canvasInputI"
                    :title="'Zmnožek prvega in drugega signala'"
                    :vertical_pool="[1, 0.5, -0.5, -1]"
                    :horizontal_pool="horizontal_pool"
                    :type = type.correlation
                >
                </full-signal>-->
            </template>
        </main>
    </div>
</template>

<script>
    import Collapsible from "@/components/global/Collapsible"
    import TheoryCorrelation from '../components/theory/TheoryCorrelation'
    import StyledButton from "../components/global/StyledButton.vue"
    import ButtonContainer from "../components/global/ButtonContainer.vue"
    import FullSignal from "@/components/canvas/FullSignal";

    export default {
        name: "Correlation",
        components: {Collapsible, TheoryCorrelation, StyledButton, ButtonContainer, FullSignal},
        data(){
            return{
                signalType: "Harmonični",
                signalSize: 2**11,
                xAxisArray: null,
                firstSignalArray: null, 
                secondSignalArray: null, 
                correlationSignalArray: null,
                frequency: null,
                horizontal_pool: [-1.5, -1.25, -1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1, 1.25, 1.5],
                typeLabel: 0, //0 for "Harmonični", 1 for "Impulzni"
                tau: 0,
                type: {
                    firstSignal: "first",
                    secondSignal: "second",
                    correlation: "correlation"
                },
                correlation: {
                    drawingValues: () => {
                        this.correlationSignalArray = this.multiplyArrays(this.firstSignalArray, this.secondSignalArray, this.xAxisArray.length)  
                        return this.correlationSignalArray
                    }         
                },
                signals: [
                    {
                        label: "Harmonični",
                        choosedSignal: "sin",
                        horizontal_pool: [-1.5, -1.25, -1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1, 1.25, 1.5],
                        freqRange: [1, 2, 3, 4, 5],
                        frequency: 1,
                        baseHarmonicSignal: {
                                key: "baseCos",
                                drawingValues: () => {
                                    this.firstSignalArray = this.xAxisArray.map(t => (Math.cos(Math.PI * t * 1 * 0.01 + 0.75)))   //0.75 je pi/2 
                                    return this.firstSignalArray
                                },
                        },
                        signal: [
                            {
                                key: "sin",
                                label: "Sin(2πft)",
                                drawingValues: () => {
                                    this.secondSignalArray = this.xAxisArray.map(t => (Math.sin(Math.PI * (t + 200*this.tau/this.signals[0].frequency) * this.signals[0].frequency * 0.01 + (0.75 - (this.signals[0].frequency-1)*2.4))))   //Začnemo z 0.75 in za vsako frekvenco se odšteje 2.4
                                    return this.secondSignalArray
                                },
                            },
                            {
                                key: "cos",
                                label: "Cos(2πft)",
                                drawingValues: () => {
                                    this.secondSignalArray = this.xAxisArray.map(t => (Math.cos(Math.PI * (t + 200*this.tau/this.signals[0].frequency) * this.signals[0].frequency * 0.01 + (0.75 - (this.signals[0].frequency-1)*2.4))))
                                    return this.secondSignalArray
                                },
                            },
                        ],
                    },
                    {
                        label: "Impulzni",
                        choosedFirstSignal: "square",
                        choosedSecondSignal: "square",
                        horizontal_pool: [-1.5, -1.25, -1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1, 1.25, 1.5],
                        signal: [
                            {
                                key: "square",
                                label: "Pravokotni Impulz",
                                drawingValues: () => {
                                   return this.impulse
                                }
                            },
                            {
                                key: "cos",
                                label: "Dvignjeni Kosinusni Impulz",
                                drawingValues: () => 0
                            },
                            {
                                key: "sin",
                                label: "Sinusni Impulz",
                                drawingValues: () => 0
                            },
                        ],
                    }
                ]
            }
        },
        methods: {
            changeType(signalType){
                if(signalType === "Harmonični"){
                    this.typeLabel = 0
                    this.horizontal_pool = this.signals[0].horizontal_pool
                }
                else{
                    this.typeLabel = 1
                    this.horizontal_pool = this.signals[1].horizontal_pool
                }
                this.signalType = signalType
            },
            changeSignal(signal, type, num = 0){
                if(type === "harmonični"){
                    this.signals[0].choosedSignal=signal
                }
                else{
                    if(num === 1){
                        this.signals[1].choosedFirstSignal=signal
                    }
                    else{
                        this.signals[1].choosedSecondSignal=signal
                    }
                }
            },
            findSignal(){
                if(this.signalType === "Harmonični"){
                    return [this.baseHarmonicSignal.key, this.signals[0].choosedSignal]
                }
                else{
                    return [this.signals[1].choosedFirstSignal, this.signals[1].choosedSecondSignal]
                }
            },
            cutArray(array) {
                const size = 600;
                return array.filter((el, index) => (index <=  size));
            },
            multiplyArrays(array1, array2, arrayLength){
                let multipliedArray = []
                for(let i = 0; i < arrayLength; i++){
                    multipliedArray[i] = -1*array1[i]*array2[i]
                }
                return multipliedArray
            },
            changeFrequency(frequency){
                this.signals[0].frequency = frequency
            },
            updateTau(value) {
                this.tau = value;
            },
        },
        created(){
            this.xAxisArray = [...[...Array(this.signalSize/2).keys()].map(el => el * -1 - 1).reverse(), ...Array(this.signalSize/2).keys()]
            this.firstSignalArray = [...[...Array(this.signalSize/2).keys()].map(el => el * -1 - 1).reverse(), ...Array(this.signalSize/2).keys()]
            this.secondSignalArray = [...[...Array(this.signalSize/2).keys()].map(el => el * -1 - 1).reverse(), ...Array(this.signalSize/2).keys()]
            this.correlationSignalArray = [...[...Array(this.signalSize/2).keys()].map(el => el * -1 - 1).reverse(), ...Array(this.signalSize/2).keys()]
        },
        computed: {
            canvasInputFirstH() {
                return this.cutArray(this.signals[0].baseHarmonicSignal.drawingValues())
            },
            canvasInputSecondH() {
                return this.cutArray(this.signals[0].signal.find(el => el.key === this.signals[0].choosedSignal).drawingValues())
            },
            canvasInputCorrelationH() {
                return this.cutArray(this.correlation.drawingValues())
            },
            canvasInputFirstI(){
                return this.cutArray(this.signals[1].signal.find(el => el.key === this.signals[1].choosedFirstSignal).drawingValues())
            },
            canvasInputSecondI(){
                return this.cutArray(this.signals[1].signal.find(el => el.key === this.signals[1].choosedSecondSignal).drawingValues())
            },
            canvasInputCorrelationI(){
                return this.cutArray(this.signals[1].signal.find(el => el.key === this.signals[1].choosedFirstSignal).drawingValues())
            },
            signal(){
                return this.findSignal()
            },
            correlationResult(){
                let N = this.xAxisArray.length
                let correlation = 0
                for(let i = 0; i < N; i++){
                    correlation -= this.correlationSignalArray[i]
                }
                correlation = correlation/N
                if(Math.abs(correlation) < 0.011){
                    correlation = 0
                }  
                return Math.floor(correlation*100)/100
            },
            impulse(){
                let impulse = []
                for(let i = 0; i < 600; i++){
                    if(i > 200 && i < 401){
                        impulse[i] = -1
                    }
                    else{
                        impulse[i] = 0
                    }
                }
                return impulse
            }
        }
    }
</script>
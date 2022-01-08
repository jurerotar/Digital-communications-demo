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
            <h2 class="font-semibold text-xl mb-2 transition-colors duration-300 dark:text-white" v-show="signalType==='Impulzni'">Izbira prvega signala:</h2>
            <button-container v-if="signalType==='Impulzni'">
                <styled-button :class="{'dark:bg-blue-500 bg-blue-500': signals[1].choosedFirstSignal===signal.key}" v-for="signal in signals[1].signal" :key=signal.key @click="changeSignal(signal.key, 'impulzni', 1)">
                    {{signal.label}}
                </styled-button>
            </button-container>
            <h2 class="font-semibold text-xl mb-2 transition-colors duration-300 dark:text-white">Izbira drugega signala:</h2>
            <button-container v-if="signalType==='Harmonični'">
                <styled-button :class="{'dark:bg-blue-500 bg-blue-500': signals[0].choosedSignal===signal.key}" v-for="signal in signals[0].signal" :key=signal.key @click="changeSignal(signal.key, 'harmonični')">
                    {{signal.label}}
                </styled-button>
            </button-container>
            <button-container v-if="signalType==='Impulzni'">
                <styled-button :class="{'dark:bg-blue-500 bg-blue-500': signals[1].choosedSecondSignal===signal.key}" v-for="signal in signals[1].signal" :key=signal.key @click="changeSignal(signal.key, 'impulzni', 2)">
                    {{signal.label}}
                </styled-button>
            </button-container>
            <full-signal
                :canvas_id="'first-signal'"
                :data="canvasInput"
                :title="'Prvi Signal'"
                :vertical_pool="[1, 0.5, -0.5, -1]"
                :horizontal_pool="[-1.5, -1.25, -1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1, 1.25, 1.5]"
                :type = signals[0].baseHarmonicSignal.key
            >
            </full-signal>
            <!--<full-signal
                :canvas_id="'second-signal'"
                :data="canvasInput"
                :title="'Drugi Signal'"
                :vertical_pool="[1, 0.5, -0.5, -1]"
                :horizontal_pool="horizontal_pool"
                :type = "signal[1]"
            >
            </full-signal>
            <full-signal
                :canvas_id="'correlation-signal'"
                :data="canvasInput"
                :title="'Zmnožek prvega in drugega signala'"
                :vertical_pool="[1, 0.5, -0.5, -1]"
                :horizontal_pool="horizontal_pool"
                :type = "correlation"
            >
            </full-signal>-->
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
                firstSignalArray: null, 
                secondSignalArray: null, 
                correlationSignalArray: null,
                frequency: null,
                horizontal_pool: [-0.5, 0, 0.5],
                typeLabel: 0, //0 for "Harmonični", 1 for "Impulzni"
                signals: [
                    {
                        label: "Harmonični",
                        choosedSignal: "sin",
                        horizontal_pool: [-0.5, 0, 0.5],
                        baseHarmonicSignal: {
                            key: "baseCos",
                            drawingValues: () => this.firstSignalArray.map(t => (Math.cos(Math.PI * t * 1 * 0.01 + 1.5))*this.unitBox(t)),    //1.5 je pi/2
                        },
                        signal: [
                            {
                                key: "sin",
                                label: "Sin(2πf*t)",
                                drawingValues: () => 0
                            },
                            {
                                key: "cos",
                                label: "Cos(2πf*t)",
                                drawingValues: () => 0
                            }
                        ],
                        freqRange: null
                    },
                    {
                        label: "Impulzni",
                        choosedFirstSignal: "pravokotni",
                        choosedSecondSignal: "pravokotni",
                        horizontal_pool: [-1, -0.5, 0, 0.5, 1],
                        signal: [
                            {
                                key: "pravokotni",
                                label: "Pravokotni Impulz",
                                drawingValues: () => 0
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
            unitBox(n) {
                return (n <= 1/2) ? 1 : 0;
            },
        },
        created(){
            this.firstSignalArray = [...[...Array(this.signalSize).keys()].map(el => el * -1 - 1).reverse(), ...Array(this.signalSize).keys()]
            this.secondSignalArray = [...[...Array(this.signalSize).keys()].map(el => el * -1 - 1).reverse(), ...Array(this.signalSize).keys()]
            this.correlationSignalArray = [...[...Array(this.signalSize).keys()].map(el => el * -1 - 1).reverse(), ...Array(this.signalSize).keys()]
        },
        computed: {
            canvasInput() {
                return this.signals[0].baseHarmonicSignal.drawingValues()
            },
            signal(){
                return this.findSignal()
            }
        }
    }
</script>
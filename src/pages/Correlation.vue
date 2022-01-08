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
        </main>
    </div>
</template>

<script>
    import Collapsible from "@/components/global/Collapsible"
    import TheoryCorrelation from '../components/theory/TheoryCorrelation'
    import StyledButton from "../components/global/StyledButton.vue"
    import ButtonContainer from "../components/global/ButtonContainer.vue"

    export default {
        name: "Correlation",
        components: {Collapsible, TheoryCorrelation, StyledButton, ButtonContainer},
        data(){
            return{
                signalType: "Harmonični",
                signalSize: 2**11,
                signalArray: null,
                frequency: null,
                signals: [
                    {
                        label: "Harmonični",
                        choosedSignal: "sin",
                        signal: [
                            {
                                key: "sin",
                                label: "Sin(2πf*t)"
                            },
                            {
                                key: "cos",
                                label: "Cos(2πf*t)",
                            }
                        ],
                        freqRange: null
                    },
                    {
                        label: "Impulzni",
                        choosedFirstSignal: "pravokotni",
                        choosedSecondSignal: "pravokotni",
                        signal: [
                            {
                                key: "pravokotni",
                                label: "Pravokotni Impulz"
                            },
                            {
                                key: "cos",
                                label: "Dvignjeni Kosinusni Impulz"
                            },
                            {
                                key: "sin",
                                label: "Sinusni Impulz"
                            },
                        ],
                    }
                ]
            }
        },
        methods: {
            changeType(signalType){
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
            }
        },
    }
</script>
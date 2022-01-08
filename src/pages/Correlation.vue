<template>
    <div class="lg:ml-72">
        <main class="p-4 container lg:mx-auto transition-colors duration-300 dark:bg-gray-800">
            <h1 class="text-3xl font-medium mb-4 transition-colors duration-300 dark:text-white">Korelacijska Funkcija</h1>
            <collapsible>
                <theory-correlation></theory-correlation>
            </collapsible>
            <h2 class="font-semibold text-xl mb-2 transition-colors duration-300 dark:text-white">Korelacija med:</h2>
            <button-container>
                <styled-button :class="ButtonStyle">
                    Harmonični signali
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
                ButtonStyle:{
                    'dark:bg-blue-500 bg-blue-500': true
                },
                signalType: [
                    {
                        type: "Harmonični"
                    },
                    {
                        type: "Impulzni"
                    }
                ]
            }
        }
    }
</script>
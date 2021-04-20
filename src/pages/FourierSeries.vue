<template>
    <h1 class="text-3xl font-medium mb-4">Fouriereva vrsta</h1>
    <div class="flex flex-col mb-4">
        <p class="flex">Z drsniki lahko vplivaš število komponent signala, frekvenco in amplitudo posameznega signala.</p>
        <p class="inline-flex text-red-500 font-bold">Opozorilo: pri visokem številu komponent ali pri visoki frekvenci lahko pride do težav pri izrisu.</p>
    </div>
    <collapsible>Burek</collapsible>
    <fourier v-for = "canvas in canvases" :key = "canvas.id" :id = "canvas.id"></fourier>
    <styled-button :color = "'green'" @click = "createCanvas()">Ustvari nov graf</styled-button>
</template>

<script>
import Fourier from "@/components/modules/fourier-series/Fourier";
import StyledButton from "@/components/global/StyledButton";
import Collapsible from "@/components/global/Collapsible";
export default {
    name: "FourierSeries",
    components: {Collapsible, StyledButton, Fourier},
    computed: {
        canvases() {
            return this.$store.state.fourierSeries.canvases;
        }
    },
    methods: {
        createCanvas() {
            this.$store.commit('fourierSeries/createCanvas');
        }
    }
}
</script>
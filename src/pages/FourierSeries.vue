<template>
    <h1 class="text-3xl font-medium mb-4">Fouriereva vrsta</h1>
    <fourier v-for = "canvas in canvases" :key = "canvas.id" :id = "canvas.id"></fourier>
    <styled-button :color = "'green'" @click = "createCanvas()">Ustvari nov graf</styled-button>
</template>

<script>
import Fourier from "@/components/modules/fourier-series/Fourier";
import StyledButton from "@/components/global/StyledButton";
export default {
    name: "FourierSeries",
    components: {StyledButton, Fourier},
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
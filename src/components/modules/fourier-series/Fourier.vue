<template>
    <div class="flex flex-col">
        <div class="flex flex-col justify-between md:flex-row">
            <div class = "flex flex-col">
                <h2 class="text-xl font-medium mb-4">Fouriereva vrsta z {{ validatedAmountOfComponents }} {{ singularOrPlural }}</h2>
                <div class="flex flex-col mb-4">
                    <p class="flex">Z drsnikom lahko vplivaš število komponent signala.</p>
                    <p class="inline-flex"><span class = "mr-2 font-bold">Opozorilo:</span> pri visokem številu komponent lahko pride do težav pri izrisu.</p>
                </div>
                <input type="range" :id="`range-${id}`" v-model="amountOfComponents" @change="updateAmountOfComponents()"
                       min="1" max="25" step="1">
            </div>
            <styled-button v-if = "id !== 1" :color = "'red'" @click = "destroyCanvas(id)">Izbriši graf</styled-button>
        </div>
        <canvas-container>
            <div :id="`canvas-${id}`" class = "my-4"></div>
        </canvas-container>
    </div>
</template>

<script>
/**
 * peaka na signalih se reče gibsonov efekt
 *
 */
import P5 from 'p5';
import StyledButton from "@/components/global/StyledButton";
import CanvasContainer from "@/components/global/CanvasContainer";

export default {
    name: "Fourier",
    components: {CanvasContainer, StyledButton},
    data() {
        return {
            /**
             * Amount of components to use in calculation
             */
            amountOfComponents: 1,

            /**
             * Increase this to get different values from sin and cos functions
             */
            time: 0,

            /**
             * Store previous values in this array
             */
            wave: [],
        }
    },
    mounted() {
        this.amountOfComponents = this.canvasProperties.components;
        /**
         * Initiate new P5 instance and create canvas
         */
        new P5((p5) => {
            this.$c.setup(p5);
            p5.draw = () => {
                p5.background(0);
                p5.translate(150, 200);

                let x = 0;
                let y = 0;

                for (let i = 0; i < this.validatedAmountOfComponents; i++) {
                    const previousX = x;
                    const previousY = y;

                    let n = i * 2 + 1;
                    let radius = 75 * (4 / (n * Math.PI));
                    x += radius * Math.cos(n * this.time);
                    y += radius * Math.sin(n * this.time);

                    p5.stroke(255, 100);
                    p5.noFill();
                    p5.ellipse(previousX, previousY, radius * 2);

                    p5.fill(255);
                    p5.stroke(255);
                    p5.line(previousX, previousY, x, y);
                    p5.ellipse(x, y, 3);
                }
                this.wave.unshift(y);

                p5.translate(200, 0);
                p5.line(x - 200, y, 0, this.wave[0]);
                p5.beginShape();
                p5.noFill();
                for (let i = 0; i < this.wave.length; i++) {
                    p5.vertex(i, this.wave[i]);
                }
                p5.endShape();

                this.time += 0.05;

                if (this.wave.length > 250) {
                    this.wave.pop();
                }
            }
        }, `canvas-${this.id}`);
    },
    computed: {
        canvasProperties() {
            return this.$store.getters['fourierSeries/canvasById'](this.id);
        },
        singularOrPlural() {
            return (this.validatedAmountOfComponents) > 1 ? 'komponentami' : 'komponento';
        },
        validatedAmountOfComponents() {
            return (this.amountOfComponents > 25) ? 25 : this.amountOfComponents;
        }
    },
    methods: {
        /**
         * Updates canvasProperties object in the store with the current number of components
         */
        updateAmountOfComponents() {
            this.$store.commit('fourierSeries/updateAmountOfComponents', this.id, this.validatedAmountOfComponents);
        },
        /**
         * Removes canvas from the store
         */
        destroyCanvas() {
            this.$store.commit('fourierSeries/removeCanvas', this.id);
        }
    },
    props: {
        id: {
            type: Number,
            required: true,
        }
    }
}
</script>
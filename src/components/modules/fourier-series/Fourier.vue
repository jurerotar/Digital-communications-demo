<template>
    <div class="flex flex-col">
        <div class="flex flex-col justify-between md:flex-row">
            <div class = "flex flex-col">
                <h2 class="text-xl font-medium mb-4">Fouriereva vrsta z <span class = "underline font-bold">{{ components }}</span> {{ singularOrPlural }}</h2>
                <div class="flex flex-col mb-2">
                    <label :for = "`fourier-series-components-${id}`" class = "text-xl">Število komponent</label>
                    <input type="range" :id="`fourier-series-components-${id}`"
                           v-model.number="components" @change="updateProperty('components', components)"
                           min="1" max="25" step="1">
                </div>
                <div class="flex flex-col mb-2">
                    <label :for = "`fourier-series-frequency-${id}`" class = "text-xl">Frekvenca</label>
                    <input type="range" :id="`fourier-series-frequency-${id}`"
                           v-model.number="frequency" @change="updateProperty('frequency', frequency)"
                           min="0" max="1" step="0.1">
                </div>
                <div class="flex flex-col mb-2">
                    <label :for = "`fourier-series-amplitude-${id}`" class = "text-xl">Amplituda</label>
                    <input type="range" :id="`fourier-series-amplitude-${id}`"
                           v-model.number="amplitude" @change="updateProperty('amplitude', amplitude)"
                           min="0" max="1" step="0.1">
                </div>
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
 */
import P5 from 'p5';
import StyledButton from "@/components/global/StyledButton";
import CanvasContainer from "@/components/global/CanvasContainer";

export default {
    name: "Fourier",
    components: {CanvasContainer, StyledButton},
    data() {
        return {
            time: 0,
            components: 1,
            frequency: 0.1,
            amplitude: 0.7,
            /**
             * Store previous values in this array
             */
            wave: [],
        }
    },
    mounted() {
        this.components = this.canvasProperties.components;
        this.frequency = this.canvasProperties.frequency;
        this.amplitude = this.canvasProperties.amplitude;
        /**
         * Initiate new P5 instance and create canvas
         */
        new P5((p5) => {
            this.$c.setup(p5);
            p5.draw = () => {
                p5.background(255);
                this.$c.drawAxis(p5, 180, 150);
                p5.translate(180, 150);

                let x = 0;
                let y = 0;
                p5.stroke(0);
                for (let i = 0; i < this.components; i++) {
                    const previousX = x;
                    const previousY = y;

                    const n = i * 2 + 1;
                    const radius = this.amplitude * 80 * (4 / (n * Math.PI));
                    x += radius * Math.cos(n * this.time);
                    y += radius * Math.sin(n * this.time);

                    // p5.stroke(255, 100);
                    p5.noFill();
                    p5.ellipse(previousX, previousY, radius * 2);

                    //p5.fill(255);
                    //p5.stroke(220);
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
                this.time += this.frequency * (1/2);

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
            return (this.components) > 1 ? 'komponentami' : 'komponento';
        },
    },
    methods: {
        /**
         * @param {string} propertyName
         * @param {number} value
         */
        updateProperty(propertyName, value) {
            this.$store.commit('fourierSeries/updateProperty', this.id, propertyName, value);
        },
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
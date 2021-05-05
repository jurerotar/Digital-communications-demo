<template>
    <h2 class="font-semibold text-xl">Binarni signal</h2>
    <canvas-container>
        <div id="square-wave"></div>
    </canvas-container>
</template>

<script>
import P5 from 'p5';
import CanvasContainer from "@/components/global/CanvasContainer";
export default {
    name: "SquareWave",
    components: {CanvasContainer},
    data() {
        return {
            p5: null,
            counter: 0,
            returnsOnes: false,
            previousValue: 0,
            offset: {
                x: 0,
                y: 150
            },
        }
    },
    mounted() {
        // Initiate new P5 instance and create canvas
        this.p5 = new P5((p5) => {
            this.$c.setup(p5);
            p5.draw = () => {
                p5.background(255);
                const value = this.nextValue();

                // Draw axis and move center to defined offset coordinates
                this.$c.drawAxis(p5, this.offset.x, this.offset.y);
                p5.translate(this.offset.x, this.offset.y);

                // Push value to the store array to be available for other components
                this.$store.commit('modulations/addValueToArray', ['squareWaveValues', value]);


                p5.noFill();
                p5.stroke(this.$c.colors[1]);
                p5.strokeWeight(3);

                // Draw the shape
                p5.beginShape();
                this.values.forEach((y, x) => {
                    p5.vertex((this.previousValue !== y) ? x - 1 : x, y * 80)
                    this.previousValue = y;
                });
                p5.endShape();

                // Remove last value
                if (this.values.length > 600) {
                    this.$store.commit('modulations/removeValueFromArray', 'squareWaveValues');
                }
            }
            // Push remove method to p5 object
            p5.removeCanvas = () => p5.remove();
        }, 'square-wave');
    },
    unmounted() {
        // Remove canvas, otherwise P5 object stays in memory and pushes new values to the array
        this.p5.removeCanvas();
    },
    methods: {
        /**
         * Generates the next number for squareWave array based on counter value. Values can span from 1 - 0 or 1 - -1,
         * based on modulation type
         * @returns {number}
         */
        nextValue() {
            if(this.counter === 150) {
                this.returnsOnes = !this.returnsOnes;
                this.counter = 0;
            }
            this.counter ++;
            return (this.returnsOnes) ? 1 : this.span;
        }
    },
    computed: {
        /**
         * Returns currently selected key
         * @returns {string}
         */
        selected() {
            return this.$store.state.modulations.selected;
        },
        /**
         * Returns either 0 or -1 for square wave bottom values
         * @returns {number}
         */
        span() {
            const bipolarSignals = ['bpsk'];
            return (bipolarSignals.includes(this.selected)) ? -1 : 0;
        },
        /**
         * Returns values from carrierWave array in store
         * @returns {number[]}
         */
        values() {
            return this.$store.state.modulations.squareWaveValues;
        },
    }
}
</script>

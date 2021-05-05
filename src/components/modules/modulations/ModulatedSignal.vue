<template>
    <h2 class="font-semibold text-xl">Moduliran signal</h2>
    <canvas-container>
        <div id="modulated-wave"></div>
    </canvas-container>
</template>

<script>
import P5 from 'p5';
import CanvasContainer from "@/components/global/CanvasContainer";
export default {
    name: "ModulatedSignal",
    components: {CanvasContainer},
    data() {
        return {
            offset: {
                x: 0,
                y: 150
            },
            values: [],
        }
    },
    mounted() {
        this.values = [];
        // Initiate new P5 instance and create canvas
        new P5((p5) => {
            this.$c.setup(p5);
            p5.draw = () => {
                p5.background(255);
                //const value = Math.sin(2 * Math.PI * this.time);


                // Draw axis and move center to defined offset coordinates
                this.$c.drawAxis(p5, this.offset.x, this.offset.y);
                p5.translate(this.offset.x, this.offset.y);

                // Calculate values by multiplying elements of both arrays
                this.values = this.carrierValues.map((el, index) => el * this.modulationValues[index]);


                p5.noFill();
                p5.stroke(this.$c.colors[2]);
                p5.strokeWeight(3);

                // Draw the shape
                p5.beginShape();
                this.values.forEach((y, x) => p5.vertex(x, y * 80));
                p5.endShape();
            }
        }, 'modulated-wave');
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
         * Returns values from carrierWave array in store
         * @returns {number[]}
         */
        carrierValues() {
            return this.$store.state.modulations.carrierWaveValues;
        },
        /**
         * Returns values from selected array in store
         * @returns {number[]}
         */
        modulationValues() {
            const modulations = (['am'].includes(this.selected)) ? 'sineModulationWaveValues' : 'squareWaveValues';
            return this.$store.state.modulations[modulations];
        }
    },
}
</script>
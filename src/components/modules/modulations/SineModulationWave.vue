<template>
    <h2 class="font-semibold text-xl">Sinusni modulacijski signal</h2>
    <canvas-container>
        <div id="sine-modulation-wave"></div>
    </canvas-container>
</template>

<script>
import P5 from 'p5';
import CanvasContainer from "@/components/global/CanvasContainer";

export default {
    name: "SineModulationWave",
    components: {CanvasContainer},
    data() {
        return {
            p5: null,
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
                const value = Math.sin(Math.PI * this.time);


                // Draw axis and move center to defined offset coordinates
                this.$c.drawAxis(p5, this.offset.x, this.offset.y);
                p5.translate(this.offset.x, this.offset.y);

                // Push value to the store array to be available for other components
                this.$store.commit('modulations/addValueToArray', ['sineModulationWaveValues', value]);


                p5.noFill();
                p5.stroke(this.$c.colors[1]);
                p5.strokeWeight(3);

                // Draw the shape
                p5.beginShape();
                this.values.forEach((y, x) => p5.vertex(x, y * 80));
                p5.endShape();

                // Remove last value
                if (this.values.length > 600) {
                    this.$store.commit('modulations/removeValueFromArray', 'sineModulationWaveValues');
                }
            }
            // Push remove method to p5 object
            p5.removeCanvas = () => p5.remove();
        }, 'sine-modulation-wave');
    },
    beforeUnmount() {
        // Remove canvas, otherwise P5 object stays in memory and pushes new values to the array
        this.p5.removeCanvas();
    },
    computed: {
        /**
         * Returns values from sineModulationWave array in store
         * @returns {number[]}
         */
        values() {
            return this.$store.state.modulations.sineModulationWaveValues;
        },
        /**
         * Returns store time used to calculate sine values
         * @returns {number}
         */
        time() {
            return this.$store.state.modulations.time;
        }
    }
}
</script>
<template>
    <h2 class="font-semibold text-xl">Nosilec</h2>
    <canvas-container>
        <div id="carrier-wave"></div>
    </canvas-container>
</template>

<script>
import P5 from 'p5';
import CanvasContainer from "@/components/global/CanvasContainer";
export default {
    name: "CarrierWave",
    components: {CanvasContainer},
    data() {
        return {
            offset: {
                x: 0,
                y: 150
            },
        }
    },
    mounted() {
        // Initiate new P5 instance and create canvas
        new P5((p5) => {
            this.$c.setup(p5);
            p5.draw = () => {
                p5.background(255);
                const value = Math.sin(10 * Math.PI * this.time);


                // Draw axis and move center to defined offset coordinates
                this.$c.drawAxis(p5, this.offset.x, this.offset.y);
                p5.translate(this.offset.x, this.offset.y);

                // Push value to the store array to be available for other components
                this.$store.commit('modulations/addValueToArray', ['carrierWaveValues', value]);


                p5.noFill();
                p5.stroke(this.$c.colors[0]);
                p5.strokeWeight(3);

                // Draw the shape
                p5.beginShape();
                this.values.forEach((y, x) => p5.vertex(x, y * 80));
                p5.endShape();

                // Remove last value
                if (this.values.length > 600) {
                    this.$store.commit('modulations/removeValueFromArray', 'carrierWaveValues');
                }

                // Carrier is responsible for setting the time for other components
                this.$store.commit('modulations/setTime', this.time + 0.005);
            }
            p5.removeCanvas = () => p5.remove();
        }, 'carrier-wave');
    },
    unmounted() {
        // Remove canvas, otherwise P5 object stays in memory and pushes new values to the array
        this.p5.removeCanvas();
    },
    computed: {
        /**
         * Returns values from carrierWave array in store
         * @returns {number[]}
         */
        values() {
            return this.$store.state.modulations.carrierWaveValues;
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
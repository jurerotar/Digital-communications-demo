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
            modulationMethods: {
                am: (carrier = this.carrierValues, sine = this.sineModulationWaveValues) => carrier.map((el, index) => el * sine[index]),
                fm: (sine = this.sineModulationWaveValues) => {
                    return sine.map((el) => {
                        const multiplier = (el < 0) ? 2 : 0.4;
                        return Math.sin(10 * Math.PI * multiplier);
                    })
                },
                bpsk: (carrier = this.carrierValues, binary = this.squareWaveValues) => carrier.map((el, index) => el * binary[index]),
                bask: (carrier = this.carrierValues, binary = this.squareWaveValues) => carrier.map((el, index) => el * binary[index]),
            }
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
                this.values = this.modulationMethods[this.selected]();


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
         * Returns modulations array from store
         * @returns {object[]}
         */
        modulations() {
            return this.$store.state.modulations.modulations;
        },
        /**
         * Finds currently selected modulation from modulations property by selected key
         * @returns {object}
         */
        selectedModulationData() {
            return this.modulations.find(el => el.key === this.selected);
        },
        /**
         * Returns values from carrierWave array in store
         * @returns {number[]}
         */
        carrierValues() {
            return this.$store.state.modulations.carrierWaveValues;
        },
        /**
         * Returns values from squareWaveValues array in store
         * @returns {number[]}
         */
        squareWaveValues() {
            return this.$store.state.modulations.squareWaveValues;
        },
        /**
         * Returns values from sineModulationWaveValues array in store
         * @returns {number[]}
         */
        sineModulationWaveValues() {
            return this.$store.state.modulations.sineModulationWaveValues;
        },
        /**
         * Returns store time used to calculate sine values
         * @returns {number}
         */
        time() {
            return this.$store.state.modulations.time;
        }
    },
}
</script>
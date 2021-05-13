<template>
    <h2 class="font-semibold text-xl">Spekter</h2>
    <canvas-container>
        <div id = "canvas-spectrum"></div>
    </canvas-container>
</template>

<script>
import P5 from 'p5';
import CanvasContainer from "@/components/global/CanvasContainer";

export default {
    name: "SignalSpectrum",
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
        /**
         * Initiate new P5 instance and create canvas
         */
        new P5((p5) => {
            this.$c.setup(p5);
            p5.draw = () => {
                // Recolor canvas on each draw to remove previous lines
                p5.background(255);

                // Draw axis and move center to defined offset coordinates
                this.$c.drawAxis(p5, this.offset.x, this.offset.y);
                p5.translate(this.offset.x, this.offset.y);

                p5.noFill();
                p5.stroke(this.$c.colors[1]);
                p5.strokeWeight(2);

                p5.beginShape();
                this.data.map((el, index) => p5.vertex(index, -Math.abs((el * 80))));
                p5.endShape();
            }
        }, `canvas-spectrum`);
    },
    props:{
       data:{
           type: Array,
           required: true,
       }
    },
}
</script>
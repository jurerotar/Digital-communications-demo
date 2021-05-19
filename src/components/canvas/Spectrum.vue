<template>
    <h2 class="font-semibold text-xl">{{ title }}</h2>
    <canvas-container>
        <div :id="canvas_id"></div>
    </canvas-container>
</template>

<script>
import P5 from 'p5';
import CanvasContainer from "@/components/global/CanvasContainer";
export default {
    name: "SpectrumCanvas",
    components: {CanvasContainer},
    data() {
        return {
            p5: null,
            previousValue: 1,
            offset: {
                x: 1,
                y: 200
            },
        }
    },
    mounted() {
        // Initiate new P5 instance and create canvas
        this.p5 = new P5((p5) => {
            this.$c.setup(p5);
            p5.draw = () => {
                p5.background(255);

                // Draw axis and move center to defined offset coordinates
                this.$c.drawAxis(p5, this.offset.x, this.offset.y);
                p5.translate(this.offset.x, this.offset.y);

                p5.noFill();
                p5.stroke(this.$c.colors[this.color_id]);
                p5.strokeWeight(3);

                // Draw the shape
                p5.beginShape();
                this.data.forEach((y, x) => p5.vertex(x, -Math.abs(y / this.data.length * 800)));
                p5.endShape();
            }
            p5.removeCanvas = () => p5.remove();
        }, this.canvas_id);
    },
    unmounted() {
        // Remove canvas, otherwise P5 object stays in memory
        this.p5.removeCanvas();
    },
    props: {
        data: {
            type: Array,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        canvas_id: {
            type: String,
            required: true
        },
        color_id: {
            type: Number,
            required: false,
            default: 0
        }
    }
}
</script>
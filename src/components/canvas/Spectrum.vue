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
            max: 0,
            offset: {
                x: 0,
                y: 250
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
                this.$c.spectrumAxis(p5, this.max);
                p5.translate(this.offset.x + 41, this.offset.y - 7);

                p5.noFill();
                p5.stroke(this.$c.colors[0]);
                p5.strokeWeight(3);

                // Draw the shape
                p5.beginShape();
                this.dataInView.forEach((y, x) => p5.vertex(x, y * (this.offset.y - 10)));
                p5.endShape();
            }
            p5.removeCanvas = () => p5.remove();
        }, this.canvas_id);
    },
    unmounted() {
        // Remove canvas, otherwise P5 object stays in memory
        this.p5.removeCanvas();
    },
    methods: {
        maxValue(array) {
            const max = Math.max(...array);
            this.max = Math.ceil(max);
            return max;
        }
    },
    computed: {
        normalizedData() {
            const positiveValues = this.data.map(el => Math.abs(el));
            const max = this.maxValue(positiveValues);
            return positiveValues.map(el => -el / max);
        },
        dataInView() {
            if(this.type === 'sin') {
                return this.normalizedData.filter((el, index) => index >= 1400 && index < 2047);
            }
            if(this.type === 'cos') {
                return this.normalizedData.filter((el, index) => index >= 0 && index < 700);
            }
            return this.normalizedData;
        }
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
        type: {
            type: String,
            required: true
        },
    }
}
</script>
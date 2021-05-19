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
    name: "SingleSignalCanvas",
    components: {CanvasContainer},
    data() {
        return {
            p5: null,
            previousValue: 1,
        }
    },
    mounted() {
        // Initiate new P5 instance and create canvas
        this.p5 = new P5((p5) => {
            this.$c.setup(p5);
            p5.draw = () => {
                p5.background(255);
                // Draw axis and move center to defined offset coordinates
                this.$c.drawAxis(p5, [this.offset.x, this.offset.y], null, [1, -1]);
                if(this.offset.x !== 0) {
                    p5.translate(350 - this.offset.x, this.offset.y);
                }
                else {
                    p5.translate(this.offset.x, this.offset.y);
                }

                p5.noFill();
                p5.stroke(this.$c.colors[this.color_id]);
                p5.strokeWeight(3);

                // Draw the shape
                p5.beginShape();
                this.data.forEach((y, x) => {
                    if (this.is_binary) {
                        // When value changes, start drawing on previous index to prevent skewed lines
                        p5.vertex((this.previousValue !== y) ? x - 1 : x, y * this.offset.y)
                        this.previousValue = y;
                    } else {
                        p5.vertex(x, y * this.offset.y);
                    }
                });
                p5.endShape();
            }
            p5.removeCanvas = () => p5.remove();
        }, this.canvas_id);
    },
    unmounted() {
        // Remove canvas, otherwise P5 object stays in memory
        this.p5.removeCanvas();
    },
    computed: {
        normalizedData() {
            const max = Math.max(...this.data.map(el => Math.abs(el)));
            return this.data.map(el => el / max);

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
        is_binary: {
            type: Boolean,
            required: false,
            default: false
        },
        color_id: {
            type: Number,
            required: false,
            default: 0
        },
        offset: {
            type: Object,
            required: false,
            default () {
                return {
                    x: 0,
                    y: 120
                }
            },
        },
    }
}
</script>
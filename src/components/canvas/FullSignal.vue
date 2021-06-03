<template>
    <h2 class="font-semibold text-xl">{{ title }}</h2>
    <canvas-container>
        <div :id="canvas_id"></div>
    </canvas-container>
</template>

<script>
import P5 from 'p5';
import CanvasContainer from "@/components/global/CanvasContainer";
import '@/types.js';

export default {
    name: "FullSignal",
    components: {CanvasContainer},
    data() {
        return {
            p5: null,
            previousValue: 1,
            /** @type {Coordinates} */
            offset: {
                x: 0,
                y: 125,
            }
        }
    },
    mounted() {
        // Initiate new P5 instance and create canvas
        this.p5 = new P5((p5) => {
            this.$c.setup(p5);
            p5.draw = () => {
                p5.stroke(0);

                p5.background(255);
                const [canvasDimensions, canvasPadding] = [this.$c.dimensions, this.$c.canvasPadding];

                p5.strokeWeight(2);
                //adds scale.first for is for y-axis and the second one for x-axis
                p5.line(canvasDimensions.x / 2, canvasPadding, canvasDimensions.x / 2, canvasDimensions.y - canvasPadding);
                p5.strokeWeight(1);
                const yAxisLabels = [...this.vertical_pool];
                const xAxisLabels = [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6];
                //this.$c.linearSpace(this.max, -this.max, 4);
                yAxisLabels.splice(2, 0, 0);
                for (let i = 0; i <= 20; i++) {
                    if (i % 5 === 0 && i !== 10) {
                        p5.text(`${yAxisLabels[Math.trunc(i / 5)]}`.substring(0, 4), canvasDimensions.x / 2 - 40, canvasPadding + i * 10 + 3);
                        p5.strokeWeight(2);
                        p5.line(canvasDimensions.x / 2 - 5, canvasPadding + i * 10, canvasDimensions.x / 2 + 5, canvasPadding + i * 10);
                        p5.strokeWeight(1);
                        //console.log(`${yAxisLabels[Math.trunc(i / 5)]}`.substring(0, 4));
                    } else {
                        p5.line(canvasDimensions.x / 2 - 5, canvasPadding + i * 10, canvasDimensions.x / 2 + 5, canvasPadding + i * 10);
                    }
                }
                for (let i = 0; i <= 60; i++) {
                    if (i % 5 === 0 && i !== 30) {
                        p5.text(`${xAxisLabels[Math.trunc(i / 5)]}`.substring(0, 4), i * 10 + canvasPadding, canvasPadding + 125);
                        p5.strokeWeight(2);
                        p5.line(canvasPadding + i * 10, canvasDimensions.y / 2 + 5, canvasPadding + i * 10, canvasDimensions.y / 2 - 5);
                        p5.strokeWeight(1);
                    } else {
                        p5.line(canvasPadding + i * 10, canvasDimensions.y / 2 + 5, canvasPadding + i * 10, canvasDimensions.y / 2 - 5);
                    }
                }
                //adds arrow on x-axis
                p5.strokeWeight(2);
                this.drawArrow(p5, p5.createVector(canvasPadding, canvasDimensions.y / 2), p5.createVector(canvasDimensions.x - canvasPadding, canvasDimensions.y / 2), 'black', 7, 0);
                //adds arrow on y-axis
                p5.fill(1);
                p5.triangle(350, 43, 346, 50, 354, 50);
                //adds texts on axis
                p5.textSize(12);
                p5.strokeWeight(1);
                p5.textFont('Montserrat');
                p5.text('x(t)', canvasDimensions.x / 2 - 5, 30);
                p5.text('t', canvasDimensions.x - 25, canvasDimensions.y / 2 + 15);

                p5.translate(0, 150);

                p5.noFill();
                p5.stroke(this.$c.colors[1]);
                p5.strokeWeight(3);

                // Draw the shape
                p5.beginShape();
                this.normalizedData.forEach((y, x) => {
                    if (this.is_binary) {
                        // When value changes, start drawing on previous index to prevent skewed lines
                        p5.vertex((this.previousValue !== y) ? x+canvasPadding - 1 : x+canvasPadding, y * (this.offset.y - (canvasPadding - 25)));
                        this.previousValue = y;
                    } else {
                        p5.vertex(x+canvasPadding, y * (this.offset.y - (canvasPadding - 25)));
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
        },
    },

    methods: {
        drawArrow(p5, vectorStart, vectorEnd, color, size = 7, rotate = 0) {
            const arrowSize = size;
            p5.push();
            p5.stroke(color);
            p5.fill(color);
            p5.line(vectorStart.x, vectorStart.y, vectorEnd.x, vectorEnd.y);
            p5.rotate(rotate);
            p5.translate(vectorEnd.x, vectorEnd.y);
            p5.triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
            p5.pop();
        },
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
        vertical_pool: {
            type: Array,
            required: false,
            default: null
        }
    }
}
</script>
<template>
    <h2 class="font-semibold text-xl">{{ title }}</h2>
    <canvas-container>
        <div :id="canvas_id" class = "border border-solid border-blue-300"></div>
    </canvas-container>
</template>

<script>
import P5 from 'p5';
import CanvasContainer from "@/components/global/CanvasContainer";

export default {
    name: "PositiveOnlySignal",
    components: {CanvasContainer},
    data() {
        return {
            p5: null,
            previousValue: 1,
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
                //this.max = this.$c.max(this.data.map(el => Math.abs(el)));
                p5.background(255);
                const canvasDimensions = this.$c.dimensions;
                const canvasPadding = 50;
                p5.strokeWeight(2);

                p5.line(canvasPadding, canvasPadding, canvasPadding, canvasDimensions.y - canvasPadding);
                p5.strokeWeight(1);
                const yAxisLabels = [...this.vertical_pool]; // ?? this.$c.linearSpace(this.max, -this.max, 4);
                yAxisLabels.splice(2, 0, 0);
                for(let i = 0; i <= 20; i++) {
                    if(i % 5 === 0) {
                        p5.text(`${yAxisLabels[Math.trunc(i / 5)]}`.substring(0, 4), canvasPadding - 40, canvasPadding + i * 10 + 3);
                        p5.strokeWeight(2);
                        p5.line(canvasPadding - 5, canvasPadding + i * 10, canvasPadding + 5, canvasPadding + i * 10);
                        p5.strokeWeight(1);
                    }
                    else {
                        p5.line(canvasPadding - 5, canvasPadding + i * 10, canvasPadding + 5, canvasPadding + i * 10);
                    }
                }
                p5.strokeWeight(2);
                this.drawArrow(p5, p5.createVector(canvasPadding, canvasDimensions.y / 2), p5.createVector(canvasDimensions.x - canvasPadding, canvasDimensions.y / 2), 'black', 7, 0);

                p5.noFill();
                p5.stroke(this.$c.colors[this.color_id]);
                p5.strokeWeight(2);

                // Draw the shape
                p5.beginShape();
                this.normalizedData.forEach((y, x) => {
                    if (this.is_binary) {
                        // When value changes, start drawing on previous index to prevent skewed lines
                        p5.vertex((this.previousValue !== y) ? x - 1 + canvasPadding : x + canvasPadding,  y * (this.offset.y - canvasPadding / 2) + this.offset.y + canvasPadding / 2)
                        this.previousValue = y;
                    } else {
                        p5.vertex(x + canvasPadding, y * (this.offset.y - canvasPadding / 2) + this.offset.y + canvasPadding / 2);
                    }
                });
                p5.endShape();
                // // Draw axis and move center to defined offset coordinates
                // this.$c.drawAxisOnSide(p5, this.vertical_pool);
                // p5.stroke(0);
                // p5.textSize(18);
                // p5.fill(0);
                // p5.textFont('Montserrat');
                // p5.text('t', 650, this.offset.y + 20)
                // p5.text(this.isModulatedText, 10, 15)
                // p5.translate(this.offset.x, this.offset.y);
                //
                //
                // p5.noFill();
                // p5.stroke(this.$c.colors[this.color_id]);
                // p5.strokeWeight(3);
                //
                // // Draw the shape
                // p5.beginShape();
                // this.normalizedData.forEach((y, x) => {
                //     if (this.is_binary) {
                //         // When value changes, start drawing on previous index to prevent skewed lines
                //         p5.vertex((this.previousValue !== y) ? x - 1 : x,  y * (this.offset.y - 3))
                //         this.previousValue = y;
                //     } else {
                //         p5.vertex(x, y * (this.offset.y - 3));
                //     }
                // });
                // p5.endShape();
            }
            p5.removeCanvas = () => p5.remove();
        }, this.canvas_id);
    },
    unmounted() {
        // Remove canvas, otherwise P5 object stays in memory
        this.p5.removeCanvas();
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
    computed: {
        normalizedData() {
            return this.data.map(el => el / this.max);
        },
        isModulatedText() {
            return (this.is_modulated) ? 'y(t)' : 'x(t)';
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
        is_modulated: {
            type: Boolean,
            required: false,
            default: false
        },
        vertical_pool: {
            type: Array,
            required: false,
            default: null
        }
    }
}
</script>
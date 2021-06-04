<template>
    <h2 class="font-semibold text-xl">Prikaz seštetega signala</h2>
    <canvas-container>
        <div :id="canvasId"></div>
    </canvas-container>
</template>

<script>
import CanvasContainer from "@/components/global/CanvasContainer";
import P5 from 'p5';
import '@/types.js';
export default {
    name: "SummedHarmonics",
    components: {CanvasContainer},
    data() {
        return {
            p5: null,
            canvasId: 'canvas-harmonics-summed',
            context: null,
            /** @type {Coordinates} */
            offset: {
                x: 175,
                y: 125
            },
            lineOffsets: {
                '1': 10,
                '2': 28,
                '3': 28,
                '4': 27,
                '5': 29,
            },
            /** @type {Text[]} */
            texts: [
                {
                    text: '1',
                    x: 40,
                    y: -70,
                },
                {
                    text: '-1',
                    x: 100,
                    y: 15,
                },
                {
                    text: 'x(t)',
                    x: 40,
                    y: 20,
                },
            ]
        }
    },
    mounted() {
        let time = 0;
        const waveValues = [];
        // Initiate new P5 instance and create canvas
        this.p5 = new P5((p5) => {
            this.$c.setup(p5);
            p5.draw = () => {
                this.context = document.querySelector(`#${this.canvasId} canvas`).getContext('2d');
                p5.stroke(0);
                //this.max = this.$c.max(this.data.map(el => Math.abs(el)));
                p5.background(255);
                const [canvasDimensions, canvasPadding] = [this.$c.dimensions, this.$c.canvasPadding];
                p5.strokeWeight(2);
                p5.line(canvasPadding, canvasPadding-30, canvasPadding, canvasDimensions.y - canvasPadding+20);
                p5.strokeWeight(1);
                //adds arrow on x-axis
                p5.strokeWeight(2);
                this.drawArrow(p5, p5.createVector(canvasPadding, canvasDimensions.y/2), p5.createVector(canvasDimensions.x-30, canvasDimensions.y / 2), 'black', 7, 0);
                //adds arrow on y-axis
                p5.fill(1);
                p5.triangle(175, 20, 171, 27, 179, 27);
                //adds texts on axis
                p5.textSize(12);
                p5.strokeWeight(1);
                p5.text('t', canvasDimensions.x - 15, canvasDimensions.y / 2 + 3);
                this.texts.forEach(el => p5.text(el.text, el.x, el.y));
                // Dashed lines to show values
                this.$c.drawDashed(this.context, () => {
                    const offset = this.lineOffsets[`${this.components}`];
                    p5.line(canvasPadding, canvasPadding + offset, canvasDimensions.x, canvasPadding + offset);
                    p5.line(canvasPadding, canvasDimensions.y - canvasPadding - offset, canvasDimensions.x, canvasDimensions.y - canvasPadding - offset);
                });
                p5.translate(0, this.offset.y+canvasPadding/2);
                p5.noFill();
                p5.strokeWeight(3);
                let y = 0;
                /**
                 * For each signal component we'll calculate radius and frequency, determine color
                 * and position, then draw elipse around that point. Position is determined by (x, y) of previous component
                 */
                for (let i = 0; i < this.components; i++) {
                    // We'll use n to make sure radius is not 0
                    const n = i * 2 + 1;
                    const frequency = n * time * Math.PI;
                    const radius = 90 / (Math.sqrt(n)) / (Math.sqrt(2 * i + 1));
                    y += radius * Math.sin(frequency);
                }
                // Add y to the start of waveValues array
                waveValues.unshift(y);
                p5.stroke(this.$c.colors[this.components - 1]);
                // Draw sine wave
                p5.beginShape();
                waveValues.forEach((y, x) => p5.vertex(x + canvasPadding, y));
                p5.endShape();

                if (waveValues.length > 600) {
                    waveValues.pop();
                }
                time += 0.01;
            }
            p5.removeCanvas = () => p5.remove();
        }, `${this.canvasId}`);
    },
    unmounted() {
        // Remove canvas, otherwise P5 object stays in memory
        this.p5.removeCanvas();
    },
    methods: {
        drawArrow(p5, vectorStart, vectorEnd, color, size = 7, rotate = 0) {
            this.$c.temporaryState(p5, () => {
                const arrowSize = size;
                p5.stroke(color);
                p5.fill(color);
                p5.line(vectorStart.x, vectorStart.y, vectorEnd.x, vectorEnd.y);
                p5.rotate(rotate);
                p5.translate(vectorEnd.x, vectorEnd.y);
                p5.triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
            })
        },
    },
    props: {
        components: {
            type: Number,
            required: true
        }
    }
}
</script>
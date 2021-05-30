<template>
    <h2 class="font-semibold text-xl">Prikaz posameznik komponent</h2>
    <canvas-container>
        <div :id="canvasId"></div>
    </canvas-container>
</template>

<script>
import CanvasContainer from "@/components/global/CanvasContainer";
import P5 from 'p5';
import '../types';

export default {
    name: "IndividualHarmonics",
    components: {CanvasContainer},
    data() {
        return {
            p5: null,
            canvasId: 'canvas-harmonics-individual',
            context: null,
            time: 0,
            waveValues: {},
            /** @type {Coordinates} */
            offset: {
                x: 175,
                y: 125
            },
            /** @type {Text[]} */
            texts: [
                {
                    text: '1',
                    x: 12,
                    y: -105,
                },
                {
                    text: '1',
                    x: 110,
                    y: 15,
                },
                {
                    text: 'y = sin(t)',
                    x: -23,
                    y: -140,
                },
            ]
        }
    },
    mounted() {
        // Create empty arrays in waveValues object to store sine values for each component

        [...Array(5).keys()].forEach((el, index) => this.waveValues[index] = []);

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
                p5.line(canvasDimensions.x / 2-this.offset.x, canvasPadding-30, canvasDimensions.x / 2-this.offset.x, canvasDimensions.y - canvasPadding+20);
                p5.strokeWeight(1);
                //adds arrow on x-axis
                p5.strokeWeight(2);
                this.drawArrow(p5, p5.createVector(0, canvasDimensions.y/2), p5.createVector(canvasDimensions.x-30, canvasDimensions.y / 2), 'black', 7, 0);
                //adds arrow on y-axis
                p5.fill(1);
                p5.triangle(175, 20, 171, 27, 179, 27);
                //adds texts on axis
                p5.strokeWeight(1);
                p5.textSize(12);
                p5.textFont('Montserrat');
                p5.text('t', canvasDimensions.x - 15, canvasDimensions.y / 2 + 3);

                this.context = document.querySelector(`#${this.canvasId} canvas`).getContext('2d');

                // Dashed lines to show values
                this.$c.drawDashed(this.context, () => {
                    p5.line(0, 25+canvasPadding/2, 700, 25+canvasPadding/2);
                    p5.line(0, 225+canvasPadding/2, 700, 225+canvasPadding/2);
                });

                p5.translate(this.offset.x, this.offset.y+canvasPadding/2);

                this.texts.forEach(el => p5.text(el.text, el.x, el.y));

                p5.noFill();
                p5.strokeWeight(3);

                /**
                 * For each signal component we'll calculate radius and frequency, determine color
                 * and position, then draw elipse around that point. Position is always set at (0, 0)
                 */
                for (let i = 0; i < this.components; i++) {
                    const n = i * 2 + 1;
                    const frequency = n * Math.PI * this.time;
                    const color = this.$c.colors[i];
                    const radius = 100 / Math.sqrt(n);
                    const x = radius * Math.cos(frequency);
                    const y = radius * Math.sin(frequency);

                    p5.stroke(color);
                    p5.ellipse(0, 0, radius * 2);

                    // Draw a line from center to (x, y)
                    //p5.line(0, 0, x, y);

                    // Add y to the start of waveValues[i] array
                    this.waveValues[i].unshift(y);

                    // Draw sine wave
                    p5.beginShape();
                    this.waveValues[i].forEach((y, x) => {
                        p5.vertex(x + 150, y);
                    });
                    p5.endShape();
                    this.$c.drawDashed(this.context, () => {
                        // Draw a line from x, y to start of sine wave which is at position (200, first element of array)
                        p5.line(x, y, 150, this.waveValues[i][0]);
                    });

                    this.$c.drawArrow(p5, p5.createVector(0, 0), p5.createVector(x * 0.99, y * 0.99), color, 7);

                    if (this.waveValues[i].length > 300) {
                        this.waveValues[i].pop();
                    }
                }
                this.time += 0.01;
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
        components: {
            type: Number,
            required: true
        }
    }
}
</script>
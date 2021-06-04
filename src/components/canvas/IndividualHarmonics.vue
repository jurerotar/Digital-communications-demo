<template>
    <h2 class="font-semibold text-xl">Prikaz posameznik komponent</h2>
    <canvas-container>
        <div :id="canvasId"></div>
    </canvas-container>
</template>

<script>
import CanvasContainer from "@/components/global/CanvasContainer";
import P5 from 'p5';
import '@/types.js';

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
                y: 150
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
                const [canvasDimensions, canvasPadding] = [this.$c.dimensions, this.$c.canvasPadding];
                p5.background(255);
                //p5.translate(canvasPadding + this.offset.x, this.offset.y);
                p5.strokeWeight(2);

                p5.line(canvasDimensions.x / 2, canvasPadding, canvasDimensions.x / 2, canvasDimensions.y - canvasPadding);
                p5.strokeWeight(1);

                const yAxisLabels = [0.5, 0.25, 0, -0.25, -0.5];
                const xAxisLabels = [-1.5, -1.25, -1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1, 1.25, 1.5];
                for (let i = 0; i <= 20; i++) {
                    if (i % 5 === 0 && i !== 10) {
                        p5.text(`${yAxisLabels[Math.trunc(i / 5)]}`.substring(0, 5), canvasDimensions.x / 2 - 40, canvasPadding + i * 10 + 3);
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
                this.drawArrow(p5, p5.createVector(canvasPadding, canvasDimensions.y / 2), p5.createVector(canvasDimensions.x - canvasPadding, 0), 'black', 7, 0);
                //adds arrow on y-axis
                p5.fill(1);
                p5.triangle(350, 43, 346, 50, 354, 50);
                //adds texts on axis
                p5.textSize(12);
                p5.strokeWeight(1);
                p5.textFont('Montserrat');
                p5.text('Im', canvasDimensions.x / 2 - 5, 30);
                p5.text('Re', canvasDimensions.x - 25, canvasDimensions.y / 2 + 15);

                p5.translate(0, 150);

                //x-Axis
                //p5.line(canvasDimensions.x / 2, 0, canvasDimensions.x / 2, 0);
                //y-axis
                // p5.line(0,-canvasDimensions.y/2, 0, canvasDimensions.y / 2)

                //p5.triangle(30, 75, 58, 20, 86, 75);

                p5.stroke(255);
                p5.noFill();
                //ellipse(0, 0, 200);
                let previousX = 0;

                p5.translate(canvasDimensions.x / 2, 0)

                for (let i = 0; i < this.components; i++) {
                    const n = i * 2 + 1;
                    const frequency = (i + 1) *  this.time;
                    const radius = 100 / Math.sqrt(n**2);
                    //izračun kordinat x in y (točke na krožnici)
                    const x = radius * (i % 2 === 0 ? -1 :1) * Math.sin(frequency + (i === 0 ? 1 : 0));
                    const y = radius * Math.cos(frequency + (i === 0 ? 1 : 0));

                    // Zeleni imajo začetno koordinato y na 0 vedno
                    p5.stroke('#29A829');
                    // Sum previous offsets
                    this.drawArrow(p5, p5.createVector(2 * previousX, 0), p5.createVector(x, y));
                    // Modri imajo končno koordinato y na 0 vedno
                    p5.stroke('#1974D2');
                    this.drawArrow(p5, p5.createVector(2 * previousX + x, y), p5.createVector(x, -y));

                    previousX = x + previousX;
                }
                p5.fill('red');
                p5.strokeWeight(0);
                p5.ellipse(2 * previousX, 0, 8);
                this.time += 0.008;
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
        drawArrow(p5, base, vec) {
            this.$c.temporaryState(p5, () => {
                p5.translate(base.x, base.y);
                p5.line(0, 0, vec.x, vec.y);
                p5.rotate(vec.heading());
                let arrowSize = 7;
                p5.translate(vec.mag() - arrowSize, 0);
                p5.triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
            });
        }
    },
    props: {
        components: {
            type: Number,
            required: true
        }
    }
}
</script>
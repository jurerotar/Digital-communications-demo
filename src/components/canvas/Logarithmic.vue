<template>
    <h2 class="font-semibold text-xl transition-colors duration-300 dark:text-white">{{ title }}</h2>
    <p class = "my-1 transition-colors duration-300 dark:text-white" v-if = "description !== ''">
        <span class = "font-semibold">Opis: </span>{{ description }}
    </p>
    <p class = "my-1 transition-colors duration-300 dark:text-white" v-if = "note !== ''">
        <span class = "font-semibold">Opomba: </span>{{ note }}
    </p>
    <canvas-container>
        <div :id="canvas_id"></div>
    </canvas-container>
</template>

<script>
import P5 from 'p5';
import CanvasContainer from "@/components/global/CanvasContainer";
import '@/types.js';

export default {
    name: "Logarithmic",
    components: {CanvasContainer},
    data() {
        return {
            p5: null,
            /** @type {Coordinates} */
            offset: {
                x: 0,
                y: 250
            },
            /** @type {Array<LogarithmicModifiers>} */
            modifiers: [
                {
                    type: "cos",
                    offset: 180,
                    amplitude: 1,
                },
                {
                    type: "square",
                    offset: 50,
                    amplitude: 1
                },
                {
                    type: "sinc",
                    offset: 50,
                    amplitude: 1
                },
                {
                    type: "gauss",
                    offset: 50,
                    amplitude: 2
                }
            ]
        }
    },
    mounted() {
        // Initiate new P5 instance and create canvas
        this.p5 = new P5((p5) => {
            this.$c.setup(p5);
            p5.draw = () => {
                const [canvasDimensions, canvasPadding] = [this.$c.dimensions, this.$c.canvasPadding];
                p5.background(this.$c.background());

                this.$c.temporaryState(p5, () => {
                    const color = this.$c.scale();
                    p5.stroke(color);
                    p5.strokeWeight(1);
                    // Top-bottom line
                    this.$c.widerLine(p5, canvasPadding, canvasPadding, canvasPadding, canvasDimensions.y - canvasPadding);

                    const yAxisLabels = [0, -20, -40, -60, -80];
                    for (let i = 0; i <= 20; i++) {
                        // Make each fifth line labeled and wider
                        if (i % 5 === 0) {
                            p5.text(Math.trunc(yAxisLabels[Math.trunc(i / 5)]), canvasPadding - 40, canvasPadding + i * 10 + 3);
                            this.$c.widerLine(p5, canvasPadding - 5, canvasPadding + i * 10, canvasPadding + 5, canvasPadding + i * 10);
                            continue;
                        }
                        p5.line(canvasPadding - 5, canvasPadding + i * 10, canvasPadding + 5, canvasPadding + i * 10);
                    }
                    for (let i = 0; i <= 60; i++) {
                        // Make each fifth line labeled and wider
                        if (i % 5 === 0) {
                            p5.text(`${i / 10}`.substring(0, 3), canvasPadding + i * 10 - 3, 30);
                            this.$c.widerLine(p5, canvasPadding + i * 10, canvasPadding + 5, canvasPadding + i * 10, canvasPadding - 5);
                            continue;
                        }
                        p5.line(canvasPadding + i * 10, canvasPadding + 5, canvasPadding + i * 10, canvasPadding - 5);
                    }
                    // Y axis label
                    p5.text('|X(f)/X(0)| [dB]', canvasPadding - 15, canvasPadding / 2 - 15);
                    // X axis label
                    p5.text('f', canvasDimensions.x - 30, canvasPadding);

                    p5.strokeWeight(2);
                    this.$c.drawArrow(p5, p5.createVector(canvasPadding, canvasPadding), p5.createVector(canvasDimensions.x - canvasPadding, canvasPadding), color, 7, 0);
                    //y-axis arrow
                    p5.fill(color);
                    p5.triangle(50, 260, 46, 250, 54, 250);
                })

                p5.noFill();
                p5.stroke(this.$c.colors[0]);
                p5.strokeWeight(2);
                // Draw the shape
                p5.beginShape();
                this.dataInView.forEach((y, x) => p5.vertex(x + canvasPadding, y));
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
        dataInView() {
            // Charts are not correct, so we modify them a bit
            const modifiers = this.modifiers.find(el => el.type === this.type);
            // Multiply each value with defined amplitude and offset
            let data = [...this.normalizedData].map(el => el * modifiers.amplitude + modifiers.offset);
            // Sinusoid functions change position based on frequency, so we apply additional offset
            if(this.isSinusoid) {
                data = data.map(el => el - 130);
            }
            // Remove values that are to low so they dont overflow the charts
            if(this.type === 'gauss') {
                data = data.filter(el => el <= 260 + 5 * this.period);
            }
            return data;
        },
        normalizedData() {
            let data = [...this.data];
            // Sinusoids are created with a higher frequency, so we can actually display the spectrum.
            // That means, the peak is right of where it should be. We remove the values from the left until peak matches
            if(this.isSinusoid) {
                const max = Math.max(...data);
                const maxIndex = data.findIndex(el => el === max);
                const correctPeak = Math.trunc(50 / this.period);
                data = data.filter((el, index) => index >= maxIndex - correctPeak);
            }
            data.length = 600;
            // Apply logarithm
            return data.map(el => -20 * Math.log(el / data[0]));
        },
        isSinusoid() {
            return ['sin', 'cos'].includes(this.type);
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
        type: {
            type: String,
            required: true
        },
        period: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: false,
            default: ''
        },
        note: {
            type: String,
            required: false,
            default: ''
        },
    }
}
</script>
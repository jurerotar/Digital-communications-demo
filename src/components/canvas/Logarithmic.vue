<template>
    <h2 class="font-semibold text-xl">{{ title }}</h2>
    <p class = "my-1" v-if = "description !== ''">
        <span class = "font-semibold">Opis: </span>{{ description }}
    </p>
    <p class = "my-1" v-if = "note !== ''">
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
                    type: "sin",
                    offset: 230,
                    amplitude: 1,
                    frequencyOffsets: {
                        '0.25': -60,
                        '0.5': -55,
                        '1': -55,
                        '2': -90,
                        '4': -100,
                    }
                },
                {
                    type: "cos",
                    offset: 180,
                    amplitude: 1,
                    frequencyOffsets: {
                        '0.25': -10,
                        '0.5': -10,
                        '1': -10,
                        '2': -50,
                        '4': -60,
                    }
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
                p5.stroke(0);
                p5.background(255);

                const [canvasDimensions, canvasPadding] = [this.$c.dimensions, this.$c.canvasPadding];
                p5.strokeWeight(2);

                // Top-bottom line
                p5.line(canvasPadding, canvasPadding, canvasPadding, canvasDimensions.y - canvasPadding);

                p5.strokeWeight(1);

                //y-axis arrow
                p5.fill(1);
                p5.triangle(50, 260, 46, 250, 54, 250);

                const yAxisLabels = [0, -20, -40, -60, -80];

                for (let i = 0; i <= 20; i++) {
                    // Make each fifth line labeled and wider
                    if (i % 5 === 0) {
                        p5.text(Math.trunc(yAxisLabels[Math.trunc(i / 5)]), canvasPadding - 40, canvasPadding + i * 10 + 3);
                        p5.strokeWeight(2);
                        p5.line(canvasPadding - 5, canvasPadding + i * 10, canvasPadding + 5, canvasPadding + i * 10);
                        p5.strokeWeight(1);
                        continue;
                    }
                    p5.line(canvasPadding - 5, canvasPadding + i * 10, canvasPadding + 5, canvasPadding + i * 10);
                }
                for (let i = 0; i <= 60; i++) {
                    // Make each fifth line labeled and wider
                    if (i % 5 === 0) {
                        p5.text(Math.trunc(i / 5), canvasPadding + i * 10 - 3, 30);
                        p5.strokeWeight(2);
                        p5.line(canvasPadding + i * 10, canvasPadding + 5, canvasPadding + i * 10, canvasPadding - 5);
                        p5.strokeWeight(1);
                        continue;
                    }
                    p5.line(canvasPadding + i * 10, canvasPadding + 5, canvasPadding + i * 10, canvasPadding - 5);
                }
                // Y axis label
                p5.text('|X(f)/X(0)| [dB]', canvasPadding - 15, canvasPadding / 2 - 15);
                // X axis label
                p5.text('f', canvasDimensions.x - 30, canvasPadding);

                p5.strokeWeight(2);
                this.$c.drawArrow(p5, p5.createVector(canvasPadding, canvasPadding), p5.createVector(canvasDimensions.x - canvasPadding, canvasPadding), 'black', 7, 0);

                p5.noFill();
                p5.stroke(this.$c.colors[0]);

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
                data = data.map(el => el + modifiers.frequencyOffsets[`${this.frequency}`]);
            }
            // Remove values that are to low so they dont overflow the charts
            if(this.type === 'gauss') {
                data = data.filter(el => el <= 260 + 5 * this.frequency);
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
                const correctPeak = Math.trunc(50 / this.frequency);
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
        frequency: {
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
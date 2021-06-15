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
    name: "SpectrumCanvas",
    components: {CanvasContainer},
    data() {
        return {
            p5: null,
            /** @type {Coordinates} */
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
                p5.stroke(0);
                p5.background(255);
                const [canvasDimensions, canvasPadding] = [this.$c.dimensions, this.$c.canvasPadding];
                p5.strokeWeight(2);

                // Top-bottom line
                p5.line(canvasPadding, canvasPadding, canvasPadding, canvasDimensions.y - canvasPadding);

                p5.strokeWeight(1);

                //y-axis arrow
                p5.fill(1);
                p5.triangle(50, 40, 46, 50, 54, 50);

                const yAxisLabels = this.$f.linearSpace(1, 0, 5);

                for (let i = 0; i <= 20; i++) {
                    // Make each fifth line labeled and wider
                    if (i % 5 === 0) {
                        p5.text(yAxisLabels[Math.trunc(i / 5)], canvasPadding - 40, canvasPadding + i * 10 + 3);
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
                        p5.text(Math.trunc(i / 5), canvasPadding + i * 10 - 3, canvasDimensions.y - 30);
                        p5.strokeWeight(2);
                        p5.line(canvasPadding + i * 10, canvasDimensions.y - canvasPadding + 5, canvasPadding + i * 10, canvasDimensions.y - canvasPadding - 5);
                        p5.strokeWeight(1);
                        continue;
                    }
                    p5.line(canvasPadding + i * 10, canvasDimensions.y - canvasPadding + 5, canvasPadding + i * 10, canvasDimensions.y - canvasPadding - 5);
                }
                // Y axis label
                p5.text('|X(f)|', canvasPadding - 15, canvasPadding / 2);
                // X axis label
                p5.text('f', canvasDimensions.x - 30, canvasDimensions.y - canvasPadding);

                p5.strokeWeight(2);
                this.$c.drawArrow(p5, p5.createVector(canvasPadding, canvasDimensions.y - canvasPadding), p5.createVector(canvasDimensions.x - canvasPadding, canvasDimensions.y - canvasPadding), 'black', 7, 0);

                p5.noFill();
                p5.stroke(this.$c.colors[0]);

                // Draw the shape
                p5.beginShape();
                if (this.isSinusoid) {
                    let previousY = 0;
                    this.normalizedData.forEach((y, x) => {
                        p5.vertex((previousY !== y) ? x - 1 + canvasPadding: x + canvasPadding, canvasDimensions.y - canvasPadding + y * 200);
                        previousY = y;
                    });
                }
                else {
                    this.normalizedData.forEach((y, x) => p5.vertex(x + canvasPadding, canvasDimensions.y - canvasPadding + y * 200));
                }
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
            let data = [...this.data];
            const max = Math.max(...data);
            if(this.isSinusoid) {
                const zeros = Array(Math.trunc(50 / this.frequency)).fill(0);
                const maxIndex = data.findIndex(el => el === max);
                data = data.filter((el, index) => index >= maxIndex);
                data.unshift(...zeros);
                data = data.map((el) => (el === max) ? max : 0);
            }
            data.length = 600;
            return data.map(el => -el / max);
        },
        isSinusoid() {
            return ['sin', 'cos'].includes(this.type);
        },
        notes() {
            switch(this.type) {
                case 'sin':
                    return 'Prikazan je spekter signala omejenega na intervalu od 0 do 10^11/';
                case 'cos':
                    return 'Vrednost grafa v točkah, ki niso 1, je enak 0, ker je signal neskončno dolg. Če signal ne bi bil neskončno dolg, bi prehod bil zvezen.';
                default:
                    return '';
            }
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
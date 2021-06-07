<template>
    <h2 class="font-semibold text-xl">PAM 4</h2>
    <p class = "my-1"><span class = "font-semibold">Opis: </span>PAM 4 je 4 nivojski binarni signal z možnimi vrednostmi [3, 1, -1, -3]</p>
    <canvas-container>
        <div id="pam4-signal"></div>
    </canvas-container>
</template>

<script>
import P5 from 'p5';
import CanvasContainer from "@/components/global/CanvasContainer";
import '@/types.js';

export default {
    name: "PositiveOnlySignal",
    components: {CanvasContainer},
    data() {
        return {
            p5: null,
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

                // Top-bottom line
                p5.line(canvasPadding, canvasPadding, canvasPadding, canvasDimensions.y - 10);

                p5.strokeWeight(1);
                // y-axis labels are passed through vertical_pool array, but they are missing zero, so we need to push it in
                const yAxisLabels = [3, 2, 1, 0, -1, -2, -3];
                // Draw left-right lines on y-axis and label each fifth
                for(let i = 0; i <= 30; i++) {
                    // Make each fifth line labeled and wider
                    if(i % 5 === 0) {
                        p5.text(`${yAxisLabels[Math.trunc(i / 5)]}`.substring(0, 4), canvasPadding - 40, canvasPadding + i * 8 + 3);
                        p5.strokeWeight(2);
                        p5.line(canvasPadding - 5, canvasPadding + i * 8, canvasPadding + 5, canvasPadding + i * 8);
                        p5.strokeWeight(1);
                        continue;
                    }
                    p5.line(canvasPadding - 5, canvasPadding + i * 8, canvasPadding + 5, canvasPadding + i * 8);
                }
                // Y axis label
                p5.text('x(t)', canvasPadding - 5, canvasPadding / 2);
                // X axis label
                p5.text('t', canvasDimensions.x - 30, canvasDimensions.y / 2 + 3);
                p5.strokeWeight(2);
                this.$c.drawArrow(p5, p5.createVector(canvasPadding, canvasDimensions.y / 2 + 20), p5.createVector(canvasDimensions.x - canvasPadding, canvasDimensions.y / 2 + 20), 'black', 7, 0);

                p5.fill(1);
                p5.triangle(50, 42, 46, 50, 54, 50);

                p5.noFill();
                p5.stroke(this.$c.colors[1]);
                p5.strokeWeight(2);

                // Draw the shape
                p5.beginShape();
                let previousY = 1;
                const offsets = {
                    '3': 16,
                    '1': 19,
                    '-1': 22,
                    '-3': 25
                };
                this.normalizedData.forEach((y, x) => {
                    p5.vertex((previousY !== y) ? x - 1 + canvasPadding : x + canvasPadding, y * (this.offset.y / 3) + this.offset.y + canvasPadding / 2 + offsets[`${y}`]);
                    previousY = y;
                });
                p5.endShape();
            }
            p5.removeCanvas = () => p5.remove();
        }, 'pam4-signal');
    },
    unmounted() {
        // Remove canvas, otherwise P5 object stays in memory
        this.p5.removeCanvas();
    },
    computed: {
        normalizedData() {
            const data = [...this.data];
            data.length = 600;
            return data;
        },
    },
    props: {
        data: {
            type: Array,
            required: true
        },
    }
}
</script>
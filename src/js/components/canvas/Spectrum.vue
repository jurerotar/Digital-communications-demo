<template>
  <h2 class="font-semibold text-xl transition-colors duration-300 dark:text-white">
    {{ title }}
  </h2>
  <p
    v-if="description !== ''"
    class="my-1 transition-colors duration-300 dark:text-white"
  >
    <span class="font-semibold">Opis: </span>{{ description }}
  </p>
  <p
    v-if="note !== ''"
    class="my-1 transition-colors duration-300 dark:text-white"
  >
    <span class="font-semibold">Opomba: </span>{{ note }}
  </p>
  <canvas-container>
    <div :id="canvas_id" />
  </canvas-container>
</template>

<script>
import P5 from 'p5';
import CanvasContainer from "@/js/components/common/CanvasContainer.vue";
import '@/js/types/types.ts';
import {linearSpace} from "@/js/helpers/functions.js";

export default {
    name: "SpectrumCanvas",
    components: {CanvasContainer},
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
        pulseLength: {
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
    },
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
    computed: {
        normalizedData() {
            let data = [...this.data];
            const max = Math.max(...data);
            data.length = 600;
            return data.map(el => -el / max);
        },
    },
    mounted() {
        // Initiate new P5 instance and create canvas
        this.p5 = new P5((p5) => {
            this.$c.setup(p5, {frameRate: 1});
            p5.draw = () => {
                const [canvasDimensions, canvasPadding] = [this.$c.dimensions, this.$c.canvasPadding];
                p5.background(this.$c.background());

                // Draw scale and texts
                this.$c.temporaryState(p5, () => {
                    const color = this.$c.scale();
                    p5.stroke(color);
                    p5.strokeWeight(1);
                    this.$c.widerLine(p5, canvasPadding, canvasPadding, canvasPadding, canvasDimensions.y - canvasPadding);
                    const yAxisLabels = linearSpace(this.pulseLength, 0, 5);

                    for (let i = 0; i <= 20; i++) {
                        // Make each fifth line labeled and wider
                        if (i % 5 === 0) {
                            p5.text(`${yAxisLabels[Math.trunc(i / 5)]}`.substring(0, 4), canvasPadding - 40, canvasPadding + i * 10 + 3);
                            this.$c.widerLine(p5, canvasPadding - 5, canvasPadding + i * 10, canvasPadding + 5, canvasPadding + i * 10);
                            continue;
                        }
                        p5.line(canvasPadding - 5, canvasPadding + i * 10, canvasPadding + 5, canvasPadding + i * 10);
                    }
                    for (let i = 0; i <= 60; i++) {
                        // Make each fifth line labeled and wider
                        if (i % 5 === 0) {
                            p5.text(`${i / 10}`.substring(0, 3), canvasPadding + i * 10 - 3, canvasDimensions.y - 30);
                            this.$c.widerLine(p5, canvasPadding + i * 10, canvasDimensions.y - canvasPadding + 5, canvasPadding + i * 10, canvasDimensions.y - canvasPadding - 5);
                            continue;
                        }
                        p5.line(canvasPadding + i * 10, canvasDimensions.y - canvasPadding + 5, canvasPadding + i * 10, canvasDimensions.y - canvasPadding - 5);
                    }
                    // Y axis label
                    p5.text('|X(f)|', canvasPadding - 15, canvasPadding / 2);
                    // X axis label
                    p5.text('f', canvasDimensions.x - 30, canvasDimensions.y - canvasPadding);

                    p5.strokeWeight(2);
                    this.$c.drawArrow(p5, p5.createVector(canvasPadding, canvasDimensions.y - canvasPadding), p5.createVector(canvasDimensions.x - canvasPadding, canvasDimensions.y - canvasPadding), color, 7, 0);
                    p5.fill(color);
                    p5.triangle(50, 40, 46, 50, 54, 50);

                });

                p5.strokeWeight(2);
                p5.noFill();
                p5.stroke(this.$c.colors[0]);

                // Draw the shape
                p5.beginShape();
                this.normalizedData.forEach((y, x) => p5.vertex(x + canvasPadding, canvasDimensions.y - canvasPadding + y * 200));
                p5.endShape();
            }
            p5.removeCanvas = () => p5.remove();
        }, this.canvas_id);
    },
    unmounted() {
        // Remove canvas, otherwise P5 object stays in memory
        this.p5.removeCanvas();
    }
}
</script>

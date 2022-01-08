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

export default {
    name: "PositiveOnlySignal",
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
        is_modulated: {
            type: Boolean,
            required: false,
            default: false
        },
        vertical_pool: {
            type: Array,
            required: false,
            default: null
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
        is_binary: {
            type: Boolean,
            required: false,
            default: false
        },
    },
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
    computed: {
        normalizedData() {
            const max = Math.max(...this.data.map(el => Math.abs(el)));
            const data = [...this.data];
            data.length = 600;
            return data.map(el => el / max);
        },
        isModulatedText() {
            return (this.is_modulated) ? 'y(t)' : 'x(t)';
        },
    },
    mounted() {
        // Initiate new P5 instance and create canvas
        this.p5 = new P5((p5) => {
            this.$c.setup(p5);
            p5.draw = () => {
                p5.background(this.$c.background());
                const [canvasDimensions, canvasPadding] = [this.$c.dimensions, this.$c.canvasPadding];

                this.$c.temporaryState(p5, () => {
                    const color = this.$c.scale();
                    p5.stroke(color);
                    p5.strokeWeight(1);
                    this.$c.widerLine(p5,canvasPadding, canvasPadding, canvasPadding, canvasDimensions.y - canvasPadding);
                    // y-axis labels are passed through vertical_pool array, but they are missing zero, so we need to push it in
                    const yAxisLabels = [...this.vertical_pool];
                    yAxisLabels.splice(2, 0, 0);
                    // Draw left-right lines on y-axis and label each fifth
                    for(let i = 0; i <= 20; i++) {
                        // Make each fifth line labeled and wider
                        if(i % 5 === 0) {
                            p5.text(`${yAxisLabels[Math.trunc(i / 5)]}`.substring(0, 4), canvasPadding - 40, canvasPadding + i * 10 + 3);
                            this.$c.widerLine(p5,canvasPadding - 5, canvasPadding + i * 10, canvasPadding + 5, canvasPadding + i * 10);
                            continue;
                        }
                        p5.line(canvasPadding - 5, canvasPadding + i * 10, canvasPadding + 5, canvasPadding + i * 10);
                    }
                    // Y axis label
                    p5.text(this.isModulatedText, canvasPadding - 5, canvasPadding / 2);
                    // X axis label
                    p5.text('t', canvasDimensions.x - 30, canvasDimensions.y / 2 + 3);
                    p5.strokeWeight(2);
                    this.$c.drawArrow(p5, p5.createVector(canvasPadding, canvasDimensions.y / 2), p5.createVector(canvasDimensions.x - canvasPadding, canvasDimensions.y / 2), color, 7, 0);

                    p5.fill(color);
                    p5.triangle(50, 42, 46, 50, 54, 50);
                });

                p5.noFill();
                p5.stroke(this.$c.colors[1]);
                p5.strokeWeight(2);

                // Draw the shape
                p5.beginShape();
                if(this.is_binary) {
                    let previousY = 1;
                    this.normalizedData.forEach((y, x) => {
                        p5.vertex((previousY !== y) ? x - 1 + canvasPadding : x + canvasPadding, y * (this.offset.y - canvasPadding / 2) + this.offset.y + canvasPadding / 2);
                        previousY = y;
                    });
                }
                else {
                    this.normalizedData.forEach((y, x) => {
                        p5.vertex(x + canvasPadding, y * (this.offset.y - canvasPadding / 2) + this.offset.y + canvasPadding / 2);
                    });
                }
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
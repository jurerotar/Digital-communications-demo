<template>
    <h2 class="font-semibold text-xl">Prikaz seštetega signala</h2>
    <canvas-container>
        <div :id="canvasId"></div>
    </canvas-container>
</template>

<script>
import CanvasContainer from "@/components/global/CanvasContainer";
import P5 from 'p5';

export default {
    name: "SummedHarmonics",
    components: {CanvasContainer},
    data() {
        return {
            p5: null,
            canvasId: 'canvas-harmonics-summed',
            context: null,
            time: 0,
            waveValues: [],
            offset: {
                x: 175,
                y: 125
            },
            texts: [
                {
                    text: '1',
                    x: 130,
                    y: 15,
                },
                {
                    text: 'y = Σ sin(k * t)',
                    x: 40,
                    y: 15,
                },
                {
                    text: 't',
                    x: 680,
                    y: 140,
                },
            ]
        }
    },
    mounted() {
        // Initiate new P5 instance and create canvas
        this.p5 = new P5((p5) => {
            this.$c.setup(p5);
            p5.draw = () => {

                // Add context to allow custom canvas transformations
                this.context = document.querySelector(`#${this.canvasId} canvas`).getContext('2d');

                // Recolor canvas on each draw to remove previous lines
                p5.background(255);

                // Draw axis and move center to defined offset coordinates
                this.$c.drawAxis(p5, this.offset);
                this.texts.forEach(el => p5.text(el.text, el.x, el.y));

                // Dashed lines to show values
                this.$c.drawDashed(this.context, () => {
                    p5.line(0, 22, 700, 22);
                    p5.line(0, 228, 700, 228);
                });
                p5.translate(this.offset.x, this.offset.y);

                p5.noFill();
                p5.strokeWeight(3);

                let previousX = 0;
                let previousY = 0;
                let x = 0;
                let y = 0;

                /**
                 * For each signal component we'll calculate radius and frequency, determine color
                 * and position, then draw elipse around that point. Position is determined by (x, y) of previous component
                 */
                for (let i = 0; i < this.components; i++) {
                    // We'll use n to make sure radius is not 0
                    const n = i * 2 + 1;
                    const frequency = n * this.time * Math.PI;
                    const color = this.$c.colors[i];
                    const radius = 90 / (Math.sqrt(n)) / (Math.sqrt(2 * i + 1));

                    p5.stroke(color);
                    p5.ellipse(previousX, previousY, radius * 2);
                    x += radius * Math.cos(frequency);
                    y += radius * Math.sin(frequency);
                    p5.noFill();

                    // Draw a line from end of previous line to (x, y)
                    p5.line(previousX, previousY, x, y);

                    // Update previous x and y to current x and y
                    previousX = x;
                    previousY = y;
                    this.$c.drawArrow(p5, p5.createVector(previousX, previousY), p5.createVector(x, y), color, 6 - i);
                }
                // Add y to the start of waveValues array
                this.waveValues.unshift(y);

                // Draw sine wave
                p5.beginShape();
                this.waveValues.forEach((y, x) => {
                    p5.vertex(x + 200, y);
                });
                p5.endShape();

                this.$c.drawDashed(this.context, () => {
                    // Draw a line from x, y to start of sine wave which is at position (200, first element of array)
                    p5.line(x, y, 200, this.waveValues[0]);
                })

                if (this.waveValues.length > 300) {
                    this.waveValues.pop();
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
    props: {
        components: {
            type: Number,
            required: true
        }
    }

}
</script>
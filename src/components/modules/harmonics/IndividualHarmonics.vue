<template>
    <h2 class="font-semibold text-xl">Prikaz posameznik komponent</h2>
    <canvas-container>
        <div :id="canvasId"></div>
    </canvas-container>
</template>

<script>
import CanvasContainer from "@/components/global/CanvasContainer";
import P5 from 'p5';

export default {
    name: "IndividualHarmonics",
    components: {CanvasContainer},
    data() {
        return {
            canvasId: 'canvas-harmonics-individual',
            context: null,
            time: 0,
            waveValues: {},
            offset: {
                x: 125,
                y: 125
            },
            texts: [
                {
                    text: '1',
                    x: 130,
                    y: 15,
                },
                {
                    text: '1',
                    x: 230,
                    y: 140,
                },
                {
                    text: 'y = sin(x)',
                    x: 70,
                    y: 15,
                },
                {
                    text: 'x',
                    x: 680,
                    y: 140,
                },
            ]
        }
    },
    mounted() {
        // Create empty arrays in waveValues object to store sine values for each component

        [...Array(5).keys()].forEach((el, index) => this.waveValues[index] = []);

        // Initiate new P5 instance and create canvas
        new P5((p5) => {
            this.$c.setup(p5);
            p5.draw = () => {

                // Add context to allow custom canvas transformations
                this.context = document.querySelector(`#${this.canvasId} canvas`).getContext('2d');

                // Recolor canvas on each draw to remove previous lines
                p5.background(255);

                // Draw axis and move center to defined offset coordinates
                this.$c.drawAxis(p5, this.offset);
                this.texts.forEach(el => p5.text(el.text, el.x, el.y));

                // Dashed lines
                this.context.setLineDash([5, 15]);
                p5.line(0, 22, 700, 22);
                p5.line(0, 228, 700, 228);
                this.context.setLineDash([]);

                p5.translate(this.offset.x, this.offset.y);

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
                    p5.line(0, 0, x, y);

                    // Add y to the start of waveValues[i] array
                    this.waveValues[i].unshift(y);

                    // Draw sine wave
                    p5.beginShape();
                    this.waveValues[i].forEach((y, x) => {
                        p5.vertex(x + 200, y);
                    });
                    p5.endShape();
                    this.context.setLineDash([5, 15]);
                    // Draw a line from x, y to start of sine wave which is at position (200, first element of array)
                    p5.line(x, y, 200, this.waveValues[i][0]);

                    this.context.setLineDash([]);
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
    computed: {
        /**
         * Returns number of components to display
         * @returns {number}
         */
        components() {
            return this.$store.state.harmonics.components;
        },
    }
}
</script>
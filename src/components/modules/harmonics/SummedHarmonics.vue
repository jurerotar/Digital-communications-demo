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
            canvasId: 'canvas-harmonics-summed',
            context: null,
            time: 0,
            waveValues: [],
            offset: {
                x: 180,
                y: 150
            },
        }
    },
    mounted() {
        // Initiate new P5 instance and create canvas
        new P5((p5) => {
            this.$c.setup(p5);
            p5.draw = () => {

                // Add context to allow custom canvas transformations
                this.context = document.querySelector(`#${this.canvasId} canvas`).getContext('2d');

                // Recolor canvas on each draw to remove previous lines
                p5.background(255);

                // Draw axis and move center to defined offset coordinates
                this.$c.drawAxis(p5, this.offset.x, this.offset.y);
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
                for (let i = 1; i <= this.components; i++) {
                    const frequency = i * 2 * Math.PI * this.time;
                    const color = this.$c.colors[i - 1];
                    const radius = 60 / Math.sqrt(i);

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
                }
                // Add y to the start of waveValues array
                this.waveValues.unshift(y);

                // Draw sine wave
                p5.beginShape();
                this.waveValues.forEach((y, x) => {
                    p5.vertex(x + 200, y);
                });
                p5.endShape();
                this.context.setLineDash([5, 15]);

                // Draw a line from x, y to start of sine wave which is at position (200, first element of array)
                p5.line(x, y, 200, this.waveValues[0]);

                this.context.setLineDash([]);
                if (this.waveValues.length > 300) {
                    this.waveValues.pop();
                }
                this.time += 0.005;
            }
        }, `${this.canvasId}`);
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
<template>
    <h1 class="text-3xl font-medium mb-4">Kazalci</h1>
    <collapsible>
        To je burek
    </collapsible>
    <canvas-container>
        <div :id="canvasId"></div>
    </canvas-container>
</template>


<script>
import Collapsible from "@/components/global/Collapsible";
import P5 from 'p5';
import CanvasContainer from "@/components/global/CanvasContainer";

export default {
    name: "Pointers",
    components: {Collapsible, CanvasContainer},
    data() {
        return {
            canvasId: 'canvas-pointers',
            context: null,
            time: 0,
            waveValues: [],
            offset: {
                x: 180,
                y: 150
            },

            wave: [],
            sinHorizontal: 0,
            cosHorizontal: 0,
            cosVertical: 0,
            sinVertical: 0,


        }
    },

    methods: {
        /**
         * Returns array of linearly spaced points between startValue and stopValue
         * @param {number} startValue
         * @param {number} stopValue
         * @param {number} cardinality
         * @returns {number[]}
         */
        linearSpace(startValue, stopValue, cardinality) {
            const arr = [];
            const step = (stopValue - startValue) / (cardinality - 1);
            for (let i = 0; i < cardinality; i++) {
                arr.push(startValue + (step * i));
            }
            return arr;
        }
    },
    mounted() {

        // Returns array of sine and cosine wave points
        const sineValues = this.linearSpace(0, 2 * Math.PI, 200).map(el => Math.sin(el));
        const cosineValues = this.linearSpace(0, 2 * Math.PI, 200).map(el => Math.cos(el));

        // Initiate new P5 instance and create canvas
        new P5((p5) => {
            p5.setup = () => {
                p5.createCanvas(800, 800);
            }

            p5.draw = () => {

                // Add context to allow custom canvas transformations
                this.context = document.querySelector(`#${this.canvasId} canvas`).getContext('2d');

                const radius = 100 * (4 / Math.PI);

                p5.background(255);

                // Moves the middle of the circle
                p5.translate(150, 200);
                p5.strokeWeight(3);

                // Calculates the coordinates x and y(points on the circle)
                const x = radius * Math.cos(Math.PI * this.time);
                const y = radius * Math.sin(Math.PI * this.time);

                p5.stroke(this.$c.colors[1]);
                p5.noFill();
                // Initializes the circle at the starting point
                p5.ellipse(0, 0, radius * 2);

                p5.stroke(this.$c.colors[1]);
                // Draws a pointer
                p5.line(0, 0, x, y);

                p5.stroke(this.$c.colors[0]);
                // Draws a sine wave with elements and index form lineSpace function and moves it
                p5.translate(200, 0);
                p5.beginShape();
                sineValues.forEach((el, index) => p5.vertex(index, el * radius));
                p5.endShape();

                // Calculates vertical components
                this.sinVertical = Math.sin(Math.PI * this.time) * radius;
                // Moves horizontal component till it hits 200
                this.sinHorizontal++;
                // Defines the length of sine wave(one period is the same as cardinality in lineSpace function)
                this.sinHorizontal %= 200;
                p5.ellipse(this.sinHorizontal, this.sinVertical, 15, 15);

                // Make line dotted
                this.context.setLineDash([5, 15]);
                // Connect current x,y coordinates to sine graph
                p5.line(x - 200, y, this.sinHorizontal, this.sinVertical);
                // Make line full
                this.context.setLineDash([]);

                p5.stroke(this.$c.colors[2]);
                // Draws a cosine wave with elements and index form lineSpace function and moves it
                p5.translate(-200, 200);
                p5.beginShape();
                cosineValues.forEach((el, index) => p5.vertex(el * radius, index));
                p5.endShape();

                // Calculates vertical components
                this.cosVertical = Math.cos(Math.PI * this.time) * (radius);
                // Moves horizontal component till it hits 200
                this.cosHorizontal++;
                // Defines the length of cosine wave(one period is the same as cardinality in lineSpace function
                this.cosHorizontal %= 200;
                p5.ellipse(this.cosVertical, this.cosHorizontal, 15, 15);

                // Make line dotted
                this.context.setLineDash([5, 15]);
                // Connect current x,y coordinates to cosine graph
                p5.line(x, y-200, this.cosVertical, this.cosHorizontal);
                // Make line full
                this.context.setLineDash([]);

                this.time += 0.01;
            }
        }, `${this.canvasId}`);
    },
}
</script>
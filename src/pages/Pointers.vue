<template>
    <h1 class="text-3xl font-medium mb-4">Kazalci</h1>
    <collapsible>
        <theory-pointer></theory-pointer>
    </collapsible>
    <canvas-container>
        <div :id="canvasId"></div>
    </canvas-container>
</template>

<script>
import Collapsible from "@/components/global/Collapsible";
import P5 from 'p5';
import CanvasContainer from "@/components/global/CanvasContainer";
import TheoryPointer from "@/components/theory/TheoryPointer";
import '@/types.js';


export default {
    name: "Pointers",
    components: {TheoryPointer, Collapsible, CanvasContainer},
    data() {
        return {
            p5: null,
            canvasId: 'canvas-pointers',
            context: null,
            time: 0,
            sinHorizontal: 0,
            cosHorizontal: 0,
            cosVertical: 0,
            sinVertical: 0,
            wave: [],
            /**
             * @type {Coordinates}
             */
            offset: {
                x: 150,
                y: 150
            },
            /**
             * @type {Coordinates}
             */
            dimensions: {
                x: 800,
                y: 800
            },
            /**
             * @type {Text[]}
             */
            texts: [
                {
                    text: 'Im',
                    x: 115,
                    y: 15,
                },
                {
                    text: 'Re',
                    x: 290,
                    y: 140,
                },
                {
                    text: '1',
                    x: 160,
                    y: 15,
                },
                {
                    text: '1',
                    x: 295,
                    y: 170,
                },
                {
                    text: '-1',
                    x: 155,
                    y: 300,
                },
                {
                    text: '-1',
                    x: 5,
                    y: 170,
                },
                {
                    text: '360\xB0',
                    x: 565,
                    y: 170,
                },
                {
                    text: '0\xB0',
                    x: 335,
                    y: 170,
                },
                {
                    text: '0\xB0',
                    x: 155,
                    y: 360,
                },
                {
                    text: '360\xB0',
                    x: 155,
                    y: 550,
                },
                {
                    text: 'Φ',
                    x: 720,
                    y: 170,
                },
                {
                    text: 'Φ',
                    x: 155,
                    y: 700,
                },

            ]
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
        },
    },
    mounted() {
        // Returns array of sine and cosine wave points
        const sineValues = this.linearSpace(0, 2 * Math.PI, 200).map(el => Math.sin(el));
        const cosineValues = this.linearSpace(0, 2 * Math.PI, 200).map(el => Math.cos(el));

        // Initiate new P5 instance and create canvas
        this.p5 = new P5((p5) => {
            p5.setup = () => {
                p5.createCanvas(this.dimensions.x, this.dimensions.y);
            }

            p5.draw = () => {
                const radius = 100 * (4 / Math.PI);
                p5.background(255);
                // Add context to allow custom canvas transformations
                this.context = document.querySelector(`#${this.canvasId} canvas`)?.getContext('2d');

                p5.textSize(18);
                p5.fill(0);
                p5.textFont('Montserrat');

                p5.stroke(0);
                p5.strokeWeight(1);
                this.texts.forEach(el => p5.text(el.text, el.x, el.y));

                this.$c.drawAxis(p5, this.offset, this.dimensions);

                this.$c.drawDashed(this.context, () => {
                    p5.line(277, 0, 277, this.dimensions.y);
                    p5.line(0, 277, this.dimensions.x, 277);
                    p5.line(23, 0, 23, this.dimensions.y);
                    p5.line(0, 23, this.dimensions.x, 23);
                });

                p5.fill(0);
                p5.strokeWeight(0);
                p5.triangle(150, -3, 145, 15, 155, 15);
                p5.triangle(803,150,785,145,785,155);

                // Moves the middle of the circle
                p5.translate(150, 150);
                p5.strokeWeight(3);

                // Calculates the coordinates x and y(points on the circle)
                const x = radius * Math.cos(Math.PI * this.time);
                const y = -radius * Math.sin(Math.PI * this.time);

                p5.stroke(this.$c.colors[1]);
                p5.noFill();

                // Initializes the circle at the starting point
                p5.ellipse(0, 0, radius * 2);

                p5.stroke(this.$c.colors[1]);

                // Draws a pointer
                p5.line(0, 0, x, y);

                this.$c.drawArrow(p5, p5.createVector(0, 0), p5.createVector(x, y), this.$c.colors[1]);

                p5.stroke(this.$c.colors[0]);

                // Draws a sine wave with elements and indexes from linearSpace function and moves it
                p5.translate(200, 0);
                p5.beginShape();
                sineValues.forEach((el, index) => p5.vertex(index, -el * radius));
                p5.endShape();

                // Calculates vertical components
                this.sinVertical = -Math.sin(Math.PI * this.time) * radius;
                // Moves horizontal component till it hits 200
                this.sinHorizontal++;
                // Defines the length of sine wave(one period is the same as cardinality in lineSpace function)
                this.sinHorizontal %= 200;
                p5.ellipse(this.sinHorizontal, this.sinVertical, 15, 15);

                this.$c.drawDashed(this.context, () => {
                    // Connect current x,y coordinates to sine graph
                    p5.line(x - 200, y, this.sinHorizontal, this.sinVertical);
                });

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

                this.$c.drawDashed(this.context, () => {
                    // Connect current x,y coordinates to cosine graph
                    p5.line(x, y - 200, this.cosVertical, this.cosHorizontal);
                });

                this.time += 0.01;
            };
            p5.removeCanvas = () => p5.remove();
        }, `${this.canvasId}`);
    },
    unmounted() {
        this.p5.removeCanvas();
    }
}
</script>

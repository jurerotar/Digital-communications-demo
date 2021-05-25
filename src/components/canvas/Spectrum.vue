<template>
    <h2 class="font-semibold text-xl">{{ title }}</h2>
    <canvas-container>
        <div :id="canvas_id"></div>
    </canvas-container>
</template>

<script>
import P5 from 'p5';
import CanvasContainer from "@/components/global/CanvasContainer";
export default {
    name: "SpectrumCanvas",
    components: {CanvasContainer},
    data() {
        return {
            p5: null,
            max: 0,
            offset: {
                x: 0,
                y: 250
            },
        }
    },
    mounted() {
        this.dataWithFrequency;
        this.max = Math.max(...this.data);
        // Initiate new P5 instance and create canvas
        this.p5 = new P5((p5) => {
            this.$c.setup(p5);
            p5.draw = () => {


                p5.stroke(0);
                /**
                 * Code bellow draws the axis lines and labels them
                 */
                p5.background(255);
                const canvasDimensions = this.$c.dimensions;
                const canvasPadding = 50;
                p5.strokeWeight(2);

                // Top-bottom line
                p5.line(canvasPadding, canvasPadding, canvasPadding, canvasDimensions.y - canvasPadding);

                p5.strokeWeight(1);

                //y-axis arrow
                p5.fill(1);
                p5.triangle(50,40,46,50,54,50);

                const yAxisLabels = this.$c.linearSpace(this.max, 0, 5);

                for(let i = 0; i <= 20; i++) {
                    // Make each fifth line labeled and wider
                    if(i % 5 === 0) {
                        p5.text(Math.trunc(yAxisLabels[Math.trunc(i / 5)]), canvasPadding - 40, canvasPadding + i * 10 + 3);
                        p5.strokeWeight(2);
                        p5.line(canvasPadding - 5, canvasPadding + i * 10, canvasPadding + 5, canvasPadding + i * 10);
                        p5.strokeWeight(1);
                        continue;
                    }
                    p5.line(canvasPadding - 5, canvasPadding + i * 10, canvasPadding + 5, canvasPadding + i * 10);
                }
                for(let i = 0; i <= 60; i++) {
                    // Make each fifth line labeled and wider
                    if(i % 5 === 0) {
                        p5.text(Math.trunc(i / 5), canvasPadding + i * 10 - 3, canvasDimensions.y - 30);
                        p5.strokeWeight(2);
                        p5.line(canvasPadding + i * 10, canvasDimensions.y - canvasPadding + 5, canvasPadding + i * 10, canvasDimensions.y- canvasPadding -5);
                        p5.strokeWeight(1);
                        continue;
                    }
                    p5.line(canvasPadding + i * 10, canvasDimensions.y - canvasPadding + 5, canvasPadding + i * 10, canvasDimensions.y- canvasPadding -5);
                }
                // Y axis label
                p5.text('|X[f]|', canvasPadding - 15, canvasPadding / 2);
                // X axis label
                p5.text('f', canvasDimensions.x - 30, canvasDimensions.y - canvasPadding);

                p5.strokeWeight(2);
                this.drawArrow(p5, p5.createVector(canvasPadding, canvasDimensions.y - canvasPadding), p5.createVector(canvasDimensions.x - canvasPadding, canvasDimensions.y - canvasPadding), 'black', 7, 0);

                // // Draw axis and move center to defined offset coordinates
                // this.$c.spectrumAxis(p5, this.max);
                // p5.translate(this.offset.x + 41, this.offset.y - 7);
                //
                p5.noFill();
                p5.stroke(this.$c.colors[0]);
                p5.strokeWeight(2);

                // Draw the shape
                p5.beginShape();
                this.normalizedData.forEach((y, x) => p5.vertex(x + canvasPadding, canvasDimensions.y - canvasPadding + y*200));
                p5.endShape();
            }
            p5.removeCanvas = () => p5.remove();
        }, this.canvas_id);
    },
    updated() {
        this.max = Math.max(...this.data);
    },
    unmounted() {
        // Remove canvas, otherwise P5 object stays in memory
        this.p5.removeCanvas();
    },
    methods: {
        drawArrow(p5, vectorStart, vectorEnd, color, size = 7, rotate = vectorEnd.heading()) {
            const arrowSize = size;
            p5.push();
            p5.stroke(color);
            p5.fill(color);
            p5.line(vectorStart.x, vectorStart.y, vectorEnd.x, vectorEnd.y);
            p5.rotate(rotate);
            p5.translate(vectorEnd.x, vectorEnd.y);
            p5.triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
            p5.translate(-vectorEnd.x, -vectorEnd.y);
            p5.pop();
        },
    },
    computed: {
        dataWithFrequency() {
            const divLength = 50;
            const data = [...this.data];
            const max = Math.max(...data);
            const indexOfMax = data.findIndex(el => el === max);
            const correctMaxIndex = this.frequency * divLength;
            const safetyDistance = 20;
            const difference = correctMaxIndex - indexOfMax - safetyDistance;
            if(difference > 0) {
                data.unshift(...[...Array(difference)].fill(data[0]))
            }
            console.log(data);
            return data;
        },
        normalizedData() {
            const data = [...this.data];
            data.length = 600;
            return data.map(el => -el / this.max);
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
        }
    }
}
</script>
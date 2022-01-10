<template>
  <h2 class="font-semibold text-xl transition-colors duration-300 dark:text-white">
    Prikaz posameznik komponent
  </h2>
  <canvas-container>
    <div :id="canvasId" />
  </canvas-container>
</template>

<script>
import P5 from 'p5';
import CanvasContainer from "@/js/components/common/AppCanvasContainer.vue";
import '@/js/types/types.ts';

export default {
  name: "IndividualHarmonics",
  components: {CanvasContainer},
  props: {
    components: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      p5: null,
      canvasId: 'canvas-harmonics-individual',
      context: null,
      /** @type {Coordinates} */
      offset: {
        x: 175,
        y: 150
      },
      /** @type {Text[]} */
      texts: [
        {
          text: '-1',
          x: 12,
          y: -105,
        },
        {
          text: '1',
          x: 110,
          y: 15,
        },
        {
          text: 'y = sin(t)',
          x: -23,
          y: -140,
        },
      ]
    }
  },
  mounted() {
    let time = 0;
    // Initiate new P5 instance and create canvas
    this.p5 = new P5((p5) => {
      p5.setup = () => {
        p5.createCanvas(700, 400);
        p5.frameRate(30);
        p5.textFont('Montserrat');
      }
      p5.draw = () => {
        const color = this.$c.scale();
        const [canvasDimensions, canvasPadding] = [this.$c.dimensions, this.$c.canvasPadding];
        p5.translate(0, canvasPadding);
        p5.background(this.$c.background());
        p5.strokeWeight(2);

        this.$c.temporaryState(p5, () => {
          p5.stroke(color);
          p5.line(canvasDimensions.x / 2, -30, canvasDimensions.x / 2, canvasDimensions.y);
          p5.strokeWeight(1);
          const yAxisLabels = [0.75, 0.5, 0.25, 0, -0.25, -0.5, -0.75];
          const xAxisLabels = [-1.5, -1.25, '  -1', -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, '   1', 1.25, 1.5];
          for (let i = 0; i <= 30; i++) {
            if (i % 5 === 0 && i !== 15) {
              p5.text(`${yAxisLabels[Math.trunc(i / 5)]}`.substring(0, 5), canvasDimensions.x / 2 - 40, i * 10 + 3);
              this.$c.widerLine(p5, canvasDimensions.x / 2 - 5, i * 10, canvasDimensions.x / 2 + 5, i * 10);
            } else {
              p5.line(canvasDimensions.x / 2 - 5, i * 10, canvasDimensions.x / 2 + 5, i * 10);
            }
          }
          for (let i = 0; i <= 60; i++) {
            if (i % 5 === 0 && i !== 30) {
              p5.text(`${xAxisLabels[Math.trunc(i / 5)]}`.substring(0, 5), i * 10 + canvasPadding - 15, canvasPadding + 125);
              this.$c.widerLine(p5, canvasPadding + i * 10, canvasDimensions.y / 2 + 5, canvasPadding + i * 10, canvasDimensions.y / 2 - 5);
            } else {
              p5.line(canvasPadding + i * 10, canvasDimensions.y / 2 + 5, canvasPadding + i * 10, canvasDimensions.y / 2 - 5);
            }
          }
          p5.text('Im', canvasDimensions.x / 2 - 6, -38);
          p5.text('Re', canvasDimensions.x - 25, canvasDimensions.y / 2 + 15);
          //adds arrow on x-axis
          p5.strokeWeight(2);
          this.$c.drawArrow1(p5, p5.createVector(canvasPadding, canvasDimensions.y / 2), p5.createVector(canvasDimensions.x - canvasPadding, 0));
          //adds arrow on y-axis
          p5.fill(color);
          p5.triangle(350, -30, 346, -20, 354, -20);
        });

        p5.translate(0, 150);
        p5.noFill();
        let previousX = 0;

        p5.translate(canvasDimensions.x / 2, 0);

        for (let i = 1; i <= this.components; i++) {
          const frequency = (2 * i - 1) * time;
          const radius = 210 * (-2 / (2 * i - 1) / Math.PI * (-1) ** i);
          const x = -radius * Math.cos(frequency);
          const y = radius * Math.sin(frequency);

          // Draw green and blue pointers
          this.$c.temporaryState(p5, () => {
            p5.strokeWeight(2);
            p5.stroke('#1974D2');
            // Sum previous offsets
            this.$c.drawArrow1(p5, p5.createVector(2 * previousX, 0), p5.createVector(x, y));
            // Modri imajo končno koordinato y na 0 vedno
            p5.stroke('#29A829');
            this.$c.drawArrow1(p5, p5.createVector(2 * previousX + x, y), p5.createVector(x, -y));
          });
          previousX = x + previousX;
        }
        // Draw the red dot at the end of last pointer
        this.$c.temporaryState(p5, () => {
          p5.strokeWeight(0);
          p5.fill('red');
          p5.ellipse(2 * previousX, 0, 8);
        });
        time += 0.03;
      }
      p5.removeCanvas = () => p5.remove();
    }, `${this.canvasId}`);
  },
  unmounted() {
    // Remove canvas, otherwise P5 object stays in memory
    this.p5.removeCanvas();
  }
}
</script>
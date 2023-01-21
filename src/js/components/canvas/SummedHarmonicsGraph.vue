<template>
  <AppSectionHeading>
    Prikaz seštetega signala
  </AppSectionHeading>
  <CanvasContainer>
    <div :id="canvasId" />
  </CanvasContainer>
</template>

<script>
import AppSectionHeading from "@/js/components/common/AppSectionHeading.vue";
import P5 from 'p5';
import CanvasContainer from "@/js/components/common/AppCanvasContainer.vue";
import '@/js/types/types.ts';

export default {
  name: "SummedHarmonicsGraph",
  components: {AppSectionHeading, CanvasContainer},
  props: {
    components: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      p5: null,
      canvasId: 'canvas-harmonics-summed',
      context: null,
      /** @type {Coordinates} */
      offset: {
        x: 175,
        y: 125
      },
      /** @type {Text[]} */
      texts: [
        {
          text: '1',
          x: 32,
          y: 80,
        },
        {
          text: '-1',
          x: 30,
          y: 225,
        },
        {
          text: 'x(t)',
          x: 40,
          y: 10,
        },
      ]
    }
  },
  mounted() {
    // Initiate new P5 instance and create canvas
    let time = 0;
    const waveValues = [];
    this.p5 = new P5((p5) => {
      this.$c.setup(p5);
      p5.draw = () => {
        const color = this.$c.scale();
        this.context = document.querySelector(`#${this.canvasId} canvas`).getContext('2d');
        p5.background(this.$c.background());
        const [canvasDimensions, canvasPadding] = [this.$c.dimensions, this.$c.canvasPadding];
        this.$c.temporaryState(p5, () => {
          p5.stroke(color);
          p5.strokeWeight(2);
          p5.line(canvasPadding, canvasPadding - 30, canvasPadding, canvasDimensions.y - canvasPadding + 20);
          this.$c.drawArrow(p5, p5.createVector(canvasPadding, canvasDimensions.y / 2), p5.createVector(canvasDimensions.x - 30, canvasDimensions.y / 2), color, 7, 0);
          //adds arrow on y-axis
          p5.fill(color);
          p5.triangle(50, 20, 46, 27, 54, 27);
          //adds texts on axis
          p5.strokeWeight(1);
          p5.text('t', canvasDimensions.x - 15, canvasDimensions.y / 2 + 3);
          this.texts.forEach(el => p5.text(el.text, el.x, el.y));
          // Dashed lines to show values
          this.$c.drawDashed(this.context, () => {
            p5.line(canvasPadding, canvasPadding + 28, canvasDimensions.x, canvasPadding + 28);
            p5.line(canvasPadding, canvasDimensions.y - canvasPadding - 28, canvasDimensions.x, canvasDimensions.y - canvasPadding - 28);
          });
        });

        p5.translate(0, this.offset.y + canvasPadding / 2);

        p5.noFill();
        p5.strokeWeight(3);
        let y = 0;

        /**
         * For each signal component we'll calculate radius and frequency, determine color
         * and position, then draw elipse around that point. Position is determined by (x, y) of previous component
         */
        for (let i = 1; i <= this.components; i++) {
          const frequency = (2 * i - 1) * time;
          const radius = (140 * (-2 / (2 * i - 1) / Math.PI * (-1) ** i));
          y += radius * Math.cos(frequency);
        }


        // Add y to the start of waveValues array
        waveValues.unshift(y);
        p5.stroke(this.$c.colors[1]);
        // Draw sine wave
        p5.beginShape();
        waveValues.forEach((y, x) => {
          p5.vertex(x + canvasPadding, y);
        });
        p5.endShape();

        if (waveValues.length > 600) {
          waveValues.pop();
        }
        this.$c.temporaryState(p5, () => {
          p5.translate(50, 0);
          p5.fill('red')
          p5.strokeWeight(0);
          p5.ellipse(0, y, 8);
        })
        time += 0.03;
      }

      p5.removeCanvas = () => p5.remove();
    }, `${this.canvasId}`);
  },
  unmounted() {
    // Remove canvas, otherwise P5 object stays in memory
    this.p5.removeCanvas();
  },
  methods: {}

}
</script>
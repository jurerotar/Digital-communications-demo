<template>
  <AppSectionHeading>
    {{ title }}
  </AppSectionHeading>
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
  <CanvasContainer>
    <div :id="canvasId"/>
  </CanvasContainer>
</template>

<script>
import AppSectionHeading from "@/js/components/common/AppSectionHeading.vue";
import P5 from 'p5';
import CanvasContainer from "@/js/components/common/AppCanvasContainer.vue";
import '@/js/types/types.ts';

export default {
  name: "PositiveOnlySignal",
  components: {AppSectionHeading, CanvasContainer},
  props: {
    data: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    canvasId: {
      type: String,
      required: true
    },
    isModulated: {
      type: Boolean,
      required: false,
      default: false
    },
    verticalPool: {
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
    isBinary: {
      type: Boolean,
      required: false,
      default: false
    },
    xTicks: {
      type: Object,
      required: false,
      default: null
    },
    isInverted: {
      type: Boolean,
      required: false,
      default: false
    },
    absMax: {
      type: Number,
      required: false,
      default: null
    },
    speed: {
      type: Number,
      required: false,
      default: 1
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
      const max = this.absMax !== null ? this.absMax : Math.max(...this.data.map(el => Math.abs(el)));
      const data = [...this.data];
      data.length = 600;

      const isInvertedModifier = this.isInverted ? -1 : 1;

      return data.map(el => isInvertedModifier * el / max);
    },
    isModulatedText() {
      return (this.isModulated) ? 'y(t)' : 'x(t)';
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
          this.$c.widerLine(p5, canvasPadding, canvasPadding, canvasPadding, canvasDimensions.y - canvasPadding);
          // y-axis labels are passed through vertical_pool array, but they are missing zero, so we need to push it in
          const yAxisLabels = [...this.verticalPool];
          yAxisLabels.splice(2, 0, 0);
          // Draw left-right lines on y-axis and label each fifth
          for (let i = 0; i <= 20; i++) {
            // Make each fifth line labeled and wider
            if (i % 5 === 0) {
              p5.text(`${yAxisLabels[Math.trunc(i / 5)]}`.substring(0, 4), canvasPadding - 40, canvasPadding + i * 10 + 3);
              this.$c.widerLine(p5, canvasPadding - 5, canvasPadding + i * 10, canvasPadding + 5, canvasPadding + i * 10);
              continue;
            }
            p5.line(canvasPadding - 5, canvasPadding + i * 10, canvasPadding + 5, canvasPadding + i * 10);
          }

          // Draw x ticks if supplied
          if (this.xTicks !== null) {
            for (let i = 0; i < this.xTicks.pos.length; i++) {
              this.$c.widerLine(p5, this.speed * this.xTicks.pos[i] + canvasPadding, this.offset.y - 5 + canvasPadding / 2, this.speed * this.xTicks.pos[i] + canvasPadding, this.offset.y + 5 + canvasPadding / 2);
              p5.strokeWeight(0.5);
              p5.line(this.speed * this.xTicks.pos[i] + canvasPadding, this.offset.y - canvasPadding * 2, this.speed * this.xTicks.pos[i] + canvasPadding, this.offset.y + canvasPadding * 3);
              p5.textAlign(p5.RIGHT, p5.TOP);
              p5.strokeWeight(0.25);
              p5.text(this.xTicks.text[i], this.speed * this.xTicks.pos[i] + canvasPadding, this.offset.y + 7 + canvasPadding / 2);
            }
          }
          p5.textAlign(p5.RIGHT, p5.CENTER);
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
        if (this.isBinary) {
          let previousY = 1;
          this.normalizedData.forEach((y, x) => {
            p5.vertex((previousY !== y) ? this.speed * x - 1 + canvasPadding : this.speed * x + canvasPadding, y * (this.offset.y - canvasPadding / 2) + this.offset.y + canvasPadding / 2);
            previousY = y;
          });
        } else {
          this.normalizedData.forEach((y, x) => {
            p5.vertex(this.speed * x + canvasPadding, y * (this.offset.y - canvasPadding / 2) + this.offset.y + canvasPadding / 2);
          });
        }
        p5.endShape();
      }
      p5.removeCanvas = () => p5.remove();
    }, this.canvasId);
  },
  unmounted() {
    // Remove canvas, otherwise P5 object stays in memory
    this.p5.removeCanvas();
  }
}

</script>

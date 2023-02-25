<template>
  <AppSectionHeading>
    {{ title }}
  </AppSectionHeading>
  <slot />
  <p
    v-if="description !== ''"
    class="my-1 transition-colors duration-300 dark:text-white"
  >
    <span class="font-semibold">Opis:</span>{{ description }}
  </p>
  <p
    v-if="note !== ''"
    class="my-1 transition-colors duration-300 dark:text-white"
  >
    <span class="font-semibold">Opomba:</span>{{ note }}
  </p>
  <CanvasContainer>
    <div id="4-level-binary" />
  </CanvasContainer>
</template>

<script>
import AppSectionHeading from "@components/common/AppSectionHeading.vue";
import P5 from 'p5';
import CanvasContainer from "@components/common/AppCanvasContainer.vue";
import '@interfaces/common.ts';

export default {
  name: "Level4SignalGraph",
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
      const max = Math.max(...this.data.map(el => Math.abs(el)));
      const data = [...this.data];
      data.length = 600;
      if (this.isBinary) {
        return data;
      }
      return data.map(el => el / max);
    },
  },
  mounted() {
    // Initiate new P5 instance and create canvas
    this.p5 = new P5((p5) => {
      this.$c.setup(p5);
      p5.draw = () => {
        const color = this.$c.scale();
        p5.stroke(color);
        p5.background(this.$c.background());
        const [canvasDimensions, canvasPadding] = [this.$c.dimensions, this.$c.canvasPadding];

        p5.strokeWeight(2);

        // Top-bottom line
        p5.line(canvasPadding, canvasPadding, canvasPadding, canvasDimensions.y - 10);

        p5.strokeWeight(1);
        // y-axis labels are passed through vertical_pool array, but they are missing zero, so we need to push it in
        const yAxisLabels = [3, 2, 1, 0, -1, -2, -3];
        // Draw left-right lines on y-axis and label each fifth
        for (let i = 0; i <= 30; i++) {
          // Make each fifth line labeled and wider
          if (i % 5 === 0) {
            p5.text(`${yAxisLabels[Math.trunc(i / 5)]}`.substring(0, 4), canvasPadding - 40, canvasPadding + i * 8 + 3);
            p5.strokeWeight(2);
            p5.line(canvasPadding - 5, canvasPadding + i * 8, canvasPadding + 5, canvasPadding + i * 8);
            p5.strokeWeight(1);
            continue;
          }
          p5.line(canvasPadding - 5, canvasPadding + i * 8, canvasPadding + 5, canvasPadding + i * 8);
        }
        // Y axis label
        p5.text('x(t)', canvasPadding - 5, canvasPadding / 2);
        // X axis label
        p5.text('t', canvasDimensions.x - 30, canvasDimensions.y / 2 + 30);
        p5.strokeWeight(2);
        this.$c.drawArrow(p5, p5.createVector(canvasPadding, canvasDimensions.y / 2 + 20), p5.createVector(canvasDimensions.x - canvasPadding, canvasDimensions.y / 2 + 20), color, 7, 0);

        p5.fill(1);
        p5.triangle(50, 42, 46, 50, 54, 50);

        p5.noFill();
        p5.stroke(this.$c.colors[1]);
        p5.strokeWeight(2);

        // Draw the shape
        p5.beginShape();
        if (this.isBinary) {
          const binaryOffsets = {
            '3': 15,
            '1': 18,
            '-1': 21,
            '-3': 25,
            '0': 19
          };
          let previousY = 1;
          this.normalizedData.forEach((y, x) => {
            p5.vertex((previousY !== y) ? this.speed*x - 1 + canvasPadding : this.speed*x + canvasPadding, y * this.offset.y / 3 + this.offset.y + canvasPadding / 2 + binaryOffsets[`${y}`]);
            previousY = y;
          });
        } else {
          this.normalizedData.forEach((y, x) => {
            p5.vertex(this.speed*x + canvasPadding, y * (this.offset.y - canvasPadding / 2) + this.offset.y + canvasPadding / 2);
          });
        }
        p5.endShape();
      }
      p5.removeCanvas = () => p5.remove();
    }, '4-level-binary');
  },
  unmounted() {
    // Remove canvas, otherwise P5 object stays in memory
    this.p5.removeCanvas();
  }
}
</script>
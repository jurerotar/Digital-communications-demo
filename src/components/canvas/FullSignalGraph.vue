<template>
  <AppSectionHeading>
    {{ title }}
  </AppSectionHeading>
  <CanvasContainer>
    <div :id="canvasId" />
  </CanvasContainer>
</template>


<script>
import AppSectionHeading from "@components/common/AppSectionHeading.vue";
import P5 from 'p5';
import CanvasContainer from "@components/common/AppCanvasContainer.vue";
import '@interfaces/common.ts';

export default {
  name: "FullSignalGraph",
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
    verticalPool: {
      type: Array,
      required: false,
      default() {
        return [1, 0.5, -0.5, -1];
      }
    },
    horizontalPool: {
      type: Array,
      required: false,
      default() {
        return [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6];
      }
    },
    type: {
      type: String,
      required: true
    },
    yAxisLabel: {
      type: String,
      required: false,
      default(){
        return 'x(t)'
      }
    },
    xAxisLabel: {
      type: String,
      required: false,
      default(){
        return 't'
      }
    }
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
    isBinary() {
      return ['square'].includes(this.type);
    },
    isCorrelation(){
      return ['correlation'].includes(this.type);
    },
    isCorrelationFunction(){
      return ['correlationFunction'].includes(this.type);
    },
    normalizedData() {
      const max = Math.max(...this.data.map(el => Math.abs(el)));
      return this.data.map(el => el / max);
    },
  },
  mounted() {
    // Initiate new P5 instance and create canvas
    this.p5 = new P5((p5) => {
      this.$c.setup(p5, {frameRate: 5});
      p5.draw = () => {
        p5.background(this.$c.background());
        const [canvasDimensions, canvasPadding] = [this.$c.dimensions, this.$c.canvasPadding];

        p5.stroke(0);
        this.$c.temporaryState(p5, () => {
          const color = this.$c.scale();
          p5.stroke(color);
          p5.strokeWeight(1);
          this.$c.widerLine(p5, canvasDimensions.x / 2 - canvasPadding, canvasPadding, canvasDimensions.x / 2 - canvasPadding, canvasDimensions.y - canvasPadding);
          // Top-bottom line
          this.$c.widerLine(p5, canvasDimensions.x / 2 - canvasPadding, canvasPadding, canvasDimensions.x / 2 - canvasPadding, canvasDimensions.y - canvasPadding);
          p5.strokeWeight(1);
          const yAxisLabels = [...this.verticalPool];
          const xAxisLabels = this.horizontalPool;
          //this.$c.linearSpace(this.max, -this.max, 4);
          yAxisLabels.splice(2, 0, 0);
          for (let i = 0; i <= 20; i++) {
            if (i % 5 === 0 && i !== 10) {
              p5.text(`${yAxisLabels[Math.trunc(i / 5)]}`.substring(0, 4), canvasDimensions.x / 2 - 40 - canvasPadding, canvasPadding + i * 10 + 3);
              this.$c.widerLine(p5, canvasDimensions.x / 2 - 5 - canvasPadding, canvasPadding + i * 10, canvasDimensions.x / 2 + 5 - canvasPadding, canvasPadding + i * 10);
            } else {
              p5.line(canvasDimensions.x / 2 - 5 - canvasPadding, canvasPadding + i * 10, canvasDimensions.x / 2 + 5 - canvasPadding, canvasPadding + i * 10);
            }
          }
          for (let i = 0; i <= 60; i++) {
            if (i % 5 === 0 && i !== 30) {
              p5.text(`${xAxisLabels[Math.trunc(i / 5)]}`.substring(0, 4), i * 10, canvasPadding + 125);
              this.$c.widerLine(p5, i * 10, canvasDimensions.y / 2 + 5, i * 10, canvasDimensions.y / 2 - 5);
            } else {
              p5.line(i * 10, canvasDimensions.y / 2 + 5, i * 10, canvasDimensions.y / 2 - 5);
            }
          }
          //adds texts on axis
          p5.text(this.yAxisLabel, canvasDimensions.x / 2 - 5 - canvasPadding, 30);
          p5.text(this.xAxisLabel, canvasDimensions.x - 25 - canvasPadding, canvasDimensions.y / 2 + 15);
          //adds arrow on x-axis
          p5.strokeWeight(2);
          p5.fill(color);
          this.$c.drawArrow(p5, p5.createVector(0, canvasDimensions.y / 2), p5.createVector(canvasDimensions.x - 2 * canvasPadding, canvasDimensions.y / 2), color, 7, 0);
          //adds arrow on y-axis
          p5.triangle(300, 43, 296, 50, 304, 50);

        });

        p5.translate(0, 150);
        p5.noFill();
        p5.stroke(this.$c.colors[1]);

        p5.strokeWeight(2);

        // Draw the shape
        p5.beginShape();
        if (this.isBinary) {
          let previousY = 0;
          this.normalizedData.forEach((y, x) => {
            // When value changes, start drawing on previous index to prevent skewed lines
            p5.vertex((previousY !== y) ? x - 1 : x, y * (this.offset.y - (canvasPadding - 25)));
            previousY = y;
          });
        }
        else if(this.isCorrelation || this.isCorrelationFunction){
          this.data.forEach((y, x) => p5.vertex(x, y * (this.offset.y - (canvasPadding - 25))));
        }
        else {
          this.normalizedData.forEach((y, x) => p5.vertex(x, y * (this.offset.y - (canvasPadding - 25))));
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

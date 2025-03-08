<template>
  <AppSectionHeading>
    {{ name }}
  </AppSectionHeading>
  <slot />
  <CanvasContainer>
    <div :id="canvasId" />
  </CanvasContainer>
</template>

<script>
import AppSectionHeading from '@components/common/AppSectionHeading.vue';
import P5 from 'p5';
import CanvasContainer from '@components/common/AppCanvasContainer.vue';
import '@interfaces/common.ts';

export default {
  name: 'OscilloscopeGraph',
  components: { AppSectionHeading, CanvasContainer },

  props: {
    data: {
      type: Array,
      required: true,
    },
    canvasId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    symbolLength: {
      type: Number,
      required: true,
    },
    speed: {
      type: Number,
      required: false,
      default: 1,
    },
    ticks: {
      type: Array,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      p5: null,
      /** @type {Coordinates} */
      offset: {
        x: 0,
        y: 125,
      },
    };
  },
  mounted() {
    // Initiate new P5 instance and create canvas
    this.p5 = new P5((p5) => {
      this.$c.setup(p5);
      p5.draw = () => {
        p5.background(this.$c.background());

        const canvasPadding = this.$c.canvasPadding;
        const canvasDimensions = { x: 2 * 2 * this.symbolLength * this.speed + 2 * canvasPadding, y: this.$c.dimensions.y };
        // adjust canvas dimensions: 2 * because signal is stretched, 2*because we display 1/2+1+1/2= 2 symbols

        this.$c.temporaryState(p5, () => {
          const color = this.$c.scale();
          p5.stroke(color);

          // Left vertical line
          this.$c.widerLine(p5, 0, 0, 0, canvasDimensions.y);
          // Right vertical line
          this.$c.widerLine(p5, canvasDimensions.x - 2 * canvasPadding, 0, canvasDimensions.x - 2 * canvasPadding, canvasDimensions.y);
          // Top horizontal wide line
          this.$c.widerLine(p5, 0, 0, canvasDimensions.x - 2 * canvasPadding, 0);
          // Bottom horizontal wide line
          this.$c.widerLine(p5, 0, canvasDimensions.y, canvasDimensions.x - 2 * canvasPadding, canvasDimensions.y);

          // Middle horizontal thin lines
          this.$c.widerLine(p5, 0, canvasPadding, canvasDimensions.x - 2 * canvasPadding, canvasPadding, 0.25);
          this.$c.widerLine(
            p5,
            0,
            canvasDimensions.y - canvasPadding,
            canvasDimensions.x - 2 * canvasPadding,
            canvasDimensions.y - canvasPadding,
            0.25
          );
          this.$c.widerLine(
            p5,
            0,
            canvasPadding + 0.33 * (canvasDimensions.y - 2 * canvasPadding),
            canvasDimensions.x - 2 * canvasPadding,
            canvasPadding + 0.33 * (canvasDimensions.y - 2 * canvasPadding),
            0.25
          );
          this.$c.widerLine(
            p5,
            0,
            canvasPadding + 0.66 * (canvasDimensions.y - 2 * canvasPadding),
            canvasDimensions.x - 2 * canvasPadding,
            canvasPadding + 0.66 * (canvasDimensions.y - 2 * canvasPadding),
            0.25
          );

          p5.textAlign(p5.LEFT, p5.TOP);
          p5.stroke('#00ff00');
          this.ticks.forEach((x) => {
            this.$c.widerLine(p5, this.speed * 2 * x, 0, this.speed * 2 * x, canvasDimensions.y, 0.5);
            p5.strokeWeight(1);
            p5.text('ts', this.speed * 2 * x + 2, canvasDimensions.y * 0.95);
          });
        });

        p5.noFill();
        p5.stroke(this.$c.colors[1]);
        p5.strokeWeight(2);

        for (let i = this.data.length - 1; i >= 0; i--) {
          p5.beginShape();
          const t = i / (this.data.length - 1);
          const alpha = -0.0078 * (Math.exp(4.86 * t) - 1) + 1;
          let color = p5.color(this.$c.colors[1]);

          if (i === 0) {
            // is the latest line?
            let p = this.data[i].length / (2 * this.symbolLength);
            p = 0.0078 * (Math.exp(4.86 * p) - 1);

            color = p5.lerpColor(p5.color(this.$c.scale()), p5.color(this.$c.colors[1]), p);
          }
          p5.stroke(color.levels[1], color.levels[2], color.levels[3], alpha * 255);

          this.data[i].forEach((y, x) => {
            p5.vertex(this.speed * 2 * x, y * (this.offset.y - canvasPadding / 2) + this.offset.y + canvasPadding / 2);
          });
          p5.endShape();
        }
      };
      p5.removeCanvas = () => p5.remove();
    }, this.canvasId);
  },
  unmounted() {
    // Remove canvas, otherwise P5 object stays in memory
    this.p5.removeCanvas();
  },
};
</script>

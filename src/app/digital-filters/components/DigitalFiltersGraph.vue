<template>
  <CanvasContainer>
    <div :id="canvasId" />
  </CanvasContainer>
</template>

<script>
import P5 from 'p5';
import CanvasContainer from '@components/common/AppCanvasContainer.vue';
import '@interfaces/common.ts';

export default {
  name: 'DigitalFiltersGraph',
  components: { CanvasContainer },
  props: {
    data: {
      type: Array,
      required: true,
    },
    canvasId: {
      type: String,
      required: true,
    },
    mirror: {
      type: Boolean,
      required: false,
      default() {
        return true;
      },
    },
    yAxisLabel: {
      type: String,
      required: false,
      default() {
        return 'x(t)';
      },
    },
    xAxisLabel: {
      type: String,
      required: false,
      default() {
        return 't';
      },
    },
  },

  data() {
    return {
      p5: null,
      /** @type {Coordinates} */
      offset: {
        x: 100,
        y: 125,
      },
      mathDimension: {
        x: 10,
        y: 5,
      },
      unitLengthSet: [0.1, 0.5, 1, 5, 10, 20, 50, 100],
      canvasData: [],
    };
  },

  mounted() {
    this.p5 = new P5((p5) => {
      this.$c.setup(p5, { frameRate: 5 });
      p5.draw = () => {
        p5.background(this.$c.background());
        p5.stroke(0);

        this.$c.temporaryState(p5, () => {
          this.getMathDimensions();
          this.getSignalOffset();
          const color = this.$c.scale();
          p5.stroke(color);
          this.drawAxis();
          p5.strokeWeight(1);
          this.drawGuideLines();
        });
        this.transformSignalToCanvas();

        p5.noFill();
        p5.stroke(this.$c.colors[1]);
        p5.strokeWeight(2);

        p5.beginShape();
        for (let i = 0; i < this.canvasData.length; i++) {
          p5.vertex(this.canvasData[i].x, this.canvasData[i].y);
        }
        p5.endShape();
        if (this.mirror) {
          p5.noFill();
          p5.stroke(this.$c.colors[2]);
          p5.strokeWeight(2);
          p5.beginShape();
          for (let i = this.canvasData.length - 1; i > this.canvasData.length - this.canvasData.length / 2; i--) {
            const pointMirror = this.mathToCanvasTransform({ x: 2 - this.data[i].x, y: this.data[i].y });
            p5.vertex(pointMirror.x, pointMirror.y);
          }
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

  methods: {
    mathToCanvasTransform(point) {
      const mx = this.mathDimension.x;
      const my = this.mathDimension.y;
      const ox = this.offset.x;
      const oy = this.offset.y;
      const cx = this.$c.dimensions.x;
      const cy = this.$c.dimensions.y;
      const x = (point.x / mx) * cx + ox;
      const y = (-point.y / my) * cy + oy;
      return { x: x, y: y };
    },
    getSignalRange() {
      let x_max = this.data[0].x;
      let x_min = this.data[0].x;
      let y_max = this.data[0].y;
      let y_min = this.data[0].y;
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].x > x_max) {
          x_max = this.data[i].x;
        }
        if (this.data[i].x < x_min) {
          x_min = this.data[i].x;
        }
        if (this.data[i].y > y_max) {
          y_max = this.data[i].y;
        }
        if (this.data[i].y < y_min) {
          y_min = this.data[i].y;
        }
      }

      return { x1: x_min, x2: x_max, y1: y_min, y2: y_max };
    },
    getMathDimensions() {
      const signalRange = this.getSignalRange();

      let dx = signalRange.x2 - signalRange.x1;
      let dy = signalRange.y2 - signalRange.y1;

      if (Math.abs(dx) < 1) {
        dx = 1;
      }
      if (Math.abs(dy) < 1) {
        dy = 1;
      }

      this.mathDimension = { x: dx * 1.3, y: dy * 1.3 };
    },
    getSignalOffset() {
      const signalRange = this.getSignalRange();
      const mathDimension = this.mathDimension;
      const canvasDimension = this.$c.dimensions;

      const newOffsetX = 10;
      const newOffsetY = (signalRange.y2 * canvasDimension.y) / mathDimension.y + 40;

      this.offset = { x: newOffsetX, y: newOffsetY };
    },
    drawAxis() {
      this.$c.drawAxis(this.p5, this.offset);
    },
    drawGuideLines() {
      const horizontalPool = this.getHorizontalPool();
      const verticalPool = this.getVerticalPool();
      for (let i = 0; i < horizontalPool.length; i++) {
        const p = this.mathToCanvasTransform({ x: horizontalPool[i], y: 0 });
        this.$c.widerLine(this.p5, p.x, p.y - 5, p.x, p.y + 5, 3);
        this.p5.textSize(15);
        this.p5.text(horizontalPool[i].toFixed(Math.abs(horizontalPool[i]) < 5 ? 1 : 0), p.x + 8, p.y - 4);
      }
      for (let i = 0; i < verticalPool.length; i++) {
        const p = this.mathToCanvasTransform({ x: 0, y: verticalPool[i] });
        this.$c.widerLine(this.p5, p.x - 5, p.y, p.x + 5, p.y, 3);
        this.p5.textSize(15);
        this.p5.text(verticalPool[i].toFixed(1), p.x + 8, p.y + 4);
      }

      this.drawLabelX();
      this.drawLabelY();
    },
    drawLabelX() {
      this.p5.textSize(15);
      this.p5.text(this.xAxisLabel, this.$c.dimensions.x - this.xAxisLabel.length * 9, this.offset.y + 16);
    },
    drawLabelY() {
      this.p5.textSize(15);
      this.p5.text(this.yAxisLabel, this.offset.x + 30, 13);
    },
    getHorizontalPool() {
      const unitLengthDesired = 100;
      const unitLengthSet = this.unitLengthSet;
      const mathDimension = this.mathDimension;
      const canvasDimension = this.$c.dimensions;

      let unitLengthStep = unitLengthSet[0];
      const unitX = canvasDimension.x / mathDimension.x;

      for (let i = 0; i < unitLengthSet.length; i++) {
        const newUnit = Math.abs(unitX * unitLengthSet[i] - unitLengthDesired);
        const oldUnit = Math.abs(unitX * unitLengthStep - unitLengthDesired);
        if (newUnit < oldUnit) {
          unitLengthStep = unitLengthSet[i];
        }
      }

      const horizontalPool = [];
      const positiveNumUnits = Math.round((canvasDimension.x - this.offset.x) / (unitX * unitLengthStep));
      const negativeNumUnits = Math.round(this.offset.x / (unitX * unitLengthStep));

      for (let i = -negativeNumUnits; i < positiveNumUnits + 1; i++) {
        if (i !== 0) {
          horizontalPool.push(i * unitLengthStep);
        } else {
          horizontalPool.push(0);
        }
      }
      return horizontalPool;
    },

    getVerticalPool() {
      const unitLengthDesired = 50;
      const unitLengthSet = this.unitLengthSet;
      const mathDimension = this.mathDimension;
      const canvasDimension = this.$c.dimensions;

      let unitLengthStep = unitLengthSet[0];
      const unitY = canvasDimension.y / mathDimension.y;

      for (let i = 0; i < unitLengthSet.length; i++) {
        const newUnit = Math.abs(unitY * unitLengthSet[i] - unitLengthDesired);
        const oldUnit = Math.abs(unitY * unitLengthStep - unitLengthDesired);
        if (newUnit < oldUnit) {
          unitLengthStep = unitLengthSet[i];
        }
      }

      const verticalPool = [];
      const negativeNumUnits = Math.round((canvasDimension.y - this.offset.y) / (unitY * unitLengthStep));
      const positiveNumUnits = Math.round(this.offset.y / (unitY * unitLengthStep));

      for (let i = -negativeNumUnits; i < positiveNumUnits + 1; i++) {
        if (i !== 0) {
          verticalPool.push(i * unitLengthStep);
        }
      }
      return verticalPool;
    },

    transformSignalToCanvas() {
      const canvasData = [];
      for (let i = 0; i < this.data.length; i++) {
        canvasData.push(this.mathToCanvasTransform({ x: this.data[i].x, y: this.data[i].y }));
      }
      this.canvasData = canvasData;
    },
  },
};
</script>
